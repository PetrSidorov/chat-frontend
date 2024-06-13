// import axios from "axios";

// export default async (pageParam: number) => {
//   return await axios.get(
//     // TODO: add sockets for handling more then 10 convos
//     `http://localhost:3007/api/convo/${pageParam}`,
//     {
//       withCredentials: true,
//       headers: {
//         "Content-Type": "application/json",
//       },
//     }
//   );
// };

import { GetConvosResponse } from "@/types";
import axios from "axios";

export default async (pageParam: number): Promise<GetConvosResponse> => {
  try {
    const response = await axios.get<GetConvosResponse>(
      `http://localhost:3007/api/convo/${pageParam}`,
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching messages:", error);
    throw error;
  }
};
