import User from '../models/User.js';
import Applicant from '../models/Applicant.js';
import ApiError from '../utils/ApiError.js';

class UserService {
  async getProfile(userId) {
    const user = await User.findById(userId);
    if (!user) {
      throw ApiError.notFound('User not found');
    }

    // If applicant, also return applicant profile
    let applicantProfile = null;
    if (user.role === 'applicant') {
      applicantProfile = await Applicant.findOne({ user: userId }).lean();
    }

    return { user, applicantProfile };
  }

  async updateProfile(userId, updateData) {
    // Fields on the User model
    const userFields = ['firstName', 'lastName', 'phone', 'avatar'];
    // Fields on the Applicant model
    const applicantFields = [
      'headline', 'bio', 'skills', 'location', 'portfolio',
      'linkedin', 'github', 'experience', 'education', 'experienceLevel',
    ];

    const userUpdate = {};
    const applicantUpdate = {};

    Object.keys(updateData).forEach((key) => {
      if (userFields.includes(key)) {
        userUpdate[key] = updateData[key];
      } else if (applicantFields.includes(key)) {
        applicantUpdate[key] = updateData[key];
      }
    });

    // Update User document
    let user = await User.findById(userId);
    if (!user) throw ApiError.notFound('User not found');

    if (Object.keys(userUpdate).length > 0) {
      user = await User.findByIdAndUpdate(userId, userUpdate, {
        new: true,
        runValidators: true,
      });
    }

    // Update Applicant document if role is applicant and there are applicant fields
    let applicantProfile = null;
    if (user.role === 'applicant' && Object.keys(applicantUpdate).length > 0) {
      applicantProfile = await Applicant.findOneAndUpdate(
        { user: userId },
        { $set: applicantUpdate },
        { new: true, upsert: true, runValidators: true }
      );
    } else if (user.role === 'applicant') {
      applicantProfile = await Applicant.findOne({ user: userId }).lean();
    }

    return { user, applicantProfile };
  }

  async changePassword(userId, currentPassword, newPassword) {
    const user = await User.findById(userId).select('+password');
    if (!user) {
      throw ApiError.notFound('User not found');
    }

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      throw ApiError.badRequest('Current password is incorrect');
    }

    user.password = newPassword;
    await user.save();

    return user;
  }
}

export default new UserService();
