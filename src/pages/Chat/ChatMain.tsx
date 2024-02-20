import Split from "react-split";
import ActiveConvoProvider, {
  AllConvoContext,
} from "../../context/AllConvoContext";
import ActiveConvo from "./ActiveConvo";
import MessageManager from "./MessageManager";

import Sidebar from "./sidebar/Sidebar";
import { useEffect, useRef, useState } from "react";
import ResizeProvider, { ResizeContext } from "../../context/ResizeProvider";
import { useContext } from "react";
import clsx from "clsx";

export default function ChatMain() {
  const leftPanelRef = useRef(null);
  const rightPanelRef = useRef(null);
  const {
    // showOnlyAvatars,
    // setShowOnlyAvatars,
    // setFullWidthMessagesInActiveConvo,
    sizes,
    handleDrag,
    mobileView,
  } = useContext(ResizeContext);
  const [activeConvoId, handleActiveConvoId] =
    useContext(AllConvoContext).activeConvoId;
  // const [sizes, setSizes] = useState<[number, number]>([35, 65]);

  // useEffect(() => {
  //   const [leftPanelWidth, rightPanelWidth] = sizes;
  //   const leftNarrow = leftPanelWidth < 17;
  //   const rightNarrow = rightPanelWidth < 35;

  //   setFullWidthMessagesInActiveConvo((currentValue) => {
  //     if (rightNarrow && !currentValue) {
  //       return true;
  //     } else if (!rightNarrow && currentValue) {
  //       return false;
  //     }
  //     return currentValue;
  //   });

  //   setShowOnlyAvatars((currentValue) => {
  //     if (leftNarrow && !currentValue) {
  //       return true;
  //     } else if (!leftNarrow && currentValue) {
  //       return false;
  //     }
  //     return currentValue;
  //   });
  // }, [sizes]);

  // function handleDrag(newSizes: [number, number]) {
  //   setSizes(newSizes);
  // }

  return (
    <div>
      {/* <ResizeProvider> */}
      <Split
        onDrag={handleDrag}
        className="h-screen flex"
        gutterSize={5}
        minSize={[200, 350]}
        sizes={sizes}
      >
        {/* User List Column */}

        {/* {(!mobileView || (mobileView && !activeConvoId)) && ( */}
        {/* <div
          className={`flex flex-col w-1/3 bg-gray-800 text-white p-4 ${
            mobileView && activeConvoId ? " hidden" : ""
          }`}
        >*/}
        <div
          className={clsx("flex flex-col bg-gray-800 text-white p-4", {
            hidden: mobileView && activeConvoId,
            "w-1/3": !mobileView && activeConvoId,
            "w-full": mobileView && !activeConvoId,
          })}
        >
          <Sidebar />
        </div>
        {/* )} */}

        {/* Chat Column */}
        {/* <div
          className={`flex flex-col ${
            mobileView && activeConvoId ? " w-full" : " w-2/3"
          }`}
        > */}
        <div
          className={clsx("flex flex-col", {
            "w-full": mobileView && activeConvoId,
            hidden: mobileView && !activeConvoId,
          })}
        >
          {/* <div className="flex flex-col w-2/3"> */}
          <ActiveConvo />

          {/* Message Input Area */}
          <MessageManager />
        </div>
        {/* )} */}
      </Split>
      {/* </ResizeProvider> */}
    </div>
  );
}
