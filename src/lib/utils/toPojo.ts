// Mutating function
export function removePrototype<T extends object>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}
