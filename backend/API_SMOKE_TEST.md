\# Backend Core Flow Smoke Test



\*\*Date:\*\* 28 August 2026



\## Verified



\- Backend server starts on port 5000.

\- MongoDB Atlas connection succeeds.

\- Health endpoint responds successfully:

&#x20; - `GET /api/v1/health`

\- Applicant login works.

\- Recruiter login works.

\- Recruiter can create and publish a job.

\- Applicant can see the published job.

\- Applicant can submit an application.

\- Recruiter can view the application.

\- Recruiter can change an application status to \*\*Shortlisted\*\*.

\- The application pipeline shows the candidate in the \*\*Shortlisted\*\* stage.



\## Result



The core ATS workflow was tested successfully:



`Recruiter creates job → Applicant applies → Recruiter manages application` 

## Additional Verification — 30 August 2026

- Applicant profile update checked.
- Resume upload checked.
- Published job visibility checked.
- Applicant application history checked.
- Duplicate application protection checked.
- Recruiter job update checked.
- Recruiter application status update checked.
- Application pipeline movement checked.
- Recruiter dashboard statistics checked.

Backend Applicant & Recruiter Flow Test
Date: 31 August 2026

Verified

Applicant profile can be accessed.
Applicant resume upload works.
Applicant application history is displayed.
Duplicate application is rejected.
Recruiter can view own jobs.
Recruiter can view applications.
Recruiter can update application status.
Pipeline reflects the updated application status.

Result

Applicant and recruiter flows were tested successfully, including
duplicate-application protection and application status movement.

## 1 September 2026 — Permission and Error Testing

### Verified

Logged-out users cannot access the recruiter jobs page directly.

Direct access to `/recruiter/jobs` redirects to the Login page.

Applicant users cannot access recruiter pages.

Duplicate application submission is rejected successfully.

A duplicate application does not create a second application.

Recruiter can change the `Backend Test Developer` job status to `Closed`.

Closed jobs do not appear in the applicant's Browse Jobs page.

Recruiter can change the job status back to `Open (Published)`.

The job is available again after being published.

### Result

Role-based access control and application validation were tested successfully.

The tested flow was:

Logout → Direct recruiter URL → Login protection → Applicant permission check → Duplicate application validation → Close job → Verify job is hidden → Re-publish job

All tested permission and validation scenarios passed successfully.
