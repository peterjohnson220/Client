import { DataViewScope, EntityData } from '../response';

export interface CreateUserViewRequest {
  BaseEntityId: number;
  Name: string;
  Summary: string;
  Scope?: DataViewScope;
  RequiredInfo?: EntityData[];
}
