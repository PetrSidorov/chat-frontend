import { useRef, useEffect, ReactElement } from "react";

export default function HandleClickOutside({
  children,
  callback,
}: {
  children: ReactElement;
  callback: Function;
}) {
  const myDivRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        myDivRef.current &&
        !myDivRef.current.contains(event.target as Node)
      ) {
        callback();
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return <div ref={myDivRef}>{children}</div>;
}
