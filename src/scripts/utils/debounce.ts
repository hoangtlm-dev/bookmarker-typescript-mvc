export const debounce = <T extends (...args: Parameters<T>) => ReturnType<T>>(callback: T, delayTime: number) => {
  let timeout: ReturnType<typeof setTimeout>;

  return (...args: Parameters<T>) => {
    clearTimeout(timeout);

    timeout = setTimeout(() => {
      callback(...args);
    }, delayTime);
  };
};
