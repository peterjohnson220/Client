import { FieldMappingsDTO, LoaderSetting, LoaderSettingsDTO, MappingModel } from 'libs/models/data-loads/index';
import { SftpUserModel } from 'libs/models/Sftp';

export interface OrgDataLoaderConfigurationSaveRequest {
  LoaderSettings: LoaderSetting[];
  LoaderFieldMappings: MappingModel[];
  SftpUser: SftpUserModel;
  LoaderConfigurationGroupId: number;
  CompanyId: number;
  LoadType: string;
}
