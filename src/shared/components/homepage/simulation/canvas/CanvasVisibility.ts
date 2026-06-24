import { type RefObject, useEffect, useRef } from "react"

export function useCanvasVisibility(
	containerRef: RefObject<HTMLDivElement | null>,
) {
	const isVisibleRef = useRef(true)

	useEffect(() => {
		const container = containerRef.current
		if (!container) return

		const observer = new IntersectionObserver(
			([entry]) => {
				isVisibleRef.current = entry.isIntersecting
			},
			{ threshold: 0 },
		)
		observer.observe(container)

		return () => {
			observer.disconnect()
		}
	}, [containerRef])

	return isVisibleRef
}
