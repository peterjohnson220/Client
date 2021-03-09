export class FieldMappingDiffResponse {
  DbField: string;
  RecordedClientField: string;
  CurrentClientField: string;
}

export class LoaderSettingDiffResponse {
  LoaderSetting: string;
  RecordedValue: string;
  CurrentValue: string;
}

export class UpdatedArchiveSummaryResponse {
  CompositeDataLoadId?: number;
  CompanyId?: number;
  CompanyName?: string;
  DetectedFiles?: string[];
  UpdatedFiles?: string[];
  RecordedConfigurationGroupId?: number;
  DetectedConfigurationGroupId?: number;
  FieldMappingsDiffs?: object;
  LoaderSettingsDiffs?: LoaderSettingDiffResponse[];
  IsRedropCapable?: boolean;
  ArchiveName?: string;
}
