import { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import ConvosList from "./ConvosList";
import ActiveConvo from "./ActiveConvo";
import ActiveConvoProvider from "../../context/ActiveConvoContext";
import MessageManager from "./MessageManager";
import fetchDB from "../../utils/fetchDB";

export default function Chat() {
  const [user, setUser] = useContext(AuthContext);
  const scrollContainerRef = useRef(null); // Ref for the scrollable container

  useEffect(() => {
    // Function to call when scroll event occurs
    const handleScroll = () => {
      console.log("Scroll event detected!");
      // Log the current scroll position
      console.log(scrollContainerRef.current.scrollTop);
    };

    // Add scroll event listener to the scrollable container
    if (scrollContainerRef.current) {
      scrollContainerRef.current.addEventListener("scroll", handleScroll);
    }

    // Clean up: remove the event listener
    return () => {
      if (scrollContainerRef.current) {
        scrollContainerRef.current.removeEventListener("scroll", handleScroll);
      }
    };
  }, []); // Empty dependency array means this runs on mount and unmount only

  useEffect(() => {
    if (!user) {
      fetchDB({
        url: "http://localhost:3007/api/user-data",
        method: "GET",
      })
        .then((data) => {
          // console.log("data user", data);
          // if (data.token) {
          setUser(data.user);
          // }
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }
  }, [user]);

  return (
    <ActiveConvoProvider>
      <div className="h-screen flex">
        {/* User List Column */}
        <div className="flex flex-col w-1/3 bg-gray-800 text-white p-4">
          <h1 className="text-lg font-bold mb-3">Hi, {user?.username}</h1>
          <ConvosList />
        </div>
        {/* Chat Column */}
        <div className="flex flex-col w-2/3">
          {/* Messages Area */}
          {/* <div className="flex-grow p-4 overflow-y-auto"> */}
          <ActiveConvo />
          {/* </div> */}

          {/* Message Input Area */}
          <MessageManager />
        </div>
      </div>
    </ActiveConvoProvider>
  );
}
