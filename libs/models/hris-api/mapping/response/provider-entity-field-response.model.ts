export interface ProviderEntityField {
  dataType: string;
  isArray: boolean;
  metatData: any;
  name: string;
}

export interface ProviderEntitiyFieldsResponse {
  fields: ProviderEntityField[];
}
