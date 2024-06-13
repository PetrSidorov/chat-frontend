export function flattenMessages(pages) {
  if (!pages) return;
  //   console.log(pages);
  console.log(
    "pages.flatMap((page) => page.messages) ",
    pages.flatMap((page) => page.messages)
  );
  return pages.flatMap((page) => page.messages).reverse();
}
