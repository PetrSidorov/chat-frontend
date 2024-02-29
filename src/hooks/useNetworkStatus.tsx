import { useSyncExternalStore } from "react";

const getSnapshot = () => {
  return navigator.onLine ? true : false;
};

const subscribe = (callback: () => void) => {
  window.addEventListener("online", callback);
  window.addEventListener("offline", callback);

  return () => {
    window.removeEventListener("online", callback);
    window.removeEventListener("offline", callback);
  };
};

export default function useOnlineStatus() {
  const networkStatus = useSyncExternalStore(subscribe, getSnapshot);

  return networkStatus;
}
