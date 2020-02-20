export interface DataViewEntityResponseWithCount {
  TotalCount: number;
  Data: any[];
}

export interface DataViewEntityResponse {
  EntityId: number;
  Entity: string;
  IsBaseEntity: boolean;
  SourceName: string;
  CreateDate: Date;
  CreateUser: number;
  EditDate: Date;
  EditUser: number;
}
