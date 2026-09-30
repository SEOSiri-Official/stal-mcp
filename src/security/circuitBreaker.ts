export class CircuitBreaker {
  private failures = 0;
  private lastFailureTime = 0;
  private state: 'CLOSED' | 'OPEN' | 'HALF_OPEN' = 'CLOSED';
  constructor(private threshold = 3, private resetTimeoutMs = 10000) {}
  async execute<T>(fn: () => Promise<T>, fallbackFn: () => Promise<T>): Promise<T> {
    if (this.state === 'OPEN') {
      if (Date.now() - this.lastFailureTime > this.resetTimeoutMs) this.state = 'HALF_OPEN';
      else return fallbackFn();
    }
    try {
      const res = await fn();
      this.reset();
      return res;
    } catch {
      this.failures++;
      this.lastFailureTime = Date.now();
      if (this.failures >= this.threshold) this.state = 'OPEN';
      return fallbackFn();
    }
  }
  private reset() { this.failures = 0; this.state = 'CLOSED'; }
}
