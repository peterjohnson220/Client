export function convertToFaIconFormat(faClassName: string): string[] {
  const splits = faClassName.split(' ');
  const result = [splits[0], splits[1].replace('fa-', '')];
  return result;
}
