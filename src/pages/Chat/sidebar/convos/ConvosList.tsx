import { useContext, useEffect, useState } from "react";

import useRoomUsersStatus from "@/hooks/useRoomUsersStatus";
import axios from "axios";
import { AllConvoContext } from "../../../../context/AllConvoProvider";
import { AuthContext } from "../../../../context/DeprecatedAuthProvider";
import ConvoPreview from "./ConvoPreview";
import { socket } from "@/utils/socket";
import FullScreenLoading from "@/components/FullScreenLoading";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import getConvos from "@/utils/getConvos";
import getMessages from "@/hooks/react-query/getMessages";
import {
  generateInfiniteMessagesConfig,
  infiniteConvosConfig,
} from "@/hooks/react-query/config";
import { TConvo } from "@/types";
import useActiveConvoIdStore from "@/store";

export default function ConvosList() {
  // TODO: convos shouldn't be mounted here,
  // because it's a sidebar component which isn't mounted in all cases
  const queryClient = useQueryClient();
  // const { convos, initConvo, setAnimationType, onlineStatuses } =
  //   useContext(AllConvoContext)?.convoContext;
  // const [, setActiveConvoId] = useContext(AllConvoContext).activeConvoId;
  const setActiveConvoId = useActiveConvoIdStore(
    (state) => state.updateActiveConvoId
  );

  // const { user } = useContext(AuthContext);
  // const onlineStatuses = useRoomUsersStatus();
  // const [loaded, setLoaded] = useState(false);
  // const [prefetchedConvosMap, setPrefetchedConvosMap] = useState(null);
  // --------
  const {
    data,
    isFetching,
    isLoading,
    isError,
    hasNextPage,
    isFetchingNextPage,
    status,
    fetchNextPage,
  } = useInfiniteQuery(infiniteConvosConfig);

  const convos = data?.pages[0].convos;

  // }

  // useEffect(() => {
  //   const getConvos = async () => {
  //     if (!user) return;
  //     // if (!socket.connected) {
  //     //   socket.connect();
  //     // }
  //     // await new Promise((resolve, reject) => {
  //     //   socket.on("connect", () => resolve(null));
  //     //   socket.on("connect_error", reject);
  //     // });

  //     const response = await axios.get(
  //       // TODO: add sockets for handling more then 10 convos
  //       "http://localhost:3007/api/convo/last-ten-convos-with-ten-messages",
  //       {
  //         withCredentials: true,
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //       }
  //     );

  //     // TODO:TYPESCRIPT implement casting with 'as' in fetches like in the example below
  //     // const data = fetch("bla").then((res) => {
  //     //   return res.json;
  //     // });

  //     // return data as Something

  //     console.log("response.data ", response.data);
  //     initConvo(response.data);
  //     setLoaded(true);
  //   };
  //   getConvos();
  // }, [user]);

  // const listOfConvoPreviews =
  //   convos &&
  //   Object.entries(convos)?.map((convo: any) => {
  //     const [id, data] = convo;
  //     // TODO: check this thing below and
  //     // make it more declarative and make it work, lol
  //     const participantOnlineStatus = onlineStatuses[id]?.includes(
  //       data.participants[0].id
  //     );

  //     return (
  //       <div
  //         className="h-auto max-h-[132px] overflow-hidden w-full "
  //         key={id}
  //         onClick={() => {
  //           setActiveConvoId(id);
  //           setAnimationType("");
  //         }}
  //       >
  //         <ConvoPreview
  //           participants={data.participants}
  //           messages={data.messages}
  //           online={participantOnlineStatus}
  //           id={id}
  //         />
  //       </div>
  //     );
  //   });

  // if (!loaded) return <FullScreenLoading />;

  // TODO: different states should be managed better that this
  if (isLoading) {
    return <FullScreenLoading />;
  }

  if (isError) {
    return <div>Error fetching data 😔</div>;
  }

  if (isFetching) {
    return <div>Fetching data in progress 😔</div>;
  }

  // TODO: typescript fix

  return (
    <>
      {convos ? (
        <ul className="font-semibold">
          {convos.map((convo: TConvo) => {
            return (
              <div
                className="h-auto max-h-[132px] overflow-hidden w-full "
                key={convo.id}
                onClick={() => {
                  setActiveConvoId(convo.id);
                  // setAnimationType("");
                }}
              >
                <ConvoPreview
                  participants={convo.participants}
                  message={convo.messages[0]}
                  id={convo.id}
                  onMouseEnter={() => {
                    const data = queryClient.getQueryData([
                      "messages",
                      { id: convo.id },
                    ]);
                    if (data) return;
                    queryClient.prefetchInfiniteQuery({
                      queryKey: ["messages", { convoId: convo.id }],
                      queryFn: () => getMessages(1, convo.id),
                      initialPageParam: 1,
                    });
                  }}
                  // online={participantOnlineStatus}
                  // key={convo.id}
                />
              </div>
            );
          })}
        </ul>
      ) : (
        <div className="text-center">
          <h3 className="mt-2 text-2xl font-semibold text-white-900">
            You have no messages yet
          </h3>
        </div>
      )}
    </>
  );
}

// return (
//   <>
//     {listOfConvoPreviews && listOfConvoPreviews.length > 0 ? (
//       <>
//         <ul className="font-semibold">{listOfConvoPreviews}</ul>
//       </>
//     ) : (
//       <div className="text-center">
//         <h3 className="mt-2 text-2xl font-semibold text-white-900">
//           You have no messages yet
//         </h3>
//       </div>
//     )}
//   </>
// );
