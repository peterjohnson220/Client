import { GenericKeyValue } from './generic-key-value.model';

export interface UiPersistenceFeatureSettingsModel {
  FeatureName: string;
  Settings: GenericKeyValue<string, string>[];
}
