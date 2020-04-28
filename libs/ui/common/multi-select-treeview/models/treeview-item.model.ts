export interface TreeViewItem {
  Name: string;
  Level: number;
  Value: any;
  Children?: TreeViewItem[];
}
