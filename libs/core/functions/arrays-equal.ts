export function arraysEqual<TPrimitiveType extends number|string>(arr1: TPrimitiveType[], arr2: TPrimitiveType[]): boolean {
  return (JSON.stringify(arr1) === JSON.stringify(arr2));
}
