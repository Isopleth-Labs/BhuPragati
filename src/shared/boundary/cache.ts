// Generic, provider-agnostic in-memory cache for boundary lookups.
// Holds promises (not resolved values) so concurrent callers share one
// in-flight fetch instead of triggering duplicate loads.
export class BoundaryCache<T> {
	private readonly store = new Map<string, Promise<T>>();

	getOrLoad(key: string, loader: () => Promise<T>): Promise<T> {
		const cached = this.store.get(key);
		if (cached) return cached;

		const promise = loader();
		this.store.set(key, promise);
		return promise;
	}

	clear(key?: string): void {
		if (key) {
			this.store.delete(key);
		} else {
			this.store.clear();
		}
	}
}
