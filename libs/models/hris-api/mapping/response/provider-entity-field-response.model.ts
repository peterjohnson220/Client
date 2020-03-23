export interface ProviderEntityField {
  dataType: string;
  isArray: boolean;
  metadata: any;
  name: string;
}

export interface ProviderEntitiyFieldsResponse {
  fields: ProviderEntityField[];
}
