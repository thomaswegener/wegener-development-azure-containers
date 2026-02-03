import { useEffect, useState } from 'react'
import type { AboutProfile, ApiSource } from '@shared/contentTypes'
import { fetchAbout } from '../services/api'

export const useAboutContent = () => {
  const [profiles, setProfiles] = useState<AboutProfile[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [source, setSource] = useState<ApiSource>('sample')
  const [lastSynced, setLastSynced] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true

    const load = async () => {
      setIsLoading(true)
      try {
        const response = await fetchAbout()
        if (!mounted) return
        setProfiles(response.profiles)
        setSource(response.source)
        setLastSynced(response.lastSynced)
        setError(null)
      } catch (err) {
        if (!mounted) return
        setError(
          err instanceof Error
            ? err.message
            : 'Klarte ikke å hente innholdet fra Notion.',
        )
      } finally {
        if (mounted) {
          setIsLoading(false)
        }
      }
    }

    void load()
    return () => {
      mounted = false
    }
  }, [])

  return {
    profiles,
    isLoading,
    error,
    meta: {
      lastSynced,
      source,
    },
  }
}
