import { FilterType, MultiSelectFilter, SearchFilterMappingDataObj } from 'libs/features/search/search/models';

export class SurveySearchFiltersHelper {

 static buildLockedCountryCodeFilter(countryCode: string, mappingData: SearchFilterMappingDataObj): MultiSelectFilter {
    const countryCodeData = mappingData['country_codes'];

    return {
      Id: 'countrycodes',
      BackingField: countryCodeData.BackingField,
      DisplayName: countryCodeData.DisplayName,
      Order: countryCodeData.Order,
      Type: FilterType.Multi,
      Options: [{
        Name: countryCode,
        Value: countryCode,
        Selected: true
      }],
      RefreshOptionsFromServer: false,
      Locked: true,
      DefaultSelections: [],
      SaveDisabled: true
    };
  }

}

