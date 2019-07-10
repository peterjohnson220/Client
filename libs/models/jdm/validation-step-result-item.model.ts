import { generateMockValidationResultItem, ValidationResultItem } from 'libs/models/common';

export class ValidateStepResultItem {
  StoredMappingFile: string;
  StoredDataFile: string;
  ValidationResults: ValidationResultItem[];
}

export function generateMockValidateStepResultItem(): ValidateStepResultItem {
  return {
    StoredDataFile: '',
    StoredMappingFile: '',
    ValidationResults: [ generateMockValidationResultItem() ]
  };
}
