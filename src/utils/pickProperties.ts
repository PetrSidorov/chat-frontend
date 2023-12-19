export default function pickProperties<T extends object>(
  sourceObject: T,
  ...selectedFields: Array<keyof T>
): Partial<T> {
  return selectedFields.reduce<Partial<T>>((filteredObject, currentField) => {
    if (currentField in sourceObject) {
      filteredObject[currentField] = sourceObject[currentField];
    }
    return filteredObject;
  }, {});
}
