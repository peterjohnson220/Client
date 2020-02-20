import { DataViewFilter } from 'libs/models/payfactors-api/reports/request';

import {
  FilterOperator, Equals,
  Between, IsAfter, IsBefore, Is,
  LessThan, GreaterThan, GreaterThanOrEqual, LessThanOrEqual,
  FieldDataType, IsTrueFalse, Contains, DoesNotContain, DoesNotEqual
} from '../models';

export class FilterOperatorHelper {

  static getFilterOperatorByDataType(dataType: FieldDataType, dataViewFilter: DataViewFilter): FilterOperator {
    switch (dataType) {
      case FieldDataType.Date: {
        return this.mapToFilterOperatorForDateTimeDataType(dataViewFilter);
      }
      case FieldDataType.Int:
      case FieldDataType.Float: {
        return this.mapToFilterOperatorForNumericDataType(dataViewFilter);
      }
      case FieldDataType.Bit: {
        return this.mapToFilterOperatorForBitDataType(dataViewFilter);
      }
      default: {
        return this.mapToFilterOperatorForStringDataType(dataViewFilter);
      }
    }
  }

  static mapToFilterOperatorForStringDataType(dataViewFilter: DataViewFilter): FilterOperator {
    switch (dataViewFilter.Operator) {
      case Contains.Value: {
        return Contains;
      }
      case DoesNotContain.Value: {
        return DoesNotContain;
      }
      case DoesNotEqual.Value: {
        return DoesNotEqual;
      }
      default: {
        return Equals;
      }
    }
  }

  static mapToFilterOperatorForDateTimeDataType(dataViewFilter: DataViewFilter): FilterOperator {
    switch (dataViewFilter.Operator) {
      case Between.Value: {
        return Between;
      }
      case IsAfter.Value: {
        return IsAfter;
      }
      case IsBefore.Value: {
        return IsBefore;
      }
      case Is.Value: {
        return Is;
      }
      default: {
        return Between;
      }
    }
  }

  static mapToFilterOperatorForNumericDataType(dataViewFilter: DataViewFilter): FilterOperator {
    switch (dataViewFilter.Operator) {
      case GreaterThan.Value: {
        return GreaterThan;
      }
      case LessThan.Value: {
        return LessThan;
      }
      case GreaterThanOrEqual.Value: {
        return GreaterThanOrEqual;
      }
      case LessThanOrEqual.Value: {
        return LessThanOrEqual;
      }
      default: {
        return Equals;
      }
    }
  }

  static mapToFilterOperatorForBitDataType(dataViewFilter: DataViewFilter): FilterOperator {
    switch (dataViewFilter.Operator) {
      default: {
        return IsTrueFalse;
      }
    }
  }
}
