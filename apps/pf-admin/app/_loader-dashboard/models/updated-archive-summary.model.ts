export class FieldMappingDiff {
  DbField: string;
  RecordedClientField: string;
  CurrentClientField: string;
}

export class LoaderSettingDiff {
  LoaderSetting: string;
  RecordedValue: string;
  CurrentValue: string;
}

export class UpdatedArchiveSummaryModel {
  CompositeDataLoadId?: number;
  CompanyId?: number;
  CompanyName?: string;
  DetectedFiles?: string[];
  UpdatedFiles?: string[];
  RecordedConfigurationGroupId?: number;
  DetectedConfigurationGroupId?: number;
  FieldMappingsDiffs?: Map<string, FieldMappingDiff[]>;
  LoaderSettingsDiffs?: LoaderSettingDiff[];
  IsRedropCapable?: boolean;
  ArchiveName?: string;
}
