export interface SuggestionIndicator {
  Type: SuggestionIndicatorType;
  Index: number;
  Character: SpecialCharacter;
  Entered: boolean;
}

export enum SuggestionIndicatorType {
  Field = 'Field',
  Function = 'Function'
}

export enum SpecialCharacter {
  OpenBracket = '[',
  ClosedBracket = ']',
  DollarSign = '$'
}


