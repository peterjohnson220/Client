import { SpecialCharacters, FunctionName, Function } from '../models';

export class FormulaHelper {

  static getFormattedField(selectedFieldName: string, selectionStartCharacter: string): string {
    const closedBracketExists: boolean = selectionStartCharacter === SpecialCharacters.ClosedBracket;
    return closedBracketExists ? `[${selectedFieldName}` : `[${selectedFieldName}]`;
  }

  static getFormattedFunction(functionName: string): string {
    switch (functionName) {
      case FunctionName.IF: {
        return Function.IF;
      }
      case FunctionName.AND: {
        return Function.AND;
      }
      case FunctionName.OR: {
        return Function.OR;
      }
      case FunctionName.NOT: {
        return Function.NOT;
      }
      case FunctionName.SWITCH: {
        return Function.SWITCH;
      }
      default: {
        return '';
      }
    }
  }
}
