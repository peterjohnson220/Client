import { ConfigurationGroup, LoaderSetting, LoaderSettingKeyName, SaveLoaderConfigRequest } from 'libs/models';
import { LoaderFileFormat } from 'libs/features/loaders/org-data-loader/constants';

export class SurveyLoaderSettingsHelper {
  static generateFileUploadSettings(): LoaderSetting[] {
    return [
      { KeyName: LoaderSettingKeyName.SurveyJobsSheetName, LoaderSettingsId: 0, KeyValue: null },
      { KeyName: LoaderSettingKeyName.SurveyDataSheetName, LoaderSettingsId: 0, KeyValue: null },
      { KeyName: LoaderSettingKeyName.SurveyParticipantsSheetName, LoaderSettingsId: 0, KeyValue: null },
      { KeyName: LoaderSettingKeyName.ValidateOnly, LoaderSettingsId: 0, KeyValue: 'true' },
      { KeyName: LoaderSettingKeyName.FileFormat, LoaderSettingsId: 0, KeyValue: LoaderFileFormat.XLSX }
    ];
  }


  // OUT
  static buildSaveConfigRequest(
    configGroup: ConfigurationGroup,
    fileUploadSettings: LoaderSetting[]): SaveLoaderConfigRequest {
    const filteredfFileUploadSettings: LoaderSetting[] = fileUploadSettings.filter(x => !!x.KeyValue);
    return {
      ConfigurationGroup: configGroup,
      LoaderSettings: filteredfFileUploadSettings
    };
  }

}
