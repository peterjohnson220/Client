export interface EntityKeyFieldsResponse {
  IsValid: boolean;
  EntityKeyFields: LoaderEntityKeyFieldDto[];
}

export interface LoaderEntityKeyFieldDto {
  LoaderEntityKeyFieldId: number;
  CompanyId: number;
  Entity: string;
  KeyField: string;
}
