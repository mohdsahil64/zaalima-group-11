import { HiDocumentArrowUp, HiCloudArrowUp } from 'react-icons/hi2';
import { Card, PageHeader, Button } from '@/components/common';

const ApplicantResume = () => {
  return (
    <div>
      <PageHeader
        title="My Resume"
        subtitle="Upload and manage your resume"
      />

      <Card>
        <div className="text-center py-12">
          <div className="w-16 h-16 rounded-full bg-primary/10 mx-auto mb-4 flex items-center justify-center">
            <HiDocumentArrowUp className="w-8 h-8 text-primary" />
          </div>
          <h3 className="text-lg font-semibold text-text mb-2">Upload Your Resume</h3>
          <p className="text-sm text-text-secondary max-w-sm mx-auto mb-6">
            Upload your resume in PDF or DOCX format. Max file size: 5MB.
          </p>
          <div className="border-2 border-dashed border-border rounded-[12px] p-8 max-w-md mx-auto mb-6 hover:border-primary/50 transition-colors cursor-pointer">
            <HiCloudArrowUp className="w-10 h-10 text-text-secondary mx-auto mb-3" />
            <p className="text-sm text-text-secondary">
              Drag and drop your file here, or click to browse
            </p>
            <p className="text-xs text-text-secondary mt-1">PDF, DOC, DOCX up to 5MB</p>
          </div>
          <Button icon={HiCloudArrowUp}>Upload Resume</Button>
        </div>
      </Card>
    </div>
  );
};

export default ApplicantResume;
