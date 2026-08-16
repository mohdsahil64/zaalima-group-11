import { GoogleGenerativeAI } from '@google/generative-ai';
import OpenAI from 'openai';
import Application from '../models/Application.js';
import Job from '../models/Job.js';
import config from '../config/index.js';

class AIService {
  constructor() {
    this.gemini = null;
    this.openai = null;
    this.provider = null;
  }

  _init() {
    if (this.provider) return;

    if (config.google.aiApiKey) {
      const genAI = new GoogleGenerativeAI(config.google.aiApiKey);
      this.gemini = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      this.provider = 'gemini';
    } else if (config.openai.apiKey) {
      this.openai = new OpenAI({ apiKey: config.openai.apiKey });
      this.provider = 'openai';
    }
  }

  isConfigured() {
    this._init();
    return !!this.provider;
  }

  /**
   * Analyze a resume against a job description
   * @param {string} resumeText - Parsed resume text
   * @param {Object} job - Job document with title, description, skills, requirements
   * @returns {Object} AI analysis result
   */
  async analyzeResume(resumeText, job) {
    this._init();

    if (!this.provider) {
      console.warn('[AI] No AI provider configured. Set GOOGLE_AI_API_KEY or OPENAI_API_KEY.');
      return null;
    }

    const prompt = this._buildPrompt(resumeText, job);

    try {
      let responseText;

      if (this.provider === 'gemini') {
        responseText = await this._callGemini(prompt);
      } else {
        responseText = await this._callOpenAI(prompt);
      }

      return this._parseResponse(responseText);
    } catch (error) {
      console.error(`[AI] ${this.provider} analysis error:`, error.message);
      return null;
    }
  }

  /**
   * Analyze and save results to an application
   */
  async analyzeAndSave(applicationId) {
    try {
      const application = await Application.findById(applicationId).populate('job');
      if (!application) return null;

      // Need parsed resume text
      const resumeText = application.parsedResume?.rawText;
      if (!resumeText) {
        await Application.findByIdAndUpdate(applicationId, { aiStatus: 'failed' });
        return null;
      }

      // Update status
      await Application.findByIdAndUpdate(applicationId, { aiStatus: 'processing' });

      const job = application.job;
      const result = await this.analyzeResume(resumeText, job);

      if (result) {
        await Application.findByIdAndUpdate(applicationId, {
          aiScore: result.matchScore,
          aiAnalysis: {
            matchScore: result.matchScore,
            skillsMatched: result.skillsMatched || [],
            skillsMissing: result.skillsMissing || [],
            experienceMatch: result.experienceMatch,
            summary: result.summary,
            recommendation: result.recommendation,
          },
          aiStatus: 'analyzed',
        });
        return result;
      } else {
        await Application.findByIdAndUpdate(applicationId, { aiStatus: 'failed' });
        return null;
      }
    } catch (error) {
      console.error('[AI] analyzeAndSave error:', error.message);
      await Application.findByIdAndUpdate(applicationId, { aiStatus: 'failed' });
      return null;
    }
  }

  async _callGemini(prompt) {
    const result = await this.gemini.generateContent(prompt);
    return result.response.text();
  }

  async _callOpenAI(prompt) {
    const completion = await this.openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are an expert ATS resume analyzer. Always respond with valid JSON only.' },
        { role: 'user', content: prompt },
      ],
      temperature: 0.3,
      max_tokens: 1000,
    });
    return completion.choices[0].message.content;
  }

  _buildPrompt(resumeText, job) {
    const jobSkills = job.skills?.join(', ') || '';
    const jobRequirements = job.requirements?.join(', ') || '';

    return `Analyze this candidate's resume against the job description. Return ONLY valid JSON.

JOB TITLE: ${job.title}
JOB DESCRIPTION: ${job.description?.substring(0, 1500)}
REQUIRED SKILLS: ${jobSkills}
REQUIREMENTS: ${jobRequirements}
EXPERIENCE LEVEL: ${job.experience || 'not specified'}

CANDIDATE RESUME:
${resumeText.substring(0, 3000)}

Return a JSON object with exactly this structure:
{
  "matchScore": <number 0-100>,
  "skillsMatched": [<skills the candidate has that match the job>],
  "skillsMissing": [<required skills the candidate is missing>],
  "experienceMatch": <true/false>,
  "summary": "<2-3 sentence summary of the candidate's fit>",
  "recommendation": "<one of: strong_match, good_match, partial_match, weak_match>"
}

Be fair and objective. Only return JSON, no other text.`;
  }

  _parseResponse(responseText) {
    try {
      // Clean response - extract JSON from potential markdown code blocks
      let cleaned = responseText.trim();
      if (cleaned.startsWith('```')) {
        cleaned = cleaned.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '');
      }

      const result = JSON.parse(cleaned);

      // Validate and sanitize
      return {
        matchScore: Math.max(0, Math.min(100, Number(result.matchScore) || 0)),
        skillsMatched: Array.isArray(result.skillsMatched) ? result.skillsMatched.slice(0, 20) : [],
        skillsMissing: Array.isArray(result.skillsMissing) ? result.skillsMissing.slice(0, 20) : [],
        experienceMatch: Boolean(result.experienceMatch),
        summary: String(result.summary || '').substring(0, 500),
        recommendation: ['strong_match', 'good_match', 'partial_match', 'weak_match'].includes(result.recommendation)
          ? result.recommendation
          : 'partial_match',
      };
    } catch (error) {
      console.error('[AI] Failed to parse AI response:', error.message);
      return null;
    }
  }
}

export default new AIService();
