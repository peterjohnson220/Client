import { SortDescriptor } from '@progress/kendo-data-query';
import { BasicGridSettings } from 'libs/features/basic-data-grid/models';
import { BasicDataViewField, DataViewFieldDataType, DataViewFilter } from 'libs/models/payfactors-api/reports/request';

export class QuickPriceHistoryContext {
  static gridId = 'QuickPrice_JobsCard_History_Modal';
  static baseEntity = 'QuickPrice_CompletedPricingHistory';
  static fields: BasicDataViewField[] = [
    {
      EntitySourceName: 'QuickPrice_CompletedPricingHistory',
      SourceName: 'Create_Date',
      DisplayName: 'Pricing Date',
      DataType: DataViewFieldDataType.DateTime,
      KendoGridField: 'QuickPrice_CompletedPricingHistory_Create_Date',
      SortOrder: 0,
      SortDirection: 'desc',
      Width: 70
    },
    {
      EntitySourceName: 'QuickPrice_CompletedPricingHistory',
      SourceName: 'Job_Title',
      DisplayName: 'Job Title',
      DataType: DataViewFieldDataType.String,
      KendoGridField: 'QuickPrice_CompletedPricingHistory_Job_Title'
    },
    {
      EntitySourceName: 'QuickPrice_CompletedPricingHistory',
      SourceName: 'Base50',
      DisplayName: 'Base 50th',
      DataType: DataViewFieldDataType.Int,
      KendoGridField: 'QuickPrice_CompletedPricingHistory_Base50',
      Width: 70
    },
    {
      EntitySourceName: 'QuickPrice_CompletedPricingHistory',
      SourceName: 'Create_User',
      DisplayName: 'Create_User',
      DataType: DataViewFieldDataType.Int,
      KendoGridField: 'QuickPrice_CompletedPricingHistory_Create_User',
      IsHidden: true
    },
    {
      EntitySourceName: 'CountryCurrency',
      SourceName: 'Currency_Code',
      DisplayName: 'Currency Code',
      DataType: DataViewFieldDataType.String,
      KendoGridField: 'CountryCurrency_Currency_Code',
      IsHidden: true
    }
  ];
  static defaultSort: SortDescriptor = {
    field: 'QuickPrice_CompletedPricingHistory_Create_Date',
    dir: 'desc'
  };

  static getFilters(userId: number): DataViewFilter[] {
    return [
      {
        EntitySourceName: this.baseEntity,
        SourceName: 'Create_User',
        Operator: '=',
        Values: [userId?.toString()]
      },
      {
        EntitySourceName: this.baseEntity,
        SourceName: 'Base50',
        Operator: '>',
        Values: ['0']
      }
    ];
  }
}
