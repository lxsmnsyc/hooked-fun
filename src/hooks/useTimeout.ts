
import useSyncEffect from './useSyncEffect';

export type TimeoutCallback<T extends any[]> = (...args: T) => void;

export default function useTimeout<T extends any[]>(callback: TimeoutCallback<T>, timeout: number, dependencies: T) {
  useSyncEffect(() => {
    const timeID = setTimeout(callback, timeout, ...dependencies);

    return () => {
      clearTimeout(timeID);
    }
  }, [timeout, ...dependencies]);
}