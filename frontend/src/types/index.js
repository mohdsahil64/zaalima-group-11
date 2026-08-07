/**
 * Type definitions placeholder
 * This file serves as a reference for data structures used in the app.
 * Can be converted to TypeScript types when migrating to TS.
 */

/**
 * @typedef {Object} User
 * @property {string} _id
 * @property {string} firstName
 * @property {string} lastName
 * @property {string} email
 * @property {('admin'|'recruiter'|'applicant')} role
 * @property {string|null} avatar
 * @property {string|null} phone
 * @property {boolean} isActive
 * @property {boolean} isVerified
 */

/**
 * @typedef {Object} Job
 * @property {string} _id
 * @property {string} title
 * @property {string} description
 * @property {string} company
 * @property {string} location
 * @property {('full-time'|'part-time'|'contract'|'internship'|'remote')} type
 * @property {('entry'|'mid'|'senior'|'lead'|'executive')} experience
 * @property {{min: number, max: number, currency: string}} salary
 * @property {string[]} skills
 * @property {string[]} requirements
 * @property {string[]} benefits
 * @property {('open'|'closed'|'draft'|'paused')} status
 */

/**
 * @typedef {Object} Application
 * @property {string} _id
 * @property {string|Job} job
 * @property {string|User} applicant
 * @property {string|null} coverLetter
 * @property {('pending'|'reviewing'|'shortlisted'|'interview'|'offered'|'rejected'|'withdrawn')} status
 */

export {};
