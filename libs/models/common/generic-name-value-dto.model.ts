export interface GenericNameValueDto {
  Name: string;
  Value: string;
}

export interface GenericTextValueDto {
  Text: string;
  Value: string;
}

export interface GenericNameValue<T> {
  Name: string;
  Value: T;
}
