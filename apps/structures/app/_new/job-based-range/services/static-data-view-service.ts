import { Observable, of } from 'rxjs';

import { IDataViewService } from 'libs/models/data-view';
import { DataViewEntityResponseWithCount, DataViewDataRequest, DataViewFieldDataType, SaveDataViewRequest } from 'libs/models/payfactors-api/reports';

export class StaticDataViewService implements IDataViewService {
  private dataViewConfig = {
    Entity: {
      Id: 1,
      IsBaseEntity: true,
      SourceName: 'JobBasedStructureRangeGroup',
      CreateDate: new Date(),
      EditDate: new Date(),
      CreateUser: 2437,
      EditUser: 2437
    },
    Fields: [
      {
        DataElementId: 6,
        DisplayName: 'CompanyJob ID',
        IsFilterable: false,
        IsSelectable: false,
        IsSelected: false,
        IsGlobalFilter: false,
        DataType: DataViewFieldDataType.Int,
        EntitySourceName: 'JobRanges',
        SourceName: 'CompanyJob_ID',
        Order: null,
        IsLocked: false,
        Template: null,
        Group: null,
        Width: null,
        TextAlign: null,
        Entity: 'JobRanges',
        CustomFilterStrategy: null,
        FilterPlaceholder: null
      },
      {
        DataElementId: 19,
        DisplayName: 'Job Title',
        IsFilterable: true,
        IsSelectable: true,
        IsSelected: true,
        IsGlobalFilter: false,
        DataType: DataViewFieldDataType.String,
        EntitySourceName: 'JobRanges',
        SourceName: 'Job_Title',
        Order: 1,
        IsLocked: true,
        Template: null,
        Group: null,
        Width: 200,
        TextAlign: null,
        Entity: 'JobRanges',
        CustomFilterStrategy: null,
        FilterPlaceholder: null
      },
      {
        DataElementId: 9991,
        DisplayName: 'Min',
        IsFilterable: true,
        IsSelectable: true,
        IsSelected: true,
        IsGlobalFilter: false,
        DataType: DataViewFieldDataType.Float,
        EntitySourceName: 'JobRanges',
        SourceName: 'Min',
        Order: 2,
        IsLocked: true,
        Template: 'currency',
        Group: null,
        Width: 100,
        TextAlign: null,
        Entity: 'JobRanges',
        CustomFilterStrategy: null,
        FilterPlaceholder: null
      },
      {
        DataElementId: 9992,
        DisplayName: 'Mid',
        IsFilterable: true,
        IsSelectable: true,
        IsSelected: true,
        IsGlobalFilter: false,
        DataType: DataViewFieldDataType.Float,
        EntitySourceName: 'JobRanges',
        SourceName: 'Mid',
        Order: 3,
        IsLocked: true,
        Template: 'currency',
        Group: null,
        Width: 100,
        TextAlign: null,
        Entity: 'JobRanges',
        CustomFilterStrategy: null,
        FilterPlaceholder: null
      },
      {
        DataElementId: 9993,
        DisplayName: 'Max',
        IsFilterable: true,
        IsSelectable: true,
        IsSelected: true,
        IsGlobalFilter: false,
        DataType: DataViewFieldDataType.Float,
        EntitySourceName: 'JobRanges',
        SourceName: 'Max',
        Order: 4,
        IsLocked: true,
        Template: 'currency',
        Group: null,
        Width: 100,
        TextAlign: null,
        Entity: 'JobRanges',
        CustomFilterStrategy: null,
        FilterPlaceholder: null
      },
      {
        DataElementId: 12,
        DisplayName: 'EE #',
        IsFilterable: false,
        IsSelectable: true,
        IsSelected: true,
        IsGlobalFilter: false,
        DataType: DataViewFieldDataType.Int,
        EntitySourceName: 'JobRanges',
        SourceName: 'EECount',
        Order: 5,
        IsLocked: false,
        Template: null,
        Group: null,
        Width: 75,
        TextAlign: 'center',
        Entity: 'JobRanges',
        CustomFilterStrategy: null,
        FilterPlaceholder: null
      },
      {
        DataElementId: 13,
        DisplayName: 'MRP',
        IsFilterable: false,
        IsSelectable: true,
        IsSelected: true,
        IsGlobalFilter: false,
        DataType: DataViewFieldDataType.Int,
        EntitySourceName: 'JobRanges',
        SourceName: 'MRP',
        Order: 6,
        IsLocked: false,
        Template: null,
        Group: null,
        Width: 75,
        TextAlign: 'center',
        Entity: 'JobRanges',
        CustomFilterStrategy: null,
        FilterPlaceholder: null
      },
      {
        DataElementId: 14,
        DisplayName: 'Job Code',
        IsFilterable: true,
        IsSelectable: true,
        IsSelected: false,
        IsGlobalFilter: false,
        DataType: DataViewFieldDataType.String,
        EntitySourceName: 'JobRanges',
        SourceName: 'Job_Code',
        Order: 7,
        IsLocked: false,
        Template: null,
        Group: null,
        Width: 150,
        TextAlign: null,
        Entity: 'JobRanges',
        CustomFilterStrategy: null,
        FilterPlaceholder: null
      },
      {
        DataElementId: 16,
        DisplayName: 'Job Family',
        IsFilterable: true,
        IsSelectable: true,
        IsSelected: false,
        IsGlobalFilter: false,
        DataType: DataViewFieldDataType.String,
        EntitySourceName: 'JobRanges',
        SourceName: 'Job_Family',
        Order: 8,
        IsLocked: false,
        Template: null,
        Group: null,
        Width: 150,
        TextAlign: null,
        Entity: 'JobRanges',
        CustomFilterStrategy: null,
        FilterPlaceholder: null
      },
      {
        DataElementId: 11,
        DisplayName: 'FLSA',
        IsFilterable: true,
        IsSelectable: true,
        IsSelected: false,
        IsGlobalFilter: false,
        DataType: DataViewFieldDataType.String,
        EntitySourceName: 'JobRanges',
        SourceName: 'FLSA_Status',
        Order: 9,
        IsLocked: false,
        Template: null,
        Group: null,
        Width: 150,
        TextAlign: null,
        Entity: 'JobRanges',
        CustomFilterStrategy: null,
        FilterPlaceholder: null
      }
    ],
    Filters: [],
    Name: 'JobBasedStructureRangeGroup'
  };

