import { GroupedListItem } from 'libs/models/list';
import { DefaultUserPayMarket } from 'libs/models/paymarket';
import { MDLocationsRequest } from 'libs/models/payfactors-api';

import { Scope } from '../models';

export class GeneralFormHelper {
  static buildAllItem(): GroupedListItem {
    return {
      Name: 'All',
      Value: 'All:All',
      Level: null,
      Children: []
    };
  }

  static buildAllScopeLocation(): Scope {
    return {
      Label: 'Location',
      Value: 'All'
    };
  }

  static buildDefaultLocation(defaultPayMarket: DefaultUserPayMarket): GroupedListItem {
    if (!defaultPayMarket.GeoLabel || !defaultPayMarket.GeoValue) {
      return this.buildAllItem();
    }
    switch (defaultPayMarket.GeoLabel) {
      case 'Region': {
        return {
          Name: defaultPayMarket.Region,
          Value: `Region:${defaultPayMarket.Region}`
        };
      }
      case 'State': {
        return {
          Name: defaultPayMarket.State,
          Value: `State:${defaultPayMarket.Region}:${defaultPayMarket.State}`
        };
      }
      case 'Metro': {
        return {
          Name: defaultPayMarket.Metro,
          Value: `Metro:${defaultPayMarket.Region}:${defaultPayMarket.State}:${defaultPayMarket.Metro}`
        };
      }
      case 'City': {
        return {
          Name: defaultPayMarket.City,
          Value: `Metro:${defaultPayMarket.Region}:${defaultPayMarket.State}:${defaultPayMarket.Metro}:${defaultPayMarket.City}`
        };
      }
      default: {
        return this.buildAllItem();
      }
    }
  }

  static buildScopeLocation(locationValue: string): Scope {
    if (!locationValue || !locationValue.length) {
      return this.buildAllScopeLocation();
    }
    const parsedLocationValues = locationValue.split(':');
    if (parsedLocationValues.length === 0) {
      return this.buildAllScopeLocation();
    }
    const geoLabel = parsedLocationValues[0];
    switch (geoLabel) {
      case 'Region': {
        return {
          Label: 'Region',
          Value: parsedLocationValues.length === 2 ? parsedLocationValues[1] : 'All'
        };
      }
      case 'State': {
        return {
          Label: 'State',
          Value: parsedLocationValues.length === 3 ? parsedLocationValues[2] : 'All'
        };
      }
      case 'Metro': {
        return {
          Label: 'Metro',
          Value: parsedLocationValues.length === 4 ? parsedLocationValues[3] : 'All'
        };
      }
      case 'City': {
        return {
          Label: 'City',
          Value: parsedLocationValues.length === 5 ? parsedLocationValues[4] : 'All'
        };
      }
      default: {
        return this.buildAllScopeLocation();
      }
    }
  }

  static buildRegionsRequest(countryCode: string): MDLocationsRequest {
    return {
      CountryCode: countryCode,
      Query: ''
    };
  }

  static buildLocationRequest(countryCode: string, location: string): MDLocationsRequest {
    if (!countryCode || !countryCode.length) {
      return null;
    }
    if (!location || !location.length) {
      return this.buildRegionsRequest(countryCode);
    }
    const parsedValues = location.split(':');
    if (parsedValues.length < 1) {
      return this.buildRegionsRequest(countryCode);
    }
    const geoLabel = parsedValues[0];
    return {
      CountryCode: countryCode,
      Query: '',
      GeoLabel: geoLabel,
      Region: parsedValues.length > 1 ? parsedValues[1] : null,
      State: parsedValues.length > 2 ? parsedValues[2] : null,
      Metro: parsedValues.length > 3 ? parsedValues[3] : null,
    };
  }

  static updateLocations(locations: GroupedListItem[], expandedKey: string, children: GroupedListItem[]): GroupedListItem[] {
    if (!expandedKey || !expandedKey.length || !children || !children.length) {
      return locations;
    }
    return locations.map(location => this.updateLocationChildren(location, expandedKey, children));
  }

  static updateLocationChildren(location: GroupedListItem, expandedKey: string, children: GroupedListItem[]): GroupedListItem {
    if (location.Value === expandedKey) {
      location.Children = children;
      return location;
    }
    if (!!location.Children) {
      location.Children = location.Children.map(child => this.updateLocationChildren(child, expandedKey, children));
    }
    return location;
  }
}
