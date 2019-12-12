import { LoaderSetting } from 'libs/models/data-loads';

import { LoaderSettingsKeys } from '../constants/';

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
    isEmployeesFullReplace: boolean;
    isStructureMappingsFullReplace: boolean;

}
class LoaderSettings implements ILoadSettings {
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
            this.stringSettingToBooleanTransform,
        );
        loadSettings.isJobsLoadEnabled = this.getLoaderSettingValueIfSet<boolean>(response,
            LoaderSettingsKeys.IsJobsLoadEnabled,
            false,
            this.stringSettingToBooleanTransform,
        );
        loadSettings.isPaymarketsLoadEnabled = this.getLoaderSettingValueIfSet<boolean>(response,
            LoaderSettingsKeys.IsPaymarketsLoadEnabled,
            false,
            this.stringSettingToBooleanTransform,
        );
        loadSettings.isStructuresLoadEnabled = this.getLoaderSettingValueIfSet<boolean>(response,
            LoaderSettingsKeys.IsStructuresLoadEnabled,
            false,
            this.stringSettingToBooleanTransform,
        );
        loadSettings.isStructureMappingsLoadEnabled = this.getLoaderSettingValueIfSet<boolean>(response,
            LoaderSettingsKeys.IsStructureMappingsLoadEnabled,
            false,
            this.stringSettingToBooleanTransform,
        );
        loadSettings.isEmployeesFullReplace = this.getLoaderSettingValueIfSet<boolean>(response,
            LoaderSettingsKeys.IsEmployeesFullReplace,
            true,
            this.stringSettingToBooleanTransform,
        );
        loadSettings.isStructureMappingsFullReplace = this.getLoaderSettingValueIfSet<boolean>(response,
            LoaderSettingsKeys.IsStructureMappingsFullReplace,
            true,
            this.stringSettingToBooleanTransform,
        );

        return loadSettings;
    }
}
