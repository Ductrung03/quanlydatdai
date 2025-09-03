// src/components/auth/rbac.tsx
'use client';

import { useSession } from 'next-auth/react';
import { ReactNode } from 'react';

interface RoleGuardProps {
  children: ReactNode;
  allowedRoles: string[];
  fallback?: ReactNode;
}

export function RoleGuard({ children, allowedRoles, fallback = null }: RoleGuardProps) {
  const { data: session } = useSession();
  
  if (!session?.user?.vai_tro || !allowedRoles.includes(session.user.vai_tro)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

interface AdminGuardProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export function AdminGuard({ children, fallback = null }: AdminGuardProps) {
  return (
    <RoleGuard allowedRoles={['admin']} fallback={fallback}>
      {children}
    </RoleGuard>
  );
}

interface UserGuardProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export function UserGuard({ children, fallback = null }: UserGuardProps) {
  return (
    <RoleGuard allowedRoles={['user', 'admin']} fallback={fallback}>
      {children}
    </RoleGuard>
  );
}