import { TPage } from "@/types";

export function flattenInfiniteData<TData>(
  pages: Array<TPage<TData>> | undefined
) {
  if (!pages) return;

  return pages.flatMap((page) => page.messages).reverse() as TData[];
}
