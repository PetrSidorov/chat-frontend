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
import { AuthContext } from "../../context/AuthProvider";
import { Outlet, useNavigate } from "react-router-dom";
import FullScreenLoading from "../../components/FullScreenLoading";

export default function ChatMain() {
  const leftPanelRef = useRef(null);
  const rightPanelRef = useRef(null);
  const { user } = useContext(AuthContext);

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

  return (
    <>
      {!user ? (
        <FullScreenLoading />
      ) : (
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
              <Sidebar>
                <Outlet />
              </Sidebar>
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
      )}
    </>
  );
}