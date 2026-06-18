import { useEffect, useState } from "react"

export function useViewportHeight() {
	const [height, setHeight] = useState<number | string>("100vh")

	useEffect(() => {
		const update = () => setHeight(window.innerHeight)

		update()

		window.addEventListener("resize", update)
		window.addEventListener("orientationchange", update)

		return () => {
			window.removeEventListener("resize", update)
			window.removeEventListener("orientationchange", update)
		}
	}, [])

	return height
}
