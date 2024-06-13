export function flattenMessages(pages) {
  console.log(pages);
  return pages.flatMap((page) => page.messages);
}
