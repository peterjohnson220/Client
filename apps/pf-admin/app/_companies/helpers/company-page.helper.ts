import { CompanyFormData, CompanySetting, CompanySettingsEnum, CompanyDto } from 'libs/models/company';
import { CompanySettingsSaveRequest } from 'libs/models/payfactors-api/settings';
import { CompanyTilesResponse } from 'libs/models/payfactors-api';
import { TileNames } from 'libs/constants';

import { CustomCompanySettings } from '../models';

export class CompanyPageHelper {
  static buildAddNewCompanyFormData(systemUserGroupsId: number): CompanyFormData {
    return {
      CompanyId: -1,
      CompanyName: '',
      CompanyNameShort: '',
      Status: 'Active',
      PrimarySupportUserId: null,
      JDMSeniorAssociateUserId: null,
      SystemUserGroupsId: systemUserGroupsId,
      ClientType: '',
      Industry: '',
      FTEs: null,
      Assets: null,
      Revenue: null,
      EnablePricingReview: false,
      CompanyLogo: '',
      CustomerSuccessMgrUserId: null,
      ParticipateInPeerDataExchange: true,
      EnableLibraryForRoutedJobDescriptions: true,
      EnableEmployeeAcknowledgement: false,
      EnableWorkflowEmployeeResults: false,
      RestrictWorkflowToCompanyEmployeesOnly: false,
      CustomFieldName: '',
      CustomFieldValue: '',
      HideSecondarySurveyDataFields: true,
      EnableLiveChat: false,
      EnableIntervalAgingFactor: false,
      PasswordLengthRequirement: 8,
      GroupName: null,
      CompanyColor: null
    };
  }

  static buildEditCompanyFormData(company: CompanyDto): CompanyFormData {
    return {
      CompanyId: company.CompanyId,
      CompanyName: company.CompanyName,
      CompanyNameShort: company.CompanyNameShort,
      Status: company.Status,
      PrimarySupportUserId: !!company.PrimarySupportUserId ? company.PrimarySupportUserId.toString() : '',
      JDMSeniorAssociateUserId: !!company.JDMSeniorAssociateUserId ? company.JDMSeniorAssociateUserId.toString() : '',
      SystemUserGroupsId: company.SystemUserGroupsId,
      ClientType: company.ClientType,
      Industry: company.Industry,
      FTEs: !!company.FTEs ? company.FTEs.toString() : '',
      Assets: !!company.Assets ? company.Assets.toString() : '',
      Revenue: !!company.Revenue ? company.Revenue.toString() : '',
      CompanyLogo: company.CompanyLogo,
      CustomerSuccessMgrUserId: !!company.CustomerSuccessMgrUserId ? company.CustomerSuccessMgrUserId.toString() : '',
      CustomFieldName: company.CustomFieldName,
      CustomFieldValue: company.CustomFieldValue,
      PasswordLengthRequirement: company.PasswordLengthRequirement,
      GroupName: company.GroupName,
      EnablePricingReview: company.EnablePricingReview,
      ParticipateInPeerDataExchange: company.ParticipateInPeerDataExchange,
      EnableLibraryForRoutedJobDescriptions: company.EnableLibraryForRoutedJobDescriptions,
      EnableEmployeeAcknowledgement: company.EnableEmployeeAcknowledgement,
      EnableWorkflowEmployeeResults: company.EnableWorkflowEmployeeResults,
      RestrictWorkflowToCompanyEmployeesOnly: company.RestrictWorkflowToCompanyEmployeesOnly,
      HideSecondarySurveyDataFields: company.HideSecondarySurveyDataFields,
      EnableLiveChat: company.EnableLiveChat,
      EnableIntervalAgingFactor: company.EnableIntervalAgingFactor,
      CompanyColor: company.CompanyColor
    };
  }

  static buildCompanySettingsSaveRequest(companyId: number, settings: CompanySetting[]): CompanySettingsSaveRequest {
    return {
      CompanyId: companyId,
      Settings: settings.map(s => ({ Name: s.Key.toString(), Value: s.Value }))
    };
  }

  static buildDefaultCustomCompanySettings(): CustomCompanySettings {
    return {
      EnablePricingReview: false,
      ParticipateInPeerDataExchange: true,
      EnableLibraryForRoutedJobDescriptions: true,
      EnableEmployeeAcknowledgement: false,
      EnableWorkflowEmployeeResults: false,
      RestrictWorkflowToCompanyEmployeesOnly: false,
      HideSecondarySurveyDataFields: true,
      EnableLiveChat: false,
      EnableIntervalAgingFactor: false,
    };
  }

