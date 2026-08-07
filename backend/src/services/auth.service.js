import User from '../models/User.js';
import Recruiter from '../models/Recruiter.js';
import Applicant from '../models/Applicant.js';
import ApiError from '../utils/ApiError.js';
import { generateToken, hashToken } from '../utils/helpers.js';

class AuthService {
  async register({ firstName, lastName, email, password, role, company }) {
    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw ApiError.conflict('Email already registered');
    }

    // Create user
    const user = await User.create({
      firstName,
      lastName,
      email,
      password,
      role: role || 'applicant',
    });

    // Create role-specific profile
    if (user.role === 'recruiter') {
      await Recruiter.create({
        user: user._id,
        company: company || 'Not specified',
      });
    } else if (user.role === 'applicant') {
      await Applicant.create({
        user: user._id,
      });
    }

    return user;
  }

  async login({ email, password }) {
    // Find user with password field
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      throw ApiError.unauthorized('Invalid email or password');
    }

    // Check if account is active
    if (!user.isActive) {
      throw ApiError.forbidden('Account has been deactivated');
    }

    // Verify password
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

    // Generate reset token
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
