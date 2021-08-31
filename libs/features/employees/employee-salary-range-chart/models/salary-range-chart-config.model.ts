import { YAxisPlotBandsOptions } from 'highcharts';

import { RangeDistributionTypeIds } from 'libs/constants/structures/range-distribution-type-ids';
import { RangeType } from 'libs/constants/structures/range-type';
import { RateType } from 'libs/data/data-sets';
import { BasicDataViewField, DataViewFieldDataType, DataViewFilter } from 'libs/models/payfactors-api';

export interface EmployeeForSalaryRangeChart {
  CompanyEmployeeId: number;
  CompanyJobId: number;
  CompanyPayMarketId: number;
  StructureRangeGroupId?: number;
}

export interface EmployeeSalaryRangeChartData {
  RangeDistributionTypeId: RangeDistributionTypeIds;
  EmployeeId: string;
  FullName: string;
  BaseSalary: number;
  PositionInRange: number;
  Currency: string;
  Min: number;
  Mid: number;
  Max: number;
  TertileFirst: number;
  TertileSecond: number;
  QuartileFirst: number;
  QuartileSecond: number;
  QuintileFirst: number;
  QuintileSecond: number;
  QuintileThird: number;
  QuintileFourth: number;
  Rate: RateType;
  PlotBands?: YAxisPlotBandsOptions[];
  ChartTickPositions?: number[];
  ChartEmployeeNameAndId?: string;
}

export class EmployeeSalaryRangeChartConfig {
  static gridId = 'employee-grade-base-salary-range-chart';

  static getBaseEntityByRangeType(rangeTypeId: number): string {
    if (rangeTypeId === RangeType.Job) {
      return 'CompanyStructures_Ranges';
    }
    return 'vw_EmployeesGradeBasedStructureInfo';
  }

  static getCurrencySourceNameByRangeType(rangeTypeId: number): string {
    if (rangeTypeId === RangeType.Job) {
      return 'CompanyStructures_RangeGroup_Currency';
    }
    return 'vw_EmployeesGradeBasedStructureInfo_GradeBased_Currency_Code';
  }

  static getPositionInRangeSourceNameByRangeType(rangeTypeId: number): string {
    if (rangeTypeId === RangeType.Job) {
      return 'CompanyEmployees_PositionInRangeStructureRangeGroup';
    }
    return 'vw_EmployeesGradeBasedStructureInfo_GradeBased_PositionInRangeStructureRangeGroup';
  }

  static getRangeDistributionTypeSourceNameByRangeType(rangeTypeId: number): string {
    if (rangeTypeId === RangeType.Job) {
      return 'CompanyStructures_RangeGroup_RangeDistributionType_ID';
    }
    return 'CompanyJobs_Structures_RangeDistributionType_ID';
  }

  static getRateByRangeType(rangeTypeId: number): string {
    if (rangeTypeId === RangeType.Job) {
      return 'CompanyStructures_RangeGroup_Rate';
    }
    return 'vw_EmployeesGradeBasedStructureInfo_CompanyStructureRangeGroupRate';
  }

