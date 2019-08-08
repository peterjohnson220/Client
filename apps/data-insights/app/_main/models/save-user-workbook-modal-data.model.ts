import { Entity, generateMockEntity } from './entity.model';

export interface SaveUserWorkbookModalData {
  Entity?: Entity;
  Name: string;
  Summary: string;
}

export function generateMockSaveUserWorkbookModalData(): SaveUserWorkbookModalData{
  return {
    Entity: generateMockEntity(),
    Summary: 'Test summary',
    Name: 'New Name'
  };
}
