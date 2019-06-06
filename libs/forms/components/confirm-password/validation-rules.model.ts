export interface ValidationRules {
  Name: string;
  Rule: string;
  Message: string;
  IsSatisfied: boolean;
  Validator?: () => boolean;
}
