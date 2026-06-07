export function makeLogger(ns: string) {
  const enabled = import.meta.env.VITE_DEBUG === 'true' || import.meta.env.MODE !== 'production';
  return (...args: any[]) => {
    if (enabled) {
      // eslint-disable-next-line no-console
      console.log(`[${ns}]`, ...args);
    }
  };
}

export default makeLogger;
