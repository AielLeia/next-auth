'use client';

import { logout } from '@/actions/logout';

import { Button } from '@/components/ui/button';

const SettingsPage = () => {
  return (
    <div className="bg-white p-10 rounded-xl">
      <Button onClick={() => logout()} type="submit">
        Sign out
      </Button>
    </div>
  );
};

export default SettingsPage;
