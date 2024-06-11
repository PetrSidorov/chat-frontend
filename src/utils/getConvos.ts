import axios from "axios";

export default async (pageParam: number) => {
  console.log(pageParam);
  return await axios.get(
    // TODO: add sockets for handling more then 10 convos
    `http://localhost:3007/api/convo/${pageParam}`,
    {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
};
