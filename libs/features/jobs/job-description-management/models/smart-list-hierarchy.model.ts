export class SmartListHierarchy {
  BulletType: number;
  BulletValue: string;
  Items: SmartListItem[];
}

export enum BulletType {
  OrderedNumeric = 1,
  OrderedAlpha,
  Unordered
}

export interface SmartListItem {
  Data: string;
  Children: SmartListHierarchy;
}
