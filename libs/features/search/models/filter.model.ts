import { ChangeContext, PointerType } from 'ng5-slider';

export enum FilterType {
  Text = 'Text',
  Multi = 'Multi',
  Range = 'Range'
}

export interface Filter {
  Id: string;
  BackingField: string;
  DisplayName: string;
  Order: number;
  Locked?: boolean;
  Type: FilterType;
  CssClassName?: string;
  SaveDisabled?: boolean;
}

export interface TextFilter extends Filter {
  Value: string;
  DefaultValue?: any;
  Type: FilterType.Text;
}

export interface MultiSelectFilter extends Filter {
  Options: MultiSelectOption[];
  RefreshOptionsFromServer: boolean;
  OptionCountDisabled?: boolean;
  DefaultSelections: any[];
  Type: FilterType.Multi;
  ShowAllOptions?: boolean;
}

export interface RangeFilter extends Filter {
  MinimumValue: number;
  MaximumValue: number;
  SelectedMinValue: number;
  SelectedMaxValue: number;
  Precision: number;
  Type: FilterType.Range;
}

export interface MultiSelectOption {
  Name: string;
  Value: any;
  Count?: number;
  Selected: boolean;
}

export type Filters = MultiSelectFilter | RangeFilter | TextFilter;

// Type Helpers
export function isTextFilter(filter: Filter): filter is TextFilter {
  return filter.Type === FilterType.Text;
}

export function isMultiFilter(filter: Filter): filter is MultiSelectFilter {
  return filter.Type === FilterType.Multi;
}

export function isRangeFilter(filter: Filter): filter is RangeFilter {
  return filter.Type === FilterType.Range;
}

// Mock Functions
export function generateMockTextFilter(): TextFilter {
  return {
    Id: 'jobTitleCode',
    BackingField: 'job_title_code',
    DisplayName: 'Job Title/Code',
    Value: 'Accountant',
    Type: FilterType.Text,
    Order: 1,
    Locked: false,
    CssClassName: 'au-txt-job-title'
  };
}

export function generateMockMultiSelectFilter(): MultiSelectFilter {
  return {
    Id: 'publisher',
    BackingField: 'survey_publisher',
    DisplayName: 'Publisher',
    Options: [generateMockMultiSelectOption()],
    Type: FilterType.Multi,
    RefreshOptionsFromServer: true,
    DefaultSelections: [],
    Order: 1,
    Locked: false,
    CssClassName: 'au-chk-publisher'
  };
}

export function generateMockMultiSelectOption(): MultiSelectOption {
  return {
    Name: 'Option 1',
    Count: 2,
    Value: 32,
    Selected: true
  };
}

export function generateMockRangeFilter(): RangeFilter {
  return {
    Id: 'base50th',
    Type: FilterType.Range,
    Order: 12,
    DisplayName: 'Base 50th',
    MinimumValue: 45000,
    MaximumValue: 90000,
    SelectedMinValue: 50000,
    SelectedMaxValue: 75000,
    BackingField: 'base_50th',
    Precision: 1,
    Locked: false
  };
}

export function generateMockChangeContext(): ChangeContext {
  return {
    pointerType: PointerType.Max,
    value: 50000,
    highValue: 75000
  };
}
