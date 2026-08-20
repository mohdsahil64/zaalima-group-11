import { Link } from 'react-router-dom';
import { Button } from '@/components/common';
import { HiHome } from 'react-icons/hi2';

const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 page-enter">
      <div className="text-center">
        <p className="text-6xl font-bold text-primary mb-3">404</p>
        <h2 className="text-lg font-semibold text-text mb-1">Page not found</h2>
        <p className="text-sm text-text-muted mb-6 max-w-xs mx-auto">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link to="/">
          <Button icon={HiHome}>Back to Home</Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
