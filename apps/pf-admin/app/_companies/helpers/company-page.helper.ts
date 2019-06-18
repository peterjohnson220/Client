import { CompanyFormData, CompanySetting, CompanySettingsEnum } from 'libs/models/company';
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
      OrgDataAutoloaderApiKey: null,
      GroupName: null
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
        case TileNames.Service:
        case TileNames.Resources:
        case TileNames.Ideas:
        case TileNames.NewCommunity: {
          t.Checked = true;
          t.Disabled = false;
          return t;
        }
        case TileNames.Peer: {
          t.Checked = true;
          t.Disabled = true;
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
        case CompanySettingsEnum.PeerTermsAndConditionsRequested: {
          s.Value = 'true';
          s.Disabled = true;
          return s;
        }
        case CompanySettingsEnum.PeerTermsAndConditionsAccepted: {
          s.Value = 'false';
          s.Disabled = false;
          return s;
        }
        default: {
          s.Value = 'false';
          s.Disabled = true;
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
        case TileNames.Peer:
        case TileNames.NewCommunity: {
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
}
