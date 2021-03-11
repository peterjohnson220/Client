import cloneDeep from 'lodash/cloneDeep';

import { ConverterSettings } from 'libs/models';

import { ValueMapping } from '../models';


export class ConverterSettingsHelper {
 static addOrUpdateConvertSettings(converterSettings: ConverterSettings[], setting: ConverterSettings): ConverterSettings[] {
    const newConverterSettings = cloneDeep(converterSettings);
    const exisitngSettingIndex = newConverterSettings.findIndex(s =>
      s.fieldName === setting.fieldName &&
      s.connection_ID === setting.connection_ID &&
      s.entityType.toLowerCase() === setting.entityType.toLowerCase() &&
      s.dataType === setting.dataType
    );

    if (exisitngSettingIndex >= 0) {
      newConverterSettings[exisitngSettingIndex].options = setting.options;
    } else {
      newConverterSettings.push(setting);
    }

    return newConverterSettings;
  }

  static mapConvertedFields(fieldName: string, selectedConverterSetting: ConverterSettings): ValueMapping[] {
    let mappingValues: ValueMapping[];

    switch (fieldName) {
      case 'Rate':
        mappingValues = selectedConverterSetting ?
          cloneDeep(selectedConverterSetting.options.MappingValues) :
          [
            {
              PayfactorsName: 'Annual',
              ClientValues: []
            },
            {
              PayfactorsName: 'Hourly',
              ClientValues: []
            }
          ];
        break;
      case 'Employee_Status':
        mappingValues = selectedConverterSetting ?
          cloneDeep(selectedConverterSetting.options.MappingValues) :
          [
            {
              PayfactorsName: 'Active',
              ClientValues: []
            },
            {
              PayfactorsName: 'Inactive',
              ClientValues: []
            }
          ];
        break;
      default:
        mappingValues = null;
    }

    return mappingValues;
  }
}
