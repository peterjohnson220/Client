import isObject from 'lodash/isObject';

import { LoaderSetting } from 'libs/models/data-loads';

import { LoaderFileFormat, LoaderSettingsKeys } from '../constants/';

export interface ILoadSettings {
  isActive: boolean;
  isCompanyOnAutoloader: boolean;
  delimiter: string;
  dateFormat: string;
  isEmployeesLoadEnabled: boolean;
  isJobsLoadEnabled: boolean;
  isPaymarketsLoadEnabled: boolean;
  isStructuresLoadEnabled: boolean;
  isStructureMappingsLoadEnabled: boolean;
  isSubsidiariesLoadEnabled: boolean;
  isEmployeesFullReplace: boolean;
  isStructureMappingsFullReplace: boolean;
  isBenefitsLoadEnabled: boolean;
  isBenefitsFullReplace: boolean;
  fileFormat: string;
  validateOnly: boolean;
}
export class LoaderSettings implements ILoadSettings {
  isActive: boolean;
  isCompanyOnAutoloader: boolean;
  delimiter: string;
  dateFormat: string;
  isEmployeesLoadEnabled: boolean;
  isJobsLoadEnabled: boolean;
  isPaymarketsLoadEnabled: boolean;
  isStructuresLoadEnabled: boolean;
  isStructureMappingsLoadEnabled: boolean;
  isEmployeesFullReplace: boolean;
  isStructureMappingsFullReplace: boolean;
  isSubsidiariesLoadEnabled: boolean;
  isBenefitsLoadEnabled: boolean;
  isBenefitsFullReplace: boolean;
  fileFormat: string;
  validateOnly: boolean;
}

export class OrgDataLoadHelper {

  private static getLoaderSettingValueIfSet<T>(loaderSetting: LoaderSetting[], keyName: string, defaultValue: T, transform: (value: string) => T) {
    const setting = loaderSetting.find(x => x.KeyName === keyName);
    return setting ? transform(setting.KeyValue) : defaultValue;
  }

  static booleanSettingToStringTransform = (value: boolean) => value ? 'true' : 'false';
  static stringSettingToBooleanTransform = (value: string) => /^true$/i.test(value);
  static noopStringTransform = (value: string) => value;

  static parseSettingResponse(response: LoaderSetting[]): LoaderSettings {

    const loadSettings = new LoaderSettings;

    loadSettings.isActive = this.getLoaderSettingValueIfSet<boolean>(
      response,
      LoaderSettingsKeys.IsActive,
      true,
      this.stringSettingToBooleanTransform,
    );
    loadSettings.isCompanyOnAutoloader = this.getLoaderSettingValueIfSet<boolean>(
      response,
      LoaderSettingsKeys.IsActive,
      false,
      this.stringSettingToBooleanTransform
    );
    loadSettings.delimiter = this.getLoaderSettingValueIfSet<string>(response, LoaderSettingsKeys.Delimiter, null, this.noopStringTransform);
    loadSettings.dateFormat = this.getLoaderSettingValueIfSet<string>(response, LoaderSettingsKeys.DateFormat, null, this.noopStringTransform);
    loadSettings.isEmployeesLoadEnabled = this.getLoaderSettingValueIfSet<boolean>(response,
      LoaderSettingsKeys.IsEmployeesLoadEnabled,
      false,
      this.stringSettingToBooleanTransform
    );
    loadSettings.isJobsLoadEnabled = this.getLoaderSettingValueIfSet<boolean>(response,
      LoaderSettingsKeys.IsJobsLoadEnabled,
      false,
      this.stringSettingToBooleanTransform
    );
    loadSettings.isPaymarketsLoadEnabled = this.getLoaderSettingValueIfSet<boolean>(response,
      LoaderSettingsKeys.IsPaymarketsLoadEnabled,
      false,
      this.stringSettingToBooleanTransform
    );
    loadSettings.isStructuresLoadEnabled = this.getLoaderSettingValueIfSet<boolean>(response,
      LoaderSettingsKeys.IsStructuresLoadEnabled,
      false,
      this.stringSettingToBooleanTransform
    );
    loadSettings.isStructureMappingsLoadEnabled = this.getLoaderSettingValueIfSet<boolean>(response,
      LoaderSettingsKeys.IsStructureMappingsLoadEnabled,
      false,
      this.stringSettingToBooleanTransform
    );
    loadSettings.isEmployeesFullReplace = this.getLoaderSettingValueIfSet<boolean>(response,
      LoaderSettingsKeys.IsEmployeesFullReplace,
      true,
      this.stringSettingToBooleanTransform
    );
    loadSettings.isStructureMappingsFullReplace = this.getLoaderSettingValueIfSet<boolean>(response,
      LoaderSettingsKeys.IsStructureMappingsFullReplace,
      true,
      this.stringSettingToBooleanTransform
    );
    loadSettings.fileFormat = this.getLoaderSettingValueIfSet<string>(
      response,
      LoaderSettingsKeys.FileFormat,
      LoaderFileFormat.CSV,
      this.noopStringTransform
    );
    loadSettings.validateOnly = this.getLoaderSettingValueIfSet<boolean>(
      response,
      LoaderSettingsKeys.ValidateOnly,
      false,
      this.stringSettingToBooleanTransform
    );
    loadSettings.isSubsidiariesLoadEnabled = this.getLoaderSettingValueIfSet<boolean>(
      response,
      LoaderSettingsKeys.IsSubsidiariesLoadEnabled,
      true,
      this.stringSettingToBooleanTransform
    );
    loadSettings.isBenefitsLoadEnabled = this.getLoaderSettingValueIfSet<boolean>(
      response,
      LoaderSettingsKeys.IsBenefitsLoadEnabled,
      true,
      this.stringSettingToBooleanTransform
    );
    loadSettings.isBenefitsFullReplace = this.getLoaderSettingValueIfSet<boolean>(response,
      LoaderSettingsKeys.IsBenefitsFullReplace,
      true,
      this.stringSettingToBooleanTransform
    );

    return loadSettings;
  }

