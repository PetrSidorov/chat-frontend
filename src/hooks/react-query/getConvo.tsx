import axios from "axios";

export default async (pageParam: number) => {
  return await axios.get(
    // TODO: add sockets for handling more then 10 messages
    `http://localhost:3007/api/messages/${pageParam}`,
    {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
};
