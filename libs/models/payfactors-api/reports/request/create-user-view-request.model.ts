import { EntityData } from '../response';

export interface CreateUserViewRequest {
  BaseEntityId: number;
  Name: string;
  Summary: string;
  RequiredInfo?: EntityData[];
}
