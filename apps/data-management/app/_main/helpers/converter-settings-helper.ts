import cloneDeep from 'lodash/cloneDeep';

import { ConverterSettings } from 'libs/models';


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
}
