import { lazy } from "react"

// Shared lazy instance — both DashboardShell and StateMapShell import this.
// A single lazy() object has one internal _status field. After /map resolves it,
// the back-navigation to /state-map finds _status=1 (resolved) and never suspends.
// Two separate lazy(() => import(...)) calls would each start at _status=-1 (pending),
// causing startTransition to keep the old route visible while the Promise resolves.
export const LazyMapEngine = lazy(() => import("#/shared/map"))
