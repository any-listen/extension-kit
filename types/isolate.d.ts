declare global {
  var setTimeout: (callback: () => void, ms?: number) => number
  var clearTimeout: (timeoutId: number) => void
  var setInterval: (callback: () => void, ms?: number) => number
  var clearInterval: (intervalId: number) => void

  var onmessage: ((listen: (message: unknown) => void) => void) | undefined
  var postMessage: ((message: unknown) => void) | undefined
}

export {}
