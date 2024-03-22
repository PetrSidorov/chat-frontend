import Split from "react-split";
import { AllConvoContext } from "../../context/AllConvoContext";
import ActiveConvo from "./ActiveConvo";
import MessageManager from "./MessageManager";

import clsx from "clsx";
import { useContext, useRef } from "react";
import { Outlet } from "react-router-dom";
import FullScreenLoading from "../../components/FullScreenLoading";
import { AuthContext } from "../../context/AuthProvider";
import { ResizeContext } from "../../context/ResizeProvider";
import Sidebar from "./sidebar/Sidebar";
import NoActiveConvo from "./NoActiveConvo";

export default function ChatMain() {
  const { user } = useContext(AuthContext);

  const { sizes, handleDrag, mobileView } = useContext(ResizeContext);

  const [activeConvoId] = useContext(AllConvoContext).activeConvoId;

  return (
    <>
      {!user ? (
        <FullScreenLoading />
      ) : (
        <div>
          <Split
            onDrag={handleDrag}
            className="h-screen flex"
            gutterSize={5}
            minSize={[200, 350]}
            sizes={sizes}
          >
            <div
              className={clsx("flex flex-col bg-white text-black p-4", {
                hidden: mobileView && activeConvoId,
                "w-1/3": !mobileView && activeConvoId,
                "w-full": mobileView && !activeConvoId,
              })}
            >
              <Sidebar>
                <Outlet />
              </Sidebar>
            </div>
            <div
              className={clsx("flex flex-col", {
                "w-full": mobileView && activeConvoId,
                hidden: mobileView && !activeConvoId,
              })}
            >
              {activeConvoId ? (
                <>
                  <ActiveConvo />
                  <MessageManager />
                </>
              ) : (
                <NoActiveConvo />
              )}
            </div>
          </Split>
        </div>
      )}
    </>
  );
}
