export interface SearchFilter {
  Name: string;
  Options: SearchFilterOption[];
}

export interface SearchFilterOption {
  Name: string;
  Value: any;
  Count?: number;
}


export function generateMockSearchFilter(): SearchFilter {
  return {
    Name: 'i_am_a_filter_from_the_server',
    Options: [generateMockSearchFilterOption()]
  };
}

function generateMockSearchFilterOption(): SearchFilterOption {
  return {
    Name: 'Option 1',
    Value: 'Towers Watson',
    Count: 25
  };
}
