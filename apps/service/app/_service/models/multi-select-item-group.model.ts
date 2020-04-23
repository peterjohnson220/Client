export interface MultiSelectItemGroup {
  GroupIndex: number;
  Title: string;
  Items: MultiSelectItem[];
}

export interface MultiSelectItem {
  IsSelected: boolean;
  Value: string;
}
