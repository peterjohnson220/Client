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
  Type: FilterType;
}

export interface TextFilter extends Filter {
  Value: string;
}

export interface MultiSelectFilter extends Filter {
  Options: MultiSelectOption[];
  RefreshOptionsFromServer: boolean;
  OptionCountDisabled?: boolean;
}

export interface RangeFilter extends Filter {
  MinimumValue: number;
  MaximumValue: number;
  SelectedMinValue: number;
  SelectedMaxValue: number;
}

export interface MultiSelectOption {
  Name: string;
  Value: any;
  Count?: number;
  Selected: boolean;
}

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
    Order: 1
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
    Order: 1
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
    BackingField: 'base_50th'
  };
}

export function generateMockChangeContext(): ChangeContext {
  return {
    pointerType: PointerType.Max,
    value: 50000,
    highValue: 75000
  };
}