  private dataWithCount = {
    TotalCount: 2,
    Data: [{
      JobRanges_ID: 1732407,
      JobRanges_Job_Title: 'Associate Recruiter',
      JobRanges_Min: 29000,
      JobRanges_Mid: 39500,
      JobRanges_Max: 50000,
      JobRanges_Job_Code: 'Job Code 1',
      JobRanges_Job_Family: 'Job Family 1',
      JobRanges_FLSA_Status: 'Job FLSA 1',
      JobRanges_EECount: 3,
      JobRanges_MRP: 39500
    },
      {
        JobRanges_ID: 1732408,
        JobRanges_Job_Title: 'Associate Benefits Spec.',
        JobRanges_Min: 30000,
        JobRanges_Mid: 41500,
        JobRanges_Max: 53000,
        JobRanges_Job_Code: 'Job Code 2',
        JobRanges_Job_Family: 'Job Family 2',
        JobRanges_FLSA_Status: 'Job FLSA 2',
        JobRanges_EECount: 3,
        JobRanges_MRP: 41500
      },
      {
        JobRanges_ID: 1732409,
        JobRanges_Job_Title: 'Associate H.R. Generalist',
        JobRanges_Min: 35000,
        JobRanges_Mid: 46500,
        JobRanges_Max: 58000,
        JobRanges_Job_Code: 'Job Code 2',
        JobRanges_Job_Family: 'Job Family 2',
        JobRanges_FLSA_Status: 'Job FLSA 2',
        JobRanges_EECount: 3,
        JobRanges_MRP: 46500
      },
      {
        JobRanges_ID: 1732410,
        JobRanges_Job_Title: 'Compensation Specialist',
        JobRanges_Min: 62000,
        JobRanges_Mid: 86000,
        JobRanges_Max: 110000,
        JobRanges_Job_Code: 'Job Code 2',
        JobRanges_Job_Family: 'Job Family 2',
        JobRanges_FLSA_Status: 'Job FLSA 2',
        JobRanges_EECount: 3,
        JobRanges_MRP: 86000
      },
      {
        JobRanges_ID: 1732411,
        JobRanges_Job_Title: 'Internal Comm. Specialist',
        JobRanges_Min: 85000,
        JobRanges_Mid: 102500,
        JobRanges_Max: 120000,
        JobRanges_Job_Code: 'Job Code 2',
        JobRanges_Job_Family: 'Job Family 2',
        JobRanges_FLSA_Status: 'Job FLSA 2',
        JobRanges_EECount: 3,
        JobRanges_MRP: 102500
      },
      {
        JobRanges_ID: 1732412,
        JobRanges_Job_Title: 'Recruiter',
        JobRanges_Min: 115000,
        JobRanges_Mid: 130000,
        JobRanges_Max: 145000,
        JobRanges_Job_Code: 'Job Code 2',
        JobRanges_Job_Family: 'Job Family 2',
        JobRanges_FLSA_Status: 'Job FLSA 2',
        JobRanges_EECount: 3,
        JobRanges_MRP: 130000
      },
      {
        JobRanges_ID: 1732413,
        JobRanges_Job_Title: 'Compensation Manager',
        JobRanges_Min: 119000,
        JobRanges_Mid: 135000,
        JobRanges_Max: 152000,
        JobRanges_Job_Code: 'Job Code 2',
        JobRanges_Job_Family: 'Job Family 2',
        JobRanges_FLSA_Status: 'Job FLSA 2',
        JobRanges_EECount: 3,
        JobRanges_MRP: 135000
      },
      {
        JobRanges_ID: 1732414,
        JobRanges_Job_Title: 'Internal Comm. Manager',
        JobRanges_Min: 120000,
        JobRanges_Mid: 137500,
        JobRanges_Max: 155000,
        JobRanges_Job_Code: 'Job Code 2',
        JobRanges_Job_Family: 'Job Family 2',
        JobRanges_FLSA_Status: 'Job FLSA 2',
        JobRanges_EECount: 3,
        JobRanges_MRP: 137500
      },
      {
        JobRanges_ID: 1732415,
        JobRanges_Job_Title: 'Relocation Consultant',
        JobRanges_Min: 122000,
        JobRanges_Mid: 137500,
        JobRanges_Max: 170000,
        JobRanges_Job_Code: 'Job Code 2',
        JobRanges_Job_Family: 'Job Family 2',
        JobRanges_FLSA_Status: 'Job FLSA 2',
        JobRanges_EECount: 3,
        JobRanges_MRP: 146000
      },
      {
        JobRanges_ID: 1732416,
        JobRanges_Job_Title: 'H.R. Manager',
        JobRanges_Min: 150000,
        JobRanges_Mid: 175000,
        JobRanges_Max: 200000,
        JobRanges_Job_Code: 'Job Code 2',
        JobRanges_Job_Family: 'Job Family 2',
        JobRanges_FLSA_Status: 'Job FLSA 2',
        JobRanges_EECount: 3,
        JobRanges_MRP: 175000
      }
    ]
  };

  getDataViewConfig(pageViewId: string, name: string): Observable<any> {
    return of(this.dataViewConfig);
  }

  getDataWithCount(request: DataViewDataRequest): Observable<DataViewEntityResponseWithCount> {
    return of(this.dataWithCount);
  }

  getViewsByUser(pageViewId: string) {
    return of([this.dataViewConfig]);
  }

  updateDataView(request: SaveDataViewRequest) {
    return of(this.dataViewConfig);
  }
}
