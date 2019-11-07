export interface DataViewEntityResponseWithCount {
  TotalCount: number;
  Data: DataViewEntityResponse[];
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
