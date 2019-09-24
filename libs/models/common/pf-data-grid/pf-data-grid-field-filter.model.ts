export enum DataViewType {
  Bit,
  DateTime,
  Int,
  Float,
  String,
  Binary,
  Unknown
}

export class PfGridColumnFilter {
  EntitySourceName: string;
  SourceName: string;
  Operator: string;
  Value: string;
  Values: string[];
  DataViewType: DataViewType;
}
