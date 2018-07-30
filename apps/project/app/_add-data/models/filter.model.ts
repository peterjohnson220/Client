export enum FilterType {
  Text = 'Text',
  Multi = 'Multi'
}

export interface Filter {
  Id: string;
  BackingField: string;
  DisplayName: string;
  Type: FilterType;
}

export interface TextFilter extends Filter {
  Value: string;
}

export interface MultiSelectFilter extends Filter {
  Options: MultiSelectOption[];
}


export interface MultiSelectOption {
  Id: string;
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


// Mock Functions
export function generateMockTextFilter(): TextFilter {
  return {
    Id: 'jobTitleCode',
    BackingField: 'job_title_code',
    DisplayName: 'Job Title/Code',
    Value: 'Accountant',
    Type: FilterType.Text
  };
}

export function generateMockMultiSelectFilter(): MultiSelectFilter {
  return {
    Id: 'publisher',
    BackingField: 'survey_publisher',
    DisplayName: 'Publisher',
    Options: [{
      Name: 'Option 1',
      Count: 2,
      Id: '3as0df89asdf',
      Value: 32,
      Selected: true
    }],
    Type: FilterType.Multi
  };
}
