import { useQuery } from '@tanstack/react-query'
import { getMyProfile } from '../api'
import { useSession } from './use-session'

export function useAuth() {
  const { session, isLoading: sessionLoading } = useSession()

  const profileQuery = useQuery({
    queryKey: ['auth', 'profile', session?.user.id],
    queryFn: getMyProfile,
    enabled: !!session,
    staleTime: Infinity,
  })

  const role = profileQuery.data?.role

  return {
    session,
    user: session?.user,
    profile: profileQuery.data ?? null,
    role,
    isAuthenticated: !!session,
    isAdmin: role === 'admin' || role === 'super_admin',
    isSuperAdmin: role === 'super_admin',
    isLoading: sessionLoading || (!!session && profileQuery.isLoading),
  }
}
