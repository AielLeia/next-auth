import { ExclamationTriangleIcon } from '@radix-ui/react-icons';

import CardWrapper from '@/components/auth/card-wrapper';

const ErrorCard = () => {
  return (
    <CardWrapper
      headerLabel={'Oops ! Something went wrong'}
      backButtonLabel={'Back to login'}
      backButtonHref={'/auth/login'}
    >
      <div className="w-full flex justify-center items-center">
        <ExclamationTriangleIcon className="text-destructive w-10 h-10" />
      </div>
    </CardWrapper>
  );
};

export default ErrorCard;
