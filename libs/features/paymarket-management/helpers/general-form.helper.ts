import { GroupedListItem } from 'libs/models/list';
import { PayMarketWithMdScope } from 'libs/models/paymarket';
import { MDLocationsRequest } from 'libs/models/payfactors-api';

import { Scope, ScopeLabel } from '../models';

export class GeneralFormHelper {
  static buildAllItem(label: string): GroupedListItem {
    return {
      Name: 'All',
      Value: label === ScopeLabel.Industry ? 'Industry:All:All' : `${label}:All`,
      Level: null,
      Children: []
    };
  }

  static buildAllScope(label: string): Scope {
    return {
      Label: label,
      Value: 'All'
    };
  }

  static buildDefaultLocation(payMarket: PayMarketWithMdScope): GroupedListItem {
    if (!payMarket.GeoLabel || !payMarket.GeoValue || payMarket.GeoValue === 'All') {
      return this.buildAllItem(ScopeLabel.Location);
    }
    switch (payMarket.GeoLabel) {
      case 'Region': {
        return {
          Name: payMarket.Region,
          Value: `Region:${payMarket.Region}`
        };
      }
      case 'State': {
        return {
          Name: payMarket.State,
          Value: `State:${payMarket.Region}:${payMarket.State}`
        };
      }
      case 'Metro': {
        return {
          Name: payMarket.Metro,
          Value: `Metro:${payMarket.Region}:${payMarket.State}:${payMarket.Metro}`
        };
      }
      case 'City': {
        return {
          Name: payMarket.City,
          Value: `City:${payMarket.Region}:${payMarket.State}:${payMarket.Metro}:${payMarket.City}`
        };
      }
      default: {
        return this.buildAllItem(ScopeLabel.Location);
      }
    }
  }

  static buildScopeLocation(locationValue: string): Scope {
    if (!locationValue || !locationValue.length) {
      return this.buildAllScope('Location');
    }
    const parsedLocationValues = locationValue.split(':');
    if (parsedLocationValues.length === 0) {
      return this.buildAllScope('Location');
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
        return this.buildAllScope('Location');
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
