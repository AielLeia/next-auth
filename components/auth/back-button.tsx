'use client';

import Link from 'next/link';

import { Button } from '@/components/ui/button';

type BackButtonType = {
  label: string;
  href: string;
};

const BackButton = ({ label, href }: BackButtonType) => {
  return (
    <Button variant="link" className="font-normal w-full" size="sm" asChild>
      <Link href={href}>{label}</Link>
    </Button>
  );
};

export default BackButton;
