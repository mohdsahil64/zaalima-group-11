import pdfParse from 'pdf-parse';
import Application from '../models/Application.js';
import s3Service from './s3.service.js';

class ParserService {
  /**
   * Parse a resume from its buffer (PDF)
   * @param {Buffer} fileBuffer
   * @returns {Object} parsed data
   */
  async parseFromBuffer(fileBuffer) {
    try {
      const result = await pdfParse(fileBuffer);
      const rawText = result.text || '';
      return this._extractStructured(rawText);
    } catch (error) {
      console.error('[Parser] PDF parse error:', error.message);
      return { rawText: '', skills: [], experience: null, education: null };
    }
  }

  /**
   * Parse resume already stored in S3 (by key)
   * Downloads the file then parses it.
   */
  async parseFromS3(key) {
    if (!s3Service.isConfigured()) {
      // Can't download from S3 - return empty
      return { rawText: '', skills: [], experience: null, education: null };
    }

    try {
      const { GetObjectCommand } = await import('@aws-sdk/client-s3');
      const command = new GetObjectCommand({
        Bucket: s3Service.bucket,
        Key: key,
      });
      const response = await s3Service.client.send(command);

      // Convert stream to buffer
      const chunks = [];
      for await (const chunk of response.Body) {
        chunks.push(chunk);
      }
      const buffer = Buffer.concat(chunks);
      return this.parseFromBuffer(buffer);
    } catch (error) {
      console.error('[Parser] S3 download/parse error:', error.message);
      return { rawText: '', skills: [], experience: null, education: null };
    }
  }

  /**
   * Parse and save results to an application
   */
  async parseAndSave(applicationId, fileBuffer) {
    try {
      // Update status to processing
      await Application.findByIdAndUpdate(applicationId, { aiStatus: 'processing' });

      const parsed = await this.parseFromBuffer(fileBuffer);

      // Save parsed results
      await Application.findByIdAndUpdate(applicationId, {
        parsedResume: {
          rawText: parsed.rawText.substring(0, 50000), // Cap at 50k chars
          skills: parsed.skills,
          experience: parsed.experience,
          education: parsed.education,
          parsedAt: new Date(),
        },
      });

      return parsed;
    } catch (error) {
      console.error('[Parser] parseAndSave error:', error.message);
      // Don't change aiStatus on parse failure alone - AI step handles that
      return null;
    }
  }

  /**
   * Extract structured info from raw resume text
   */
  _extractStructured(rawText) {
    const text = rawText.trim();

    return {
      rawText: text,
      skills: this._extractSkills(text),
      experience: this._extractSection(text, ['experience', 'work experience', 'employment', 'work history']),
      education: this._extractSection(text, ['education', 'academic', 'qualification', 'degree']),
    };
  }

  /**
   * Extract skills using common tech keyword matching
   */
  _extractSkills(text) {
    const commonSkills = [
      'JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'C#', 'Go', 'Rust', 'Ruby', 'PHP', 'Swift', 'Kotlin',
      'React', 'Angular', 'Vue', 'Next.js', 'Node.js', 'Express', 'Django', 'Flask', 'Spring', 'Laravel',
      'MongoDB', 'PostgreSQL', 'MySQL', 'Redis', 'Elasticsearch', 'DynamoDB', 'Firebase',
      'AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes', 'Terraform', 'CI/CD', 'Jenkins', 'GitHub Actions',
      'HTML', 'CSS', 'SASS', 'Tailwind', 'Bootstrap', 'Material UI',
      'REST', 'GraphQL', 'gRPC', 'WebSocket', 'Microservices',
      'Git', 'Linux', 'Agile', 'Scrum', 'Jira',
      'Machine Learning', 'Deep Learning', 'NLP', 'Computer Vision', 'TensorFlow', 'PyTorch',
      'Data Analysis', 'SQL', 'Tableau', 'Power BI', 'Excel',
      'Figma', 'Adobe XD', 'Photoshop', 'UI/UX',
      'Communication', 'Leadership', 'Problem Solving', 'Team Management', 'Project Management',
    ];

    const textLower = text.toLowerCase();
    const found = commonSkills.filter((skill) =>
      textLower.includes(skill.toLowerCase())
    );

    return [...new Set(found)];
  }

  /**
   * Extract a section from resume text by heading keywords
   */
  _extractSection(text, headings) {
    const lines = text.split('\n');
    let capturing = false;
    let section = [];

    for (const line of lines) {
      const lineLower = line.toLowerCase().trim();

      // Check if this line is a section header we want
      if (headings.some((h) => lineLower.startsWith(h) || lineLower === h)) {
        capturing = true;
        continue;
      }

      // Check if we've hit a different section header (stop capturing)
      if (capturing && lineLower.length > 0) {
        const isNewSection = /^(skills|education|experience|projects|certifications|references|summary|objective|languages|hobbies|interests|awards|publications)/i.test(lineLower);
        if (isNewSection) break;
        section.push(line.trim());
      }
    }

    const result = section.join('\n').trim();
    return result.length > 0 ? result.substring(0, 3000) : null;
  }
}

export default new ParserService();
