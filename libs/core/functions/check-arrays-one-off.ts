export function checkArraysOneOff<TPrimitiveArrayType extends number|string>(
  arrayOne: TPrimitiveArrayType[],
  arrayTwo: TPrimitiveArrayType[]
): boolean {
  const arrayOneHasOneMore = arrayOne.length === arrayTwo.length + 1;
  // If the counts are not off by one (in either direction) then we do not need to check the contents of the lists.
  if (!arrayOneHasOneMore && !(arrayOne.length === arrayTwo.length - 1)) {
    return false;
  }
  // If the first array is larger we then want to check and
  // see if every item in the second array is in the first array.
  // If so, then return true because we know that the first array is only one larger than the second array.
  if (arrayOneHasOneMore) {
    return (arrayTwo.every(val => arrayOne.indexOf(val) > -1));
    // If the second array is larger we then want to check and see if every item in the first array is in the second array.
    // If so, then return true because we know that the second array is only one larger than the first array.
  } else {
    return (arrayOne.every(val => arrayTwo.indexOf(val) > -1));
  }
}
