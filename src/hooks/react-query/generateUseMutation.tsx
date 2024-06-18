import {
  InfiniteData,
  MutationFunction,
  QueryKey,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import useGetUser from "./useGetUser";

// #ask-artem what's up with Args type below
//  and by what rules we need to separate it in generic
const generateUseMutation = <T, Args = string | void>(
  // TODO #ask-artem all check somehow in total typescript
  // are types in this function are ok ?

  mutationFn: MutationFunction<unknown, Args>,
  queryKey: QueryKey,
  setQueryDataFn: (args: InfiniteData<T>, options?: string) => {}
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn,
    // #ask-artem why typescript in the line below
    // doesn't let me to do anything aside from any
    onMutate: async (options?: any) => {
      await queryClient.cancelQueries({
        queryKey,
      });

      const snapshot = queryClient.getQueryData(queryKey);

      queryClient.setQueryData(queryKey, (args: InfiniteData<T>) =>
        setQueryDataFn(args, options)
      );

      return () => {
        queryClient.setQueryData(queryKey, snapshot);
      };
    },
    onError: (error, _, rollback) => {
      console.log("error", error);
      rollback?.();
    },
    onSettled: () => {
      return queryClient.invalidateQueries({
        queryKey,
      });
    },
  });
};

export { generateUseMutation };
