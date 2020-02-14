import { LoadTypes } from '../../constants';

export interface ConfigurationGroup {
    LoaderConfigurationGroupId: number;
    GroupName: string;
    CompanyId: number;
    LoadType: string;
}

export function generateMockConfigurationGroup(): ConfigurationGroup {
  return {
    CompanyId: 1,
    GroupName: 'TestGroup',
    LoaderConfigurationGroupId: 1,
    LoadType: LoadTypes.Sftp
  };
}

