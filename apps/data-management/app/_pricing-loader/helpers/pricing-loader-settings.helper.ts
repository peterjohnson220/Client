import { LoaderSetting, LoaderSettingKeyName, ConfigurationGroup, SavePricingLoaderConfigRequest } from 'libs/models';

import { PricingLoaderSetting, MRPFieldConfig } from '../models';

export class PricingLoaderSettingsHelper {
  static generateFileUploadSettings(): LoaderSetting[] {
    return [
      { KeyName: LoaderSettingKeyName.PricingsSheetName, LoaderSettingsId: 0, KeyValue: null },
      { KeyName: LoaderSettingKeyName.PricingNotesSheetName, LoaderSettingsId: 0, KeyValue: null },
      { KeyName: LoaderSettingKeyName.ValidateOnly, LoaderSettingsId: 0, KeyValue: null }
    ];
  }

  static generateDefaultSettings(): PricingLoaderSetting[] {
    return [
      this.generateDefaultMRPField(LoaderSettingKeyName.PricingsBaseMRP, 'Base', 'Group1'),
      this.generateDefaultMRPField(LoaderSettingKeyName.PricingsTCCMRP, 'TCC', 'Group1'),
      this.generateDefaultMRPField(LoaderSettingKeyName.PricingsBonusMRP, 'Bonus', 'Group1'),
      this.generateDefaultMRPField(LoaderSettingKeyName.PricingsTCCTargetMRP, 'TCC Target', 'Group1'),
      this.generateDefaultMRPField(LoaderSettingKeyName.PricingsLTIPMRP, 'LTIP', 'Group1'),
      this.generateDefaultMRPField(LoaderSettingKeyName.PricingsTDCMRP, 'TDC', 'Group1'),
      this.generateDefaultMRPField(LoaderSettingKeyName.PricingsAllowMRP, 'Allow', 'Group1'),
      this.generateDefaultMRPField(LoaderSettingKeyName.PricingsFixedMRP, 'Fixed', 'Group1'),
      this.generateDefaultMRPField(LoaderSettingKeyName.PricingsRenumMRP, 'Renum', 'Group2'),
      this.generateDefaultMRPField(LoaderSettingKeyName.PricingsTGPMRP, 'TGP', 'Group2'),
      this.generateDefaultMRPField(LoaderSettingKeyName.PricingsBonusPctMRP, 'Bonus %', 'Group2'),
      this.generateDefaultMRPField(LoaderSettingKeyName.PricingsBonusTargetMRP, 'Bonus Target', 'Group2'),
      this.generateDefaultMRPField(LoaderSettingKeyName.PricingsBonusTargetPctMRP, 'Bonus Target %', 'Group2'),
      this.generateDefaultMRPField(LoaderSettingKeyName.PricingsTargetLTIPMRP, 'Target LTIP', 'Group2'),
      this.generateDefaultMRPField(LoaderSettingKeyName.PricingsTargetTDCMRP, 'Target TDC', 'Group2'),
      this.generateDefaultMRPField(LoaderSettingKeyName.PricingsSalesIncentiveTargetMRP, 'Sales Incentive Target', 'Group2'),
      this.generateDefaultMRPField(LoaderSettingKeyName.PricingsSalesIncentiveActualMRP, 'Sales Incentive Actual', 'Group3'),
      this.generateDefaultMRPField(LoaderSettingKeyName.PricingsLTIPPctMRP, 'LTIP %', 'Group3'),
      this.generateDefaultMRPField(LoaderSettingKeyName.PricingsSalesIncentiveTargetPctMRP, 'Sales Incentive Target %', 'Group3'),
      this.generateDefaultMRPField(LoaderSettingKeyName.PricingsSalesIncentiveActualPctMRP, 'Sales Incentive Actual %', 'Group3'),
      this.generateDefaultMRPField(LoaderSettingKeyName.PricingsTCCTargetPlusAllowNoCarMRP, 'TCC Target Plus Allow No Car', 'Group3'),
      this.generateDefaultMRPField(LoaderSettingKeyName.PricingsTCCTargetPlusAllowMRP, 'TCC Target Plus Allow', 'Group3'),
      this.generateDefaultMRPField(LoaderSettingKeyName.PricingsTCCPlusAllowNoCarMRP, 'TCC Plus Allow No Car', 'Group3'),
      this.generateDefaultMRPField(LoaderSettingKeyName.PricingsTCCPlusAllowMRP, 'TCC Plus Allow', 'Group3'),
      { KeyName: LoaderSettingKeyName.PricingsMatchWeight, GroupName: 'Adjustments', DisplayName: 'Match Weight',
        LoaderSettingsId: null, KeyValue: '1',
        Min: 0, Max: 100, NumericValue: 1, DefaultValue: 1, Decimals: 2, GroupColumnSize: 100 },
      { KeyName: LoaderSettingKeyName.PricingsCompositeAdj, GroupName: 'Adjustments', DisplayName: 'Composite Adj',
        LoaderSettingsId: null, KeyValue: '0',
        Min: -100, Max: 100, NumericValue: 0, DefaultValue: 0, Decimals: 2, GroupColumnSize: 100 }
    ];
  }

  static generateDefaultMRPField(keyName: LoaderSettingKeyName, displayName: string, groupName: string): PricingLoaderSetting {
    return {
      KeyName: keyName, GroupName: groupName, DisplayName: displayName, LoaderSettingsId: null, KeyValue: '50',
      Min: MRPFieldConfig.Min, Max: MRPFieldConfig.Max,
      NumericValue: MRPFieldConfig.DefaultValue, DefaultValue: MRPFieldConfig.DefaultValue,
      Decimals: MRPFieldConfig.Decimals, GroupColumnSize: this.getGroupColumnSize(groupName)
    };
  }

  static getGroupColumnSize(groupName: string): number {
    switch (groupName) {
      case 'Group1': {
        return 100;
      }
      case 'Group2': {
        return 140;
      }
      case 'Group3': {
        return 180;
      }
      default: {
        return 100;
      }
    }
  }


  // OUT
  static buildSaveConfigRequest(
    configGroup: ConfigurationGroup,
    fileUploadSettings: LoaderSetting[],
    defaultSettings: PricingLoaderSetting[]): SavePricingLoaderConfigRequest {
    const filteredfFileUploadSettings: LoaderSetting[] = fileUploadSettings.filter(x => !!x.KeyValue);
    const mappedLoaderSettings: LoaderSetting[] = this.mapPricingLoaderSettingsToLoaderSettings(defaultSettings);
    return {
      ConfigurationGroup: configGroup,
      LoaderSettings: mappedLoaderSettings.concat(filteredfFileUploadSettings)
    };
  }

  static mapPricingLoaderSettingsToLoaderSettings(pricingLoaderSettings: PricingLoaderSetting[]): LoaderSetting[] {
    return pricingLoaderSettings.map(s => {
      return {
        KeyName: s.KeyName,
        KeyValue: s.KeyValue,
        LoaderSettingsId: s.LoaderSettingsId
      };
    });
  }
}
