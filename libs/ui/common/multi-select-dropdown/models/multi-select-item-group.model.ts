export interface MultiSelectItemGroup {
  GroupIndex: number;
  GroupName?: string;
  Title: string;
  Items: MultiSelectItem[];
}

export interface MultiSelectItem {
  IsSelected: boolean;
  Value: string;
  Name: string;
}
