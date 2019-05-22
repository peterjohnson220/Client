import { GenericNameValueDto } from '../generic-name-value-dto.model';

export interface AggregateResult {
  BucketName: string;
  FieldName: string;
  Data: GenericNameValueDto[];
}
