import { LoaderSetting } from '../loader-setting.model';

export class LoaderSettingsDTO {
  companyId: number;
  settings: LoaderSetting[];
  loaderConfigurationGroupId?: number;
}
