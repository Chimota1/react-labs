import { useEffect, useState } from 'react'

export function useLocalStorage<T>(
  key: string,
  initialValue: T,
): [T, (value: T | ((prev: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key)
      if (item !== null) {
        return JSON.parse(item) as T
      }
    } catch (error) {
      console.warn(`[useLocalStorage] Error reading key "${key}":`, error)
    }
    return initialValue
  })

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue))
    } catch (error) {
      console.warn(`[useLocalStorage] Error saving key "${key}":`, error)
    }
  }, [key, storedValue])

  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === key && event.newValue !== null) {
        try {
          setStoredValue(JSON.parse(event.newValue) as T)
        } catch (error) {
          console.warn(`[useLocalStorage] Error parsing storage event for key "${key}":`, error)
        }
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [key])

  return [storedValue, setStoredValue]
}
