export function getProperty(entry: any, property: string | undefined): any {
  if (entry && property && entry.hasOwnProperty(property)) {
    return entry[property];
  }
  return entry;
}
