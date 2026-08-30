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

