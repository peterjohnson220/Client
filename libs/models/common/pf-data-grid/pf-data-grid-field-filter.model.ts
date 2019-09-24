export enum DataViewType {
  Bit,
  DateTime,
  Int,
  Float,
  String,
  Binary,
  Unknown
}

export class PfGridFieldFilter {
  EntitySourceName: string;
  SourceName: string;
  Operator: string;
  Value: string;
  Values: string[];
  DataViewType: DataViewType;
}
