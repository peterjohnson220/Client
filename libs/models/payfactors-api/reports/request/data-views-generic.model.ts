import { DataViewFieldDataType, DataViewField, DataViewFilter } from './data-view-data-request.model';

export interface DataViewConfig {
  Entity: DataViewEntity;
  Fields: ViewField[];
  Name: string;
  ExportViewId: number;
}

export interface SimpleDataView {
  Name: string;
  Description: string;
}

export interface DataViewEntity {
  Id: number;
  IsBaseEntity: boolean;
  SourceName: string;
  CreateDate: Date;
  EditDate: Date;
  CreateUser: number;
  EditUser: number;
}

/*
  Is_Selected - Column is retrieved from the DB
  Is_Selecteable - Column is allowed to be visible and selectable via the column picker
  Is_Filterable - Column can be shown on the side filter panel
  Is_GlobalFilter - Column shows as a global filter in the action bar

  Is_selected + Is_Selectable = Column is visible
  Is_selected + Is_Filterable = Column is shows in the side Filters
  Is_Selected + NOT is_Selectable = Column is retrieved from the DB but not shown
	  ex: ID columns or columns used as composite for other columns Scope, Rate, Geo_Value, Industry_Value

  NOT Is_Selected + NOT Is_Selectable + CustomFilterStrategy = Custom Filter Column not retrieved from the DB (ex: Search Employees)
*/
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
  CustomFilterStrategy: string;
  FilterPlaceholder: string;
  FilterValue: string;
  FilterOperator: string;
  SortOrder?: number;
  SortDirection?: 'asc' | 'desc';
  GroupOrder?: number;
  SelectionOrder?: number;
  // TODO: Replace FilterValue with FilterValues.
  // Update filter builder and filter panel accordingly.
  FilterValues?: string[];
  IsSortable: boolean;
}

export interface DataView {
  EntityId: number;
  PageViewId: string;
  Elements: DataViewField[];
  Filters: DataViewFilter[];
  Name?: string;
  Type?: DataViewType;
}

export enum DataViewType {
  dataInsights = 'DataInsights',
  pfDataGrid = 'PfDataGrid',
  userDefault = 'UserDefault',
  savedFilter = 'SavedFilter',
  export = 'Export'
}

export function generateMockViewConfig() {
  return {
    EntityId: 1,
    Fields: [],
    Filters: [],
    Name: 'Hello'
  };
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
    CustomFilterStrategy: null,
    FilterPlaceholder: null,
    FilterValue: null,
    FilterOperator: null,
    IsSortable: true
  };
}

export function generateMockViewFieldList(count: number): ViewField[] {
  const fields: ViewField[] = [];
  for (let i = 0; i < count; i++) {
    fields.push(generateMockViewField(i + 1));
  }
  return fields;
}
