export interface UpdateDataViewFieldsRequest {
  UserDataViewId: number;
  Fields: UserDataElement[];
}

export interface UserDataElement {
  DataElementId?: number;
  DisplayName: string;
  Order: number;
  UserFormulaId?: number;
  SortOrder?: number;
  SortDirection?: string;
}