  static getFieldsByRangeType(rangeTypeId: number): BasicDataViewField[] {
    const baseEntity = this.getBaseEntityByRangeType(rangeTypeId);
    let fields: BasicDataViewField[] = [
      {
        EntitySourceName: 'CompanyEmployees',
        SourceName: 'First_Name',
        DisplayName: 'First Name',
        DataType: DataViewFieldDataType.String,
        KendoGridField: 'CompanyEmployees_First_Name'
      },
      {
        EntitySourceName: 'CompanyEmployees',
        SourceName: 'Last_Name',
        DisplayName: 'Last Name',
        DataType: DataViewFieldDataType.String,
        KendoGridField: 'CompanyEmployees_Last_Name'
      },
      {
        EntitySourceName: 'CompanyEmployees',
        SourceName: 'Employee_ID',
        DisplayName: 'Employee_ID',
        DataType: DataViewFieldDataType.String,
        KendoGridField: 'CompanyEmployees_Employee_ID'
      },
      {
        EntitySourceName: 'CompanyEmployees',
        SourceName: 'Base',
        DisplayName: 'Base Salary',
        DataType: DataViewFieldDataType.Float,
        KendoGridField: 'CompanyEmployees_Base'
      },
      {
        EntitySourceName: 'CompanyEmployees',
        SourceName: 'CompanyPayMarket_ID',
        DisplayName: 'CompanyPayMarket_ID',
        DataType: DataViewFieldDataType.Int,
        KendoGridField: 'CompanyEmployees_CompanyPayMarket_ID'
      },
      {
        EntitySourceName: baseEntity,
        SourceName: 'Min',
        DisplayName: 'Min',
        DataType: DataViewFieldDataType.Float,
        KendoGridField: `${baseEntity}_Min`
      },
      {
        EntitySourceName: baseEntity,
        SourceName: 'Mid',
        DisplayName: 'Mid',
        DataType: DataViewFieldDataType.Float,
        KendoGridField: `${baseEntity}_Mid`
      },
      {
        EntitySourceName: baseEntity,
        SourceName: 'Max',
        DisplayName: 'Max',
        DataType: DataViewFieldDataType.Float,
        KendoGridField: `${baseEntity}_Max`
      },
      {
        EntitySourceName: baseEntity,
        SourceName: 'Tertile_First',
        DisplayName: 'Top 1st 3rd',
        DataType: DataViewFieldDataType.Float,
        KendoGridField: `${baseEntity}_Tertile_First`
      },
      {
        EntitySourceName: baseEntity,
        SourceName: 'Tertile_Second',
        DisplayName: 'Top 2nd 3rd',
        DataType: DataViewFieldDataType.Float,
        KendoGridField: `${baseEntity}_Tertile_Second`
      },
      {
        EntitySourceName: baseEntity,
        SourceName: 'Quartile_First',
        DisplayName: 'Top 1st 4th',
        DataType: DataViewFieldDataType.Float,
        KendoGridField: `${baseEntity}_Quartile_First`
      },
      {
        EntitySourceName: baseEntity,
        SourceName: 'Quartile_Second',
        DisplayName: 'Top 3rd 4th',
        DataType: DataViewFieldDataType.Float,
        KendoGridField: `${baseEntity}_Quartile_Second`
      },
      {
        EntitySourceName: baseEntity,
        SourceName: 'Quintile_First',
        DisplayName: 'Top 1st 5th',
        DataType: DataViewFieldDataType.Float,
        KendoGridField: `${baseEntity}_Quintile_First`
      },
      {
        EntitySourceName: baseEntity,
        SourceName: 'Quintile_Second',
        DisplayName: 'Top 2nd 5th',
        DataType: DataViewFieldDataType.Float,
        KendoGridField: `${baseEntity}_Quintile_Second`
      },
      {
        EntitySourceName: baseEntity,
        SourceName: 'Quintile_Third',
        DisplayName: 'Top 3rd 5th',
        DataType: DataViewFieldDataType.Float,
        KendoGridField: `${baseEntity}_Quintile_Third`
      },
      {
        EntitySourceName: baseEntity,
        SourceName: 'Quintile_Fourth',
        DisplayName: 'Top 4th 5th',
        DataType: DataViewFieldDataType.Float,
        KendoGridField: `${baseEntity}_Quintile_Fourth`
      }
    ];
    const otherFields = this.getFieldsRangeType(rangeTypeId);
    fields = fields.concat(otherFields);
    return fields;
  }

