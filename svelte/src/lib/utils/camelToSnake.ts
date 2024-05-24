function camelToSnake(key: string) {
  return key.replace(/([A-Z])/g, '_$1').toLowerCase();
}

export function convertCamelToSnakeKeys(object: Record<string, unknown>) {
  const newObject: Record<string, unknown> = {};
  for (const camelKey in object) {
    newObject[camelToSnake(camelKey)] = object[camelKey];
  }

  return newObject;
}
