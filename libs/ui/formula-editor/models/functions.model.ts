import { Suggestion } from 'libs/ui/formula-editor/index';

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
  SUM = 'SUM',
  DATE = 'DATE',
  DATEDIF = 'DATEDIF',
  DAY = 'DAY',
  DAYS = 'DAYS',
  HOUR = 'HOUR',
  MINUTE = 'MINUTE',
  MONTH = 'MONTH',
  NOW = 'NOW',
  SECOND = 'SECOND',
  TODAY = 'TODAY',
  YEAR = 'YEAR',
  ISBLANK = 'ISBLANK',
  UPPER = 'UPPER',
  LOWER = 'LOWER',
  TRIM = 'TRIM',
  RIGHT = 'RIGHT',
  LEFT = 'LEFT',
  REPT = 'REPT',
  LEN = 'LEN',
  MID = 'MID',
  CONCAT = 'CONCAT',
  SUBSTITUTE = 'SUBSTITUTE'
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
  SUM = 'SUM(value1, value2, value3...)',
  DATE = 'DATE(year, month, day)',
  DATEDIF = 'DATEDIF(start_date, end_date, unit_as_Y_or_M_or_D)',
  DAY = 'DAY(date)',
  DAYS = 'DAYS(end_date, start_date)',
  HOUR = 'HOUR(date)',
  MINUTE = 'MINUTE(date)',
  MONTH = 'MONTH(date)',
  NOW = 'NOW()',
  SECOND = 'SECOND(date)',
  TODAY = 'TODAY()',
  YEAR = 'YEAR(date)',
  ISBLANK = 'ISBLANK(value)',
  UPPER = 'UPPER(text)',
  LOWER = 'LOWER(text)',
  TRIM = 'TRIM(text)',
  RIGHT = 'RIGHT(text, number_of_chars)',
  LEFT = 'LEFT(text, number_of_chars)',
  REPT = 'REPT(text, number_of_times)',
  LEN = 'LEN(text)',
  MID = 'MID(text, start_number, number_of_chars)',
  CONCAT = 'CONCAT(text1, text2, ...)',
  SUBSTITUTE = 'SUBSTITUTE(text, old_text, new_text)'
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
  [FunctionName.SUM]: [Function.SUM],
  [FunctionName.DATE]: [Function.DATE],
  [FunctionName.DATEDIF]: [Function.DATEDIF],
  [FunctionName.DAY]: [Function.DAY],
  [FunctionName.DAYS]: [Function.DAYS],
  [FunctionName.MINUTE]: [Function.MINUTE],
  [FunctionName.HOUR]: [Function.HOUR],
  [FunctionName.MONTH]: [Function.MONTH],
  [FunctionName.SECOND]: [Function.SECOND],
  [FunctionName.TODAY]: [Function.TODAY],
  [FunctionName.NOW]: [Function.NOW],
  [FunctionName.YEAR]: [Function.YEAR],
  [FunctionName.ISBLANK]: [Function.ISBLANK],
  [FunctionName.UPPER]: [Function.UPPER],
  [FunctionName.LOWER]: [Function.LOWER],
  [FunctionName.TRIM]: [Function.TRIM],
  [FunctionName.RIGHT]: [Function.RIGHT],
  [FunctionName.LEFT]: [Function.LEFT],
  [FunctionName.REPT]: [Function.REPT],
  [FunctionName.LEN]: [Function.LEN],
  [FunctionName.MID]: [Function.MID],
  [FunctionName.CONCAT]: [Function.CONCAT],
  [FunctionName.SUBSTITUTE]: [Function.SUBSTITUTE]
};
export const functionSuggestionList: Suggestion[] = Object.keys(functionDictionary).map(key => {
  return {
    text: functionDictionary[key],
    displayText: key
  };
});
