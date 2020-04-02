import { Entity, EntityData, generateMockEntity } from './entity.model';

export interface BaseDataView {
  Name: string;
  Summary: string;
  Entity: Entity;
  RequiredInfo?: EntityData[];
}

export function generateMockBaseDataView(): BaseDataView {
  return {
    Entity: generateMockEntity(),
    Summary: 'Test summary',
    Name: 'New Name'
  };
}