  static getLoaderSettingsToSave(newLoaderSettings: LoaderSettings, existingLoaderSettings: LoaderSetting[]) {
    return [
      this.getSettingIfChanged(
        LoaderSettingsKeys.IsActive,
        this.booleanSettingToStringTransform(newLoaderSettings.isActive),
        existingLoaderSettings
      ),
      this.getSettingIfChanged(LoaderSettingsKeys.Delimiter, newLoaderSettings.delimiter, existingLoaderSettings),
      this.getSettingIfChanged(LoaderSettingsKeys.DateFormat, newLoaderSettings.dateFormat, existingLoaderSettings),
      this.getSettingIfChanged(
        LoaderSettingsKeys.IsEmployeesLoadEnabled,
        this.booleanSettingToStringTransform(newLoaderSettings.isEmployeesLoadEnabled),
        existingLoaderSettings
      ),
      this.getSettingIfChanged(
        LoaderSettingsKeys.IsJobsLoadEnabled,
        this.booleanSettingToStringTransform(newLoaderSettings.isJobsLoadEnabled),
        existingLoaderSettings
      ),
      this.getSettingIfChanged(
        LoaderSettingsKeys.IsPaymarketsLoadEnabled,
        this.booleanSettingToStringTransform(newLoaderSettings.isPaymarketsLoadEnabled),
        existingLoaderSettings
      ),
      this.getSettingIfChanged(
        LoaderSettingsKeys.IsStructuresLoadEnabled,
        this.booleanSettingToStringTransform(newLoaderSettings.isStructuresLoadEnabled),
        existingLoaderSettings
      ),
      this.getSettingIfChanged(
        LoaderSettingsKeys.IsStructureMappingsLoadEnabled,
        this.booleanSettingToStringTransform(newLoaderSettings.isStructureMappingsLoadEnabled),
        existingLoaderSettings
      ),
      this.getSettingIfChanged(
        LoaderSettingsKeys.IsEmployeesFullReplace,
        this.booleanSettingToStringTransform(newLoaderSettings.isEmployeesFullReplace),
        existingLoaderSettings
      ),
      this.getSettingIfChanged(
        LoaderSettingsKeys.IsStructureMappingsFullReplace,
        this.booleanSettingToStringTransform(newLoaderSettings.isStructureMappingsFullReplace),
        existingLoaderSettings
      ),
      this.getSettingIfChanged(
        LoaderSettingsKeys.FileFormat,
        newLoaderSettings.fileFormat,
        existingLoaderSettings
      ),
      this.getSettingIfChanged(
        LoaderSettingsKeys.ValidateOnly,
        this.booleanSettingToStringTransform(newLoaderSettings.validateOnly),
        existingLoaderSettings
      ),
      this.getSettingIfChanged(
        LoaderSettingsKeys.IsSubsidiariesLoadEnabled,
        this.booleanSettingToStringTransform(newLoaderSettings.isSubsidiariesLoadEnabled),
        existingLoaderSettings
      ),
      this.getSettingIfChanged(
        LoaderSettingsKeys.IsBenefitsLoadEnabled,
        this.booleanSettingToStringTransform(newLoaderSettings.isBenefitsLoadEnabled),
        existingLoaderSettings
      ),
      this.getSettingIfChanged(
        LoaderSettingsKeys.IsBenefitsFullReplace,
        this.booleanSettingToStringTransform(newLoaderSettings.isBenefitsFullReplace),
        existingLoaderSettings
      ),
    ].filter(setting => isObject(setting));
  }

  private static getSettingIfChanged(keyName: string, keyValue: string, existingLoaderSettings: LoaderSetting[]) {
    const existingSettingValue = existingLoaderSettings.find(setting => setting.KeyName === keyName);

    if (
      (!existingSettingValue && keyValue) ||
      (existingSettingValue && keyValue !== existingSettingValue.KeyValue)
    ) {
      return this.getSettingToSave(keyName, keyValue);
    }
  }

  private static getSettingToSave(keyName: string, keyValue: string) {
    return <LoaderSetting>{
      LoaderSettingsId: undefined,
      KeyName: keyName,
      KeyValue: keyValue
    };
  }
}
