import User from '../models/User.js';
import Company from '../models/Company.js';
import Recruiter from '../models/Recruiter.js';
import Applicant from '../models/Applicant.js';
import ApiError from '../utils/ApiError.js';
import { generateToken, hashToken } from '../utils/helpers.js';

class AuthService {
  async register({ firstName, lastName, email, password, role, companyName, companyEmail, companyLocation, companyWebsite, industry, companySize, recruiterTitle, phone, jobTitle, experienceLevel, skillsRaw, linkedin, portfolio, location }) {
    // Check if user exists
    const existingUser = await User.findOne({ email }).lean();
    if (existingUser) {
      throw ApiError.conflict('Email already registered');
    }

    // Create user
    const user = await User.create({
      firstName,
      lastName,
      email,
      password,
      phone: phone || null,
      role: role || 'applicant',
    });

    // Create role-specific profile
    if (user.role === 'recruiter') {
      // Create company (starts as pending - needs admin approval)
      const company = await Company.create({
        name: companyName || `${firstName}'s Company`,
        email: companyEmail || email,
        website: companyWebsite || null,
        industry: industry || null,
        size: companySize || null,
        location: companyLocation || null,
        owner: user._id,
        status: 'pending',
      });

      await Recruiter.create({
        user: user._id,
        company: company._id,
        title: recruiterTitle || null,
      });
    } else if (user.role === 'applicant') {
      // Parse skills from comma-separated string if provided
      const skills = skillsRaw
        ? skillsRaw.split(',').map(s => s.trim()).filter(Boolean)
        : [];

      await Applicant.create({
        user: user._id,
        headline: jobTitle || null,
        experienceLevel: experienceLevel || null,
        skills,
        linkedin: linkedin || null,
        portfolio: portfolio || null,
        location: location || null,
      });
    }

    return user;
  }

  async login({ email, password }) {
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      throw ApiError.unauthorized('Invalid email or password');
    }

    if (!user.isActive) {
      throw ApiError.forbidden('Account has been deactivated');
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw ApiError.unauthorized('Invalid email or password');
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save({ validateBeforeSave: false });

    return user;
  }

  async forgotPassword(email) {
    const user = await User.findOne({ email });
    if (!user) {
      throw ApiError.notFound('No account found with that email');
    }

    const resetToken = generateToken(20);
    user.resetPasswordToken = hashToken(resetToken);
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes
    await user.save({ validateBeforeSave: false });

    return resetToken;
  }

  async resetPassword(token, newPassword) {
    const hashedToken = hashToken(token);

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      throw ApiError.badRequest('Invalid or expired reset token');
    }

    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    return user;
  }
}

export default new AuthService();
