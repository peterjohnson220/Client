export interface SearchFilter {
  Name: string;
  Options: SearchFilterOption[];
}

export interface SearchFilterOption {
  Name: string;
  Value: any;
  Count?: number;
}
