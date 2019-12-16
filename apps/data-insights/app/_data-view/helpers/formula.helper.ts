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
      default: {
        return '';
      }
    }
  }
}
