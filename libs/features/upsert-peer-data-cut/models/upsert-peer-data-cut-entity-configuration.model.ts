import { UpsertPeerDataCutEntities, UpsertPeerDataCutParentEntities } from '../constants';

export interface UpsertPeerDataCutEntityConfigurationModel {
  BaseEntityId: number;
  ParentEntityId: number;
  BaseEntity: UpsertPeerDataCutEntities;
  ParentEntity: UpsertPeerDataCutParentEntities;
}
