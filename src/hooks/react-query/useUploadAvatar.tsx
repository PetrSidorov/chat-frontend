import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const uploadAvatar = async (croppedImageBlob: Blob) => {
  const formData = new FormData();
  formData.append("avatar", croppedImageBlob, `${crypto.randomUUID()}.jpg`);
  const response = await axios.post(
    "http://localhost:3007/api/user-avatar/",
    formData,
    {
      withCredentials: true,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};

const useUploadAvatar = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (croppedImageBlob: Blob) => uploadAvatar(croppedImageBlob),
    onMutate: async () => {
      await queryClient.cancelQueries({
        queryKey: ["user"],
      });

      const snapshot = queryClient.getQueryData(["user"]);

      // queryClient.setQueryData(["user"], (oldData: TUser) => {
      //   const newData = oldData
      //     ? { ...oldData }
      //     : { pages: [{ messages: [] }] };
      //   newData.pages[0].messages = newData.pages[0].messages.filter(
      //     (msg) => msg.uuid !== uuid
      //   );
      //   return newData;
      // });

      return () => {
        queryClient.setQueryData(["user"], snapshot);
      };
    },
    onError: (error, _, rollback) => {
      console.log("error", error);
      rollback?.();
    },
    onSettled: () => {
      return queryClient.invalidateQueries({
        queryKey: ["user"],
      });
    },
  });
};

export default useUploadAvatar;
