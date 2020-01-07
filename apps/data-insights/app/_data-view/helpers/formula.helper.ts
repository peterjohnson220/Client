import { SpecialCharacter, FunctionName, Function, SuggestionIndicator } from '../models';

export class FormulaHelper {

  static getFormattedField(selectedFieldName: string, selectionStartCharacter: string): string {
    const closedBracketExists: boolean = selectionStartCharacter === SpecialCharacter.ClosedBracket;
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

  static buildSuggestionIndicator(): SuggestionIndicator {
    return {
      Type: null,
      Index: -1,
      Character: null,
      Entered: false
    };
  }
}
