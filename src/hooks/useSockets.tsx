import { useCallback, useEffect, useState } from "react";
import { socket } from "../utils/socket";
import { debounce } from "lodash";

export default function useSockets<T, I>({
  emitFlag,
  onFlag,
  initialState,
  debounceFlag = false,
  dependencies = [],
  debounceTime = 500,
}: {
  emitFlag: string;
  onFlag: string;
  initialState: I;
  debounceFlag?: boolean;
  dependencies?: any[];
  debounceTime?: number;
}) {
  const [data, setData] = useState<I | T>(initialState);
  const [socketLoading, setSocketLoading] = useState(false);

  function basicEmit(dataToEmit: T) {
    setSocketLoading(true);
    socket.emit(emitFlag, dataToEmit);
  }

  const debounceEmit = useCallback(debounce(basicEmit, debounceTime), [
    ...dependencies,
  ]);

  const emit = debounceFlag ? debounceEmit : basicEmit;

  useEffect(() => {
    socket.on(onFlag, (data: T) => {
      setData(data);
      setSocketLoading(false);
    });

    return () => {
      socket.off(onFlag);
      debounceFlag ? debounceEmit.cancel() : null;
    };
  }, []);

  return { socketLoading, data, emit };
}
