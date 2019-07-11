import { ValidationResultItemTypeEnum } from './validation-result-item-type.enum';

export interface ValidationResultItem {
  Type: string;
  Message: string;
}

export function generateMockValidationResultItem(): ValidationResultItem {
  return {
    Type: ValidationResultItemTypeEnum.Info,
    Message: 'test'
  };
}
