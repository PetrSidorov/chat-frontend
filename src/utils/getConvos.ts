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
