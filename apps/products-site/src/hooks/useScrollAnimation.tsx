import { useEffect, useRef, useState } from 'react'

interface ScrollAnimationOptions {
  threshold?: number
  triggerOnce?: boolean
  delay?: number
  rootMargin?: string
}

export function useScrollAnimation(options: ScrollAnimationOptions = {}) {
  const {
    threshold = 0.1,
    triggerOnce = true,
    delay = 0,
    rootMargin = '0px'
  } = options
  
  const [isVisible, setIsVisible] = useState(false)
  const [hasTriggered, setHasTriggered] = useState(false)
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && (!triggerOnce || !hasTriggered)) {
          setTimeout(() => {
            setIsVisible(true)
            if (triggerOnce) {
              setHasTriggered(true)
            }
          }, delay)
        } else if (!triggerOnce) {
          setIsVisible(false)
        }
      },
      {
        threshold,
        rootMargin
      }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current)
      }
    }
  }, [threshold, triggerOnce, delay, rootMargin, hasTriggered])

  return { ref, isVisible }
}

// Staggered animations for lists
export function useStaggeredScrollAnimation(itemCount: number, staggerDelay: number = 100) {
  const [visibleItems, setVisibleItems] = useState<boolean[]>(new Array(itemCount).fill(false))
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Trigger items with staggered delay
          for (let i = 0; i < itemCount; i++) {
            setTimeout(() => {
              setVisibleItems(prev => {
                const newArray = [...prev]
                newArray[i] = true
                return newArray
              })
            }, i * staggerDelay)
          }
        }
      },
      { threshold: 0.1 }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current)
      }
    }
  }, [itemCount, staggerDelay])

  return { ref, visibleItems }
}