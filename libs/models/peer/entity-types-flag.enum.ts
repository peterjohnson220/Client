/* tslint:disable:no-bitwise */
// This enum/flag uses bitwise operators.
// This flag is used to help easily determine what Entity Types
// are applicable to a tag category using a singular integer (0-7).
// Ex. 1 = Company, 2 = Job, 6 = Job & Employee, 7 = Company & Job & Employee, 12 = Subsidiary & Employee, 15 = all
// For more info, check out this link:
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Bitwise_Operators#Flags_and_bitmasks

export enum EntityTypesFlag {
  None = 0,  // 0, 0000
  Company = 1 << 0,  // 1, 0001
  Job = 1 << 1,  // 2, 0010
  Employee = 1 << 2,  // 4, 0100
  Subsidiary= 1 << 3 // 8, 1000
}

