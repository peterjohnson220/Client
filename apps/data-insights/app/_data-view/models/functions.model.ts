export enum FunctionName {
  IF = 'IF',
  AND = 'AND',
  NOT = 'NOT',
  OR = 'OR',
  SWITCH = 'SWITCH'
}

export enum Function {
  IF = 'IF(logical_test, value_if_true, value_if_false)',
  AND = 'AND(condition1, condition2)',
  NOT = 'NOT(condition)',
  OR = 'OR(condition1, condition2)',
  SWITCH = 'SWITCH(value_to_switch, value_to_match1, value_to_return_if_match1, value_to_return_if_no_match)'
}

export const functionNames = [ FunctionName.IF, FunctionName.AND, FunctionName.NOT, FunctionName.OR, FunctionName.SWITCH ];
