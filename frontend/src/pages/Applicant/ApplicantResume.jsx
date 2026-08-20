import { useState, useRef } from 'react';
import { useMutation } from '@tanstack/react-query';
import { HiDocumentArrowUp, HiCloudArrowUp, HiCheckCircle, HiDocument } from 'react-icons/hi2';
import ResumeService from '@/services/resume.service';
import { Card, PageHeader, Button } from '@/components/common';
import toast from 'react-hot-toast';

const ApplicantResume = () => {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const uploadMutation = useMutation({
    mutationFn: (file) => ResumeService.upload(file),
    onSuccess: (data) => {
      setUploadedFile(data?.data?.resume || null);
      toast.success('Resume uploaded successfully!');
    },
    onError: (err) => toast.error(err.message || 'Upload failed'),
  });

  const handleFile = (file) => {
    if (!file) return;

    // Validate client-side
    const allowed = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowed.includes(file.type)) {
      toast.error('Only PDF and DOCX files are allowed');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be under 5MB');
      return;
    }

    uploadMutation.mutate(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files[0];
    handleFile(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = () => setDragActive(false);

  return (
    <div>
      <PageHeader title="My Resume" subtitle="Upload and manage your resume" />

      <Card>
        <div className="text-center py-8">
          {uploadedFile ? (
            <div>
              <div className="w-16 h-16 rounded-full bg-success/10 mx-auto mb-4 flex items-center justify-center">
                <HiCheckCircle className="w-8 h-8 text-success" />
              </div>
              <h3 className="text-lg font-semibold text-text mb-2">Resume Uploaded</h3>
              <div className="flex items-center justify-center gap-2 text-sm text-text-secondary mb-4">
                <HiDocument className="w-4 h-4" />
                <span>{uploadedFile.filename}</span>
              </div>
              <Button
                variant="secondary"
                onClick={() => { setUploadedFile(null); fileInputRef.current?.click(); }}
              >
                Replace Resume
              </Button>
            </div>
          ) : (
            <div>
              <div className="w-16 h-16 rounded-full bg-primary/10 mx-auto mb-4 flex items-center justify-center">
                <HiDocumentArrowUp className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-text mb-2">Upload Your Resume</h3>
              <p className="text-sm text-text-secondary max-w-sm mx-auto mb-6">
                Upload your resume in PDF or DOCX format. Max size: 5MB.
                It will be automatically analyzed by AI when you apply for jobs.
              </p>

              <div
                className={`border-2 border-dashed rounded-[12px] p-8 max-w-md mx-auto mb-6 transition-colors cursor-pointer ${
                  dragActive ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
                }`}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onClick={() => fileInputRef.current?.click()}
              >
                <HiCloudArrowUp className="w-10 h-10 text-text-secondary mx-auto mb-3" />
                <p className="text-sm text-text-secondary">
                  {dragActive ? 'Drop your file here' : 'Drag and drop your file here, or click to browse'}
                </p>
                <p className="text-xs text-text-secondary mt-1">PDF, DOC, DOCX up to 5MB</p>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                className="hidden"
                onChange={(e) => handleFile(e.target.files[0])}
              />

              <Button
                icon={HiCloudArrowUp}
                onClick={() => fileInputRef.current?.click()}
                loading={uploadMutation.isPending}
              >
                {uploadMutation.isPending ? 'Uploading...' : 'Select File'}
              </Button>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default ApplicantResume;
