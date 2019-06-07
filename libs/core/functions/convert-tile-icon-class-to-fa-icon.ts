export function convertToFaIconFormat(faClassName: string): string[] {
  let result = null;
  if (!!faClassName) {
    const splits = faClassName.split(' ');
    result = [splits[0], splits[1].replace('fa-', '')];
  }
  return result;
}
