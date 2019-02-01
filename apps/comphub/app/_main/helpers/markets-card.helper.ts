import { AddPayMarketRequest } from 'libs/models/payfactors-api';
import { UiPersistenceFeatureSettingsModel, FeatureAreaConstants, UiPersistenceSettingConstants } from 'libs/models/common';

import { MarketDataScope, AddPayMarketFormData } from '../models';

export class MarketsCardHelper {
  static buildAddPayMarketRequest(companyId: number, data: AddPayMarketFormData): AddPayMarketRequest {
    return {
      DefaultExchangeScopes: [],
      DefaultScopes: [],
      PayMarket: {
        CompanyPayMarketId: 0,
        CompanyId: companyId,
        CountryCode: data.Country,
        CurrencyCode: data.Currency,
        GeoLabel: 'CityState',
        GeoValue: data.Location,
        IndustryLabel: 'Industry',
        IndustryValue: data.Industry,
        PayMarket: data.Name,
        SizeLabel: 'Employees',
        SizeValue: data.Size,
        LinkedPayMarket: ''
      }
    };
  }

  static buildDefaultMarketDataScope(): MarketDataScope {
    return {
      Locations: [{ Name: 'National', Value: 'National'}],
      Sizes: [{ Name: 'All', Value: 'All' }],
      Industries: [{ Name: 'All', Value: 'All'}]
    };
  }

  static getDismissInfoBannerSetting(userSettings: UiPersistenceFeatureSettingsModel[]): boolean {
    let result = false;
    if (!!userSettings) {
      const comphubSettings = userSettings.find(s => s.FeatureName === FeatureAreaConstants.CompHub);
      if (!!comphubSettings && !!comphubSettings.Settings) {
        const infoBannerDismissSetting = comphubSettings.Settings
          .find(s => s.Key === UiPersistenceSettingConstants.CompHubAddPayMarketFormDismissInfoBanner);
        result = !!infoBannerDismissSetting ? (infoBannerDismissSetting.Value === 'true') : false;
      }
    }
    return result;
  }
}
