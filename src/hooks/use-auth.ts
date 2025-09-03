// src/hooks/use-auth.ts
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export function useAuth(requireAuth = false) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (requireAuth && status === 'unauthenticated') {
      router.push('/auth/login');
    }
  }, [requireAuth, status, router]);

  return {
    user: session?.user,
    isLoading: status === 'loading',
    isAuthenticated: status === 'authenticated',
  };
}

export function useRequireAuth() {
  return useAuth(true);
}

export function useRole(requiredRole: string) {
  const { user, isLoading, isAuthenticated } = useAuth(true);

  const hasRole = user?.vai_tro === requiredRole;
  const isAdmin = user?.vai_tro === 'admin';

  return {
    user,
    hasRole,
    isAdmin,
    isLoading,
    isAuthenticated,
  };
}

export function useRequireRole(requiredRole: string) {
  const { user, hasRole, isLoading } = useRole(requiredRole);
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && user && !hasRole) {
      router.push('/dashboard');
    }
  }, [hasRole, isLoading, user, router]);

  return { user, hasRole, isLoading };
}