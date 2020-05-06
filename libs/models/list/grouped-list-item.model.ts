export interface GroupedListItem {
  Name: string;
  Level: string;
  Value: any;
  Children?: GroupedListItem[];
  IgnoreValue?: boolean;
}

export interface ListItemSearchResult {
  IsMatch: boolean;
  IsParentMatch: boolean;
  Value: string;
}

export function autoGenerateListGroupValues(list: GroupedListItem[], parentIdx = null): GroupedListItem[] {
  if (!list || list.length === 0) {
    return list;
  }
  let idx = 0;
  list.forEach(item => {
    if (item.Value === null) {
      item.Value = parentIdx === null ? idx.toString() : parentIdx + '_' + idx;
      item.IgnoreValue = true;
    }
    if (item.Children && item.Children.length) {
      autoGenerateListGroupValues(item.Children, idx);
    }
    idx++;
  });
  return list;
}
