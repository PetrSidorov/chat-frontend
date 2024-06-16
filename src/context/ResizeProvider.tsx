import { debounce } from "lodash";
import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import { AllConvoContext } from "./AllConvoProvider";
import useActiveConvoIdStore from "@/store";

type TinitialContext = {
  showOnlyAvatars: boolean;
  setShowOnlyAvatars: Dispatch<SetStateAction<boolean>>;
  fullWidthMessagesInActiveConvo: boolean;
  setFullWidthMessagesInActiveConvo: Dispatch<SetStateAction<boolean>>;
  mobileView: boolean;
  setMobileView: Dispatch<SetStateAction<boolean>>;
  handleDrag: () => void;
  sizes: [];
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
  handleDrag: () => {},
  sizes: [],
};

export const ResizeContext = createContext<TinitialContext>(initialContext);

export default function ResizeProvider({ children }: { children: ReactNode }) {
  const [showOnlyAvatars, setShowOnlyAvatars] = useState(false);
  const [fullWidthMessagesInActiveConvo, setFullWidthMessagesInActiveConvo] =
    useState(false);
  const [mobileView, setMobileView] = useState(false);
  // const [activeConvoId, handleActiveConvoId] =
  //   useContext(AllConvoContext).activeConvoId;
  const activeConvoId = useActiveConvoIdStore((state) => state.activeConvoId);
  const [sizes, setSizes] = useState<[number, number]>([35, 65]);

  useEffect(() => {
    const [leftPanelWidth, rightPanelWidth] = sizes;
    const leftNarrow = leftPanelWidth < 25;
    const rightNarrow = rightPanelWidth < 35;
    setFullWidthMessagesInActiveConvo(rightNarrow || window.innerWidth < 800);
    setShowOnlyAvatars(leftNarrow || (window.innerWidth < 800 && !mobileView));
  }, [sizes]);

  function handleDrag(newSizes: [number, number]) {
    setSizes(newSizes);
  }

  function switchToMobile(setter: boolean) {
    setMobileView(setter);

    if (!setter) {
      setSizes([35, 65]);
    }
  }

  useEffect(() => {
    const handleResize = debounce(() => {
      if (window.innerWidth < 700 && window.innerWidth > 500) {
        setShowOnlyAvatars(true);
        setFullWidthMessagesInActiveConvo(true);
        switchToMobile(false);
      } else if (window.innerWidth > 701) {
        setShowOnlyAvatars(false);
        setFullWidthMessagesInActiveConvo(false);
        switchToMobile(false);
      } else if (window.innerWidth < 500) {
        switchToMobile(true);
        setSizes(activeConvoId ? [0, 100] : [100, 0]);
      }
    }, 200);
    window.addEventListener("resize", handleResize);
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
      handleResize.cancel();
    };
  }, [activeConvoId]);

  return (
    <ResizeContext.Provider
      value={{
        showOnlyAvatars,
        setShowOnlyAvatars,
        fullWidthMessagesInActiveConvo,
        setFullWidthMessagesInActiveConvo,
        mobileView,
        setMobileView,
        handleDrag,
        sizes,
      }}
    >
      {children}
    </ResizeContext.Provider>
  );
}
