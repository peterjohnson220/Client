import { ConfigurationGroup, LoaderSetting } from 'libs/models';

export interface SavePricingLoaderConfigRequest {
  ConfigurationGroup: ConfigurationGroup;
  LoaderSettings: LoaderSetting[];
}
