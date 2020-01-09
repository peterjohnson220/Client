export enum FunctionName {
  IF = 'IF',
  AND = 'AND',
  NOT = 'NOT',
  OR = 'OR',
  SWITCH = 'SWITCH',
  ABS = 'ABS',
  CEILING = 'CEILING',
  FLOOR = 'FLOOR',
  ROUND = 'ROUND',
  SUM = 'SUM'
}

export enum Function {
  IF = 'IF(logical_test, value_if_true, value_if_false)',
  AND = 'AND(condition1, condition2)',
  NOT = 'NOT(condition)',
  OR = 'OR(condition1, condition2)',
  SWITCH = 'SWITCH(value_to_switch, value_to_match1, value_to_return_if_match1, value_to_return_if_no_match)',
  ABS = 'ABS(number)',
  CEILING = 'CEILING(number, significance)',
  FLOOR = 'FLOOR(number, significance)',
  ROUND = 'ROUND(number, num_digits)',
  SUM = 'SUM(value1, value2, value3...)'
}

export const functionDictionary = {
  [FunctionName.IF]: [Function.IF],
  [FunctionName.AND]: [Function.AND],
  [FunctionName.NOT]: [Function.NOT],
  [FunctionName.OR]: [Function.OR],
  [FunctionName.SWITCH]: [Function.SWITCH],
  [FunctionName.ABS]: [Function.ABS],
  [FunctionName.CEILING]: [Function.CEILING],
  [FunctionName.FLOOR]: [Function.FLOOR],
  [FunctionName.ROUND]: [Function.ROUND],
  [FunctionName.SUM]: [Function.SUM]
};
export const functionNames = Object.keys(functionDictionary);
