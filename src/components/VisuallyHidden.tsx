import { ReactNode, useEffect, useState } from "react";

// #ask-artem or figure out react css properties interface
const hiddenStyles: React.CSSProperties = {
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
  children: ReactNode;
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