  static buildCustomCompanySettings(company: CompanyDto): CustomCompanySettings {
    return {
      EnablePricingReview: company.EnablePricingReview,
      ParticipateInPeerDataExchange: company.ParticipateInPeerDataExchange,
      EnableLibraryForRoutedJobDescriptions: company.EnableLibraryForRoutedJobDescriptions,
      EnableEmployeeAcknowledgement: company.EnableEmployeeAcknowledgement,
      EnableWorkflowEmployeeResults: company.EnableWorkflowEmployeeResults,
      RestrictWorkflowToCompanyEmployeesOnly: company.RestrictWorkflowToCompanyEmployeesOnly,
      HideSecondarySurveyDataFields: company.HideSecondarySurveyDataFields,
      EnableLiveChat: company.EnableLiveChat,
      EnableIntervalAgingFactor: company.EnableIntervalAgingFactor
    };
  }

  static getNonPeerClientTypeCompanyTiles(tiles: CompanyTilesResponse[]): CompanyTilesResponse[] {
    return tiles.map(t => {
      if (t.TileName === TileNames.Peer) {
        t.Checked = false;
        t.Disabled = true;
      }
      return t;
    });
  }

  static getPeerClientTypeCompanyTiles(tiles: CompanyTilesResponse[]): CompanyTilesResponse[] {
    return tiles.map(t => {
      switch (t.TileName) {
        case TileNames.NewProject:
        case TileNames.PricingProjects:
        case TileNames.PayMarkets:
        case TileNames.Jobs:
        case TileNames.Service:
        case TileNames.Activity:
        case TileNames.Resources:
        case TileNames.Ideas:
        case TileNames.Employees:
        case TileNames.NewCommunity:
        case TileNames.Peer:
        case TileNames.CompanyAdmin: {
          t.Checked = true;
          t.Disabled = false;
          return t;
        }
        default: {
          t.Checked = false;
          t.Disabled = true;
          return t;
        }
      }
    });
  }

  static getPeerClientTypeCompanySettings(settings: CompanySetting[]): CompanySetting[] {
    return settings.map(s => {
      switch (s.Key) {
        case CompanySettingsEnum.PeerTermsAndConditionsAccepted: {
          s.Value = 'true';
          s.Disabled = true;
          return s;
        }
        case CompanySettingsEnum.PeerTermsAndConditionsRequested:
        case CompanySettingsEnum.PeerTermsAndConditionsHardCopyRequested: {
          s.Value = 'false';
          s.Disabled = true;
          return s;
        }
        default: {
          s.Value = 'false';
          s.Disabled = false;
          return s;
        }
      }
    });
  }

  static getPeerAndAnalysisClientTypeCompanyTiles(tiles: CompanyTilesResponse[]): CompanyTilesResponse[] {
    return tiles.map(t => {
      switch (t.TileName) {
        case TileNames.NewProject:
        case TileNames.PricingProjects:
        case TileNames.PayMarkets:
        case TileNames.Jobs:
        case TileNames.Service:
        case TileNames.Activity:
        case TileNames.Resources:
        case TileNames.Ideas:
        case TileNames.Employees:
        case TileNames.NewCommunity:
        case TileNames.Peer:
        case TileNames.CompanyAdmin: {
          t.Checked = true;
          t.Disabled = false;
          return t;
        }
        default: {
          t.Checked = false;
          t.Disabled = true;
          return t;
        }
      }
    });
  }

  static getPeerAndAnalysisClientTypeCompanySettings(settings: CompanySetting[]): CompanySetting[] {
    return settings.map(s => {
      switch (s.Key) {
        case CompanySettingsEnum.PeerTermsAndConditionsAccepted: {
          s.Value = 'true';
          s.Disabled = true;
          return s;
        }
        case CompanySettingsEnum.PeerTermsAndConditionsRequested:
        case CompanySettingsEnum.PeerTermsAndConditionsHardCopyRequested: {
          s.Value = 'false';
          s.Disabled = true;
          return s;
        }
        default: {
          s.Value = 'false';
          s.Disabled = false;
          return s;
        }
      }
    });
  }

  static modifyPeerTCRequestSettingDisabled(settings: CompanySetting[], peerTermsAndCondAccepted: boolean): CompanySetting[] {
    // Disable Peer T&C request settings
    if (peerTermsAndCondAccepted) {
      settings = settings.map((s) => {
        if (s.Key === CompanySettingsEnum.PeerTermsAndConditionsRequested ||
          s.Key === CompanySettingsEnum.PeerTermsAndConditionsHardCopyRequested) {
          s.Disabled = true;
        }
        return s;
      });
    }

    return settings;
  }

  static modifyPeerTCRequestSettingValue(selectedSetting: CompanySetting, settings: CompanySetting[]): CompanySetting[] {
    if (selectedSetting.Key === CompanySettingsEnum.PeerTermsAndConditionsRequested) {
      settings = settings.map((s) => {
        if (s.Key === CompanySettingsEnum.PeerTermsAndConditionsHardCopyRequested) {
          s.Value = 'false';
        }
        return s;
      });
    } else if (selectedSetting.Key === CompanySettingsEnum.PeerTermsAndConditionsHardCopyRequested) {
      settings = settings.map((s) => {
        if (s.Key === CompanySettingsEnum.PeerTermsAndConditionsRequested) {
          s.Value = 'false';
        }
        return s;
      });
    }
    return settings;
  }
}