  static getFieldsRangeType(rangeTypeId: number): BasicDataViewField[] {
    switch (rangeTypeId) {
      case RangeType.Grade:
        return [
          {
            EntitySourceName: 'vw_EmployeesGradeBasedStructureInfo',
            SourceName: 'ConversionFactor',
            DisplayName: 'ConversionFactor',
            DataType: DataViewFieldDataType.Int,
            KendoGridField: 'vw_EmployeesGradeBasedStructureInfo_ConversionFactor'
          },
          {
            EntitySourceName: 'vw_EmployeesGradeBasedStructureInfo',
            SourceName: 'GradeBased_PositionInRangeStructureRangeGroup',
            DisplayName: 'Position in Range',
            DataType: DataViewFieldDataType.Float,
            KendoGridField: 'vw_EmployeesGradeBasedStructureInfo_GradeBased_PositionInRangeStructureRangeGroup'
          },
          {
            EntitySourceName: 'vw_EmployeesGradeBasedStructureInfo',
            SourceName: 'Currency_Code',
            DisplayName: 'Currency',
            DataType: DataViewFieldDataType.String,
            KendoGridField: 'vw_EmployeesGradeBasedStructureInfo_GradeBased_Currency_Code'
          },
          {
            EntitySourceName: 'vw_EmployeesGradeBasedStructureInfo',
            SourceName: 'CompanyStructureRangeGroupRate',
            DisplayName: 'Rate',
            DataType: DataViewFieldDataType.String,
            KendoGridField: 'vw_EmployeesGradeBasedStructureInfo_CompanyStructureRangeGroupRate'
          },
          {
            EntitySourceName: 'CompanyJobs_Structures',
            SourceName: 'RangeDistributionType_ID',
            DisplayName: 'RangeDistributionType_ID',
            DataType: DataViewFieldDataType.Int,
            KendoGridField: 'CompanyJobs_Structures_RangeDistributionType_ID'
          },
        ];
      case RangeType.Job: {
        return [
          {
            EntitySourceName: 'CompanyEmployees',
            SourceName: 'PositionInRangeStructureRangeGroup',
            DisplayName: 'Position in Range',
            DataType: DataViewFieldDataType.Float,
            KendoGridField: 'CompanyEmployees_PositionInRangeStructureRangeGroup'
          },
          {
            EntitySourceName: 'CompanyStructures_RangeGroup',
            SourceName: 'Currency',
            DisplayName: 'Currency',
            DataType: DataViewFieldDataType.String,
            KendoGridField: 'CompanyStructures_RangeGroup_Currency'
          },
          {
            EntitySourceName: 'CompanyStructures_RangeGroup',
            SourceName: 'Rate',
            DisplayName: 'Rate',
            DataType: DataViewFieldDataType.String,
            KendoGridField: 'CompanyStructures_RangeGroup_Rate'
          },
          {
            EntitySourceName: 'CompanyStructures_RangeGroup',
            SourceName: 'RangeDistributionType_ID',
            DisplayName: 'RangeDistributionType_ID',
            DataType: DataViewFieldDataType.Int,
            KendoGridField: 'CompanyStructures_RangeGroup_RangeDistributionType_ID'
          },
        ];
      }
      default:
        return null;
    }
  }

  static getFilters(data: EmployeeForSalaryRangeChart, baseEntity: string, rangeGroupId: number): DataViewFilter[] {
    return [
      {
        EntitySourceName: 'CompanyEmployees',
        SourceName: 'CompanyEmployee_ID',
        Operator: '=',
        Values: [data?.CompanyEmployeeId?.toString()]
      },
      {
        EntitySourceName: 'CompanyEmployees',
        SourceName: 'CompanyJob_ID',
        Operator: '=',
        Values: [data?.CompanyJobId?.toString()]
      },
      {
        EntitySourceName: 'CompanyEmployees',
        SourceName: 'CompanyPayMarket_ID',
        Operator: '=',
        Values: [data?.CompanyPayMarketId?.toString()]
      },
      {
        EntitySourceName: baseEntity,
        SourceName: 'CompanyStructuresRangeGroup_ID',
        Operator: '=',
        Values: [rangeGroupId?.toString()]
      }
    ];
  }
}
