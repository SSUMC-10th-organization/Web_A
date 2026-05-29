export default function useLocalStorage(key: string) {
  const setItem = (value: unknown) => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(error);
    }
  };

  const getItem = <T,>() => {
    try {
      const item = window.localStorage.getItem(key);

      if (!item) return null;

      return JSON.parse(item) as T;
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  const removeItem = () => {
    try {
      window.localStorage.removeItem(key);
    } catch (error) {
      console.error(error);
    }
  };

  return {
    setItem,
    getItem,
    removeItem,
  };
}