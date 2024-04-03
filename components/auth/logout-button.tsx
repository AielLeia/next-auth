'use client';

import React from 'react';

import { logout } from '@/actions/logout';

type LogoutButtonProps = {
  children?: React.ReactNode;
};

const LogoutButton = ({ children }: LogoutButtonProps) => {
  const onClick = async () => {
    await logout();
  };

  return (
    <span className="cursor-pointer" onClick={onClick}>
      {children}
    </span>
  );
};

export default LogoutButton;
