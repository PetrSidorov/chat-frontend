import { GetMessagesResponse } from "@/types";
import axios from "axios";

export default async (
  pageParam: number,
  convoId: string
): Promise<GetMessagesResponse> => {
  try {
    const response = await axios.get<GetMessagesResponse>(
      `http://localhost:3007/api/messages/${convoId}/${pageParam}`,
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
