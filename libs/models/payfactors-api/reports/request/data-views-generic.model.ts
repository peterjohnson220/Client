import { DataViewFieldDataType } from './data-view-data-request.model';

export interface DataViewConfig {
  EntityId: number;
  Fields: ViewField[];
}

export interface ViewField {
  DataElementId: number;
  DataType: DataViewFieldDataType;
  DisplayName: string;
  Entity: string;
  EntityId: number;
  EntitySourceName: string;
  IsFilterable: boolean;
  IsGlobalFilter: boolean;
  IsLocked: boolean;
  IsSelectable: boolean;
  IsSelected: boolean;
  Order: number;
  SourceName: string;
  Template: string;
  Group: string;
  Width: number;
  TextAlign: string;
}

export interface SaveDataViewRequest {
  EntityId: number;
  PageViewId: string;
  Elements: any[];
}

export function generateMockViewField(mockNumber: number = 1): ViewField {
  return {
    DataElementId: mockNumber,
    DataType: DataViewFieldDataType.String,
    DisplayName: `Test Mock Display Name ${mockNumber}`,
    Entity: 'TestEntity',
    EntityId: 99,
    EntitySourceName: 'TestEntity',
    IsFilterable: false,
    IsGlobalFilter: false,
    IsLocked: false,
    IsSelectable: false,
    IsSelected: true,
    Order: null,
    SourceName: `TestMockField${mockNumber}`,
    Template: null,
    Group: null,
    Width: null,
    TextAlign: null,
  };
}