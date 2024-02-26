import { useRef, useEffect, ReactElement } from "react";

export default function ClickOutsideHandler({
  children,
  callback,
  popupState,
}: {
  children: ReactElement;
  callback: Function;
  popupState: {
    show: boolean;
    top: number;
    left: number;
    id: string;
    yours: boolean;
  };
}) {
  const myDivRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        myDivRef.current &&
        !myDivRef.current.contains(event.target as Node) &&
        popupState.show
      ) {
        callback();
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [popupState]);

  return (
    <div id="myDivRef" ref={myDivRef}>
      {children}
    </div>
  );
}
