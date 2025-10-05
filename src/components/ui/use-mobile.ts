import { useState, useEffect } from 'react'

const MOBILE_BREAKPOINT = 1024

export function useMobile() {
  const [isMobile, setIsMobile] = useState<boolean>(false)
  const [isLoaded, setIsLoaded] = useState<boolean>(false)

  useEffect(() => {
    const updateMobileState = () => {
      const isMobileNow = window.innerWidth < MOBILE_BREAKPOINT
      setIsMobile(isMobileNow)
      setIsLoaded(true)
    }

    // Set initial value
    updateMobileState()
    
    // Create media query listener
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    
    // Add event listener
    mql.addEventListener('change', updateMobileState)
    
    // Cleanup
    return () => mql.removeEventListener('change', updateMobileState)
  }, []) // Empty dependency array to ensure this only runs once

  return { isMobile, isLoaded }
}