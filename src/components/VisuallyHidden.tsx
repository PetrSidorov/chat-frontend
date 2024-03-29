import { ReactElement, useEffect, useState } from "react";

// import React from "react";
const hiddenStyles = {
  display: "inline-block",
  position: "absolute",
  overflow: "hidden",
  clip: "rect(0 0 0 0)",
  height: 1,
  width: 1,
  margin: -1,
  padding: 0,
  border: 0,
};
const VisuallyHidden = ({
  children,
  ...delegated
}: {
  children: ReactElement;
}) => {
  const [forceShow, setForceShow] = useState(false);
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") {
      const handleKeyDown = (ev: KeyboardEvent) => {
        if (ev.key === "?") {
          setForceShow(true);
        }
      };
      const handleKeyUp = (ev: KeyboardEvent) => {
        if (ev.key === "?") {
          setForceShow(false);
        }
      };
      window.addEventListener("keydown", handleKeyDown);
      window.addEventListener("keyup", handleKeyUp);
      return () => {
        window.removeEventListener("keydown", handleKeyDown);
        window.removeEventListener("keyup", handleKeyUp);
      };
    }
  }, []);
  if (forceShow) {
    return children;
  }
  return (
    <span style={hiddenStyles} {...delegated}>
      {children}
    </span>
  );
};
export default VisuallyHidden;
