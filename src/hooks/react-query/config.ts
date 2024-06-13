const activityQueryConfig = {
  queryKey: ["convo"],
  queryFn: ({ pageParam = 1 }) => getConvo(pageParam),
  getNextPageParam: (lastPage) => {
    const nextPage = lastPage.currentPage + 1;
    return nextPage <= lastPage.totalPages ? nextPage : undefined;
  },
};
