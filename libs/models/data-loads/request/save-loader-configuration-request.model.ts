import { ConfigurationGroup, LoaderSetting } from 'libs/models';

export interface SaveLoaderConfigRequest {
  ConfigurationGroup: ConfigurationGroup;
  LoaderSettings: LoaderSetting[];
}
