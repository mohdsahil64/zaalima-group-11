import { Card, PageHeader, Input, Textarea, Select, Button } from '@/components/common';
import { COMPANY_SIZES } from '@/constants';

const RecruiterCompany = () => {
  return (
    <div>
      <PageHeader
        title="Company Profile"
        subtitle="Manage your company information"
      />

      <Card>
        <form className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Input label="Company Name" placeholder="Enter company name" />
            <Input label="Email" type="email" placeholder="company@example.com" />
            <Input label="Website" placeholder="https://company.com" />
            <Select label="Industry" options={[
              { value: 'technology', label: 'Technology' },
              { value: 'finance', label: 'Finance' },
              { value: 'healthcare', label: 'Healthcare' },
              { value: 'education', label: 'Education' },
              { value: 'retail', label: 'Retail' },
              { value: 'other', label: 'Other' },
            ]} placeholder="Select industry" />
            <Select label="Company Size" options={COMPANY_SIZES} placeholder="Select size" />
            <Input label="Location" placeholder="City, Country" />
          </div>
          <Textarea label="Description" placeholder="Tell us about your company..." rows={4} />
          <div className="flex justify-end">
            <Button type="button">Save Changes</Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default RecruiterCompany;
