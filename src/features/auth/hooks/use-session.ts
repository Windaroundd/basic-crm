import { useEffect } from 'react'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { getSession } from '../api'

const SESSION_KEY = ['auth', 'session'] as const

export function useSession() {
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: SESSION_KEY,
    queryFn: getSession,
    staleTime: Infinity,
  })

  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      queryClient.setQueryData(SESSION_KEY, session)
    })
    return () => data.subscription.unsubscribe()
  }, [queryClient])

  return {
    session: query.data,
    user: query.data?.user,
    isLoading: query.isLoading,
    isAuthenticated: !!query.data,
  }
}
