import { TPage } from "@/types";

export function flattenInfiniteData<TData>(
  key: string,
  pages: Array<TPage<TData>> | undefined
) {
  if (!pages) return;

  return pages
    .flatMap((page: Record<string, any>) => page[key])
    .reverse() as TData[];
}
