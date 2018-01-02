import { ValidationResultItem } from '../common/validation-result-item.model';

export interface ExchangeJobsValidationResultModel {
  StoredDataFile: string;
  ValidationResults:  ValidationResultItem[];
}
