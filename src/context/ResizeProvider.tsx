import {
  Dispatch,
  ReactNode,
  SetStateAction,
  useState,
  createContext,
  useEffect,
  useContext,
  useRef,
} from "react";
import { AllConvoContext } from "./AllConvoContext";

type TinitialContext = {
  showOnlyAvatars: boolean;
  setShowOnlyAvatars: Dispatch<SetStateAction<boolean>>;
  fullWidthMessagesInActiveConvo: boolean;
  setFullWidthMessagesInActiveConvo: Dispatch<SetStateAction<boolean>>;
  mobileView: boolean;
  setMobileView: Dispatch<SetStateAction<boolean>>;
};

const initialContext = {
  showOnlyAvatars: false,
  setShowOnlyAvatars: (() => {}) as Dispatch<SetStateAction<boolean>>,
  fullWidthMessagesInActiveConvo: false,
  setFullWidthMessagesInActiveConvo: (() => {}) as Dispatch<
    SetStateAction<boolean>
  >,
  mobileView: false,
  setMobileView: (() => {}) as Dispatch<SetStateAction<boolean>>,
};

export const ResizeContext = createContext<TinitialContext>(initialContext);

export default function ResizeProvider({ children }: { children: ReactNode }) {
  const [showOnlyAvatars, setShowOnlyAvatars] = useState(false);
  const [fullWidthMessagesInActiveConvo, setFullWidthMessagesInActiveConvo] =
    useState(false);
  const [mobileView, setMobileView] = useState(false);
  const [activeConvoId, handleActiveConvoId] =
    useContext(AllConvoContext).activeConvoId;
  const [sizes, setSizes] = useState<[number, number]>([35, 65]);
  // const leftPanelRef = useRef(null);
  // const rightPanelRef = useRef(null);

  // useEffect(() => {
  //   console.log("setShowOnlyAvatars ", showOnlyAvatars);
  // }, [showOnlyAvatars]);
  useEffect(() => {
    console.log("hi?");
    console.log(sizes);
  }, [sizes]);

  useEffect(() => {
    const [leftPanelWidth, rightPanelWidth] = sizes;
    const leftNarrow = leftPanelWidth < 17;
    const rightNarrow = rightPanelWidth < 35;
    // console.log("sizes ", sizes);
    setFullWidthMessagesInActiveConvo((currentValue) => {
      if (rightNarrow && !currentValue) {
        return true;
      } else if (!rightNarrow && currentValue && !mobileView) {
        return false;
      }
      return currentValue;
    });

    setShowOnlyAvatars((currentValue) => {
      if (leftNarrow && !currentValue) {
        return true;
      } else if (!leftNarrow && currentValue) {
        return false;
      }
      return currentValue;
    });
  }, [sizes]);

  function handleDrag(newSizes: [number, number]) {
    setSizes(newSizes);
  }

  function switchToMobile(setter: boolean) {
    console.log("setter ", setter, activeConvoId);
    setMobileView(setter);
    if (activeConvoId && setter) {
      // hideleftpanel
      setSizes([0, 100]);
      setFullWidthMessagesInActiveConvo(true);
    }

    if (!setter) {
      setSizes([35, 65]);
    }
  }

  useEffect(() => {
    function handleResize() {
      if (window.innerWidth < 700 && window.innerWidth > 500) {
        setShowOnlyAvatars(true);
        setFullWidthMessagesInActiveConvo(true);
        switchToMobile(false);
      } else if (window.innerWidth > 701) {
        setShowOnlyAvatars(false);
        // setFullWidthMessagesInActiveConvo(false);
        switchToMobile(false);
      } else if (window.innerWidth < 500) {
        switchToMobile(true);
      }
    }
    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // useEffect(() => {
  //   console.log(windowWidth);
  // }, [windowWidth]);

  return (
    <ResizeContext.Provider
      value={{
        showOnlyAvatars,
        setShowOnlyAvatars,
        fullWidthMessagesInActiveConvo,
        setFullWidthMessagesInActiveConvo,
        mobileView,
        setMobileView,
        // leftPanelRef,
        // rightPanelRef,
        handleDrag,
        sizes,
      }}
    >
      {children}
    </ResizeContext.Provider>
  );
}
