import type { CamelCasedProperties } from 'type-fest';

function camelToSnake(key: string) {
  return key.replace(/([A-Z])/g, '_$1').toLowerCase();
}

export function convertCamelToSnakeKeys<T>(object: T): CamelCasedProperties<T> {
  const newObject: Record<string, unknown> = {};
  for (const camelKey in object) {
    newObject[camelToSnake(camelKey)] = object[camelKey];
  }

  return newObject as CamelCasedProperties<T>;
}
export const camelToSnakeCase = (str: string): string =>
  str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
