import { Feature, FeatureTypes, TileTypes } from '../models';
import { UserTileDto } from 'libs/models';

export class UserTileDtoToFeatureMapper {
  static mapToFeature(userTileDto: UserTileDto): Feature {
    const featureType = UserTileDtoToFeatureMapper.mapTileNameToFeatureType(userTileDto.TileName);
    const tileType = UserTileDtoToFeatureMapper.mapFeatureTypeToTileType(featureType);

    return {
      Type: featureType,
      TileType: tileType,
      HasAccess: userTileDto.Enabled,
      Url: userTileDto.Url
    };
  }

  static mapTileNameToFeatureType(label: string): FeatureTypes {
    switch (label) {
      case 'Activity':
        return FeatureTypes.Activity;
      case 'Community':
        return FeatureTypes.Community;
      case 'Employees':
        return FeatureTypes.Employees;
      case 'Data Insights':
        return FeatureTypes.DataInsights;
      case 'Job Descriptions':
        return FeatureTypes.JobDescriptions;
      case 'Jobs':
        return FeatureTypes.MyJobs;
      case 'Pay Markets':
        return FeatureTypes.PayMarkets;
      case 'Pricing Projects':
        return FeatureTypes.PricingProjects;
      case 'Resources':
        return FeatureTypes.Resources;
      case 'Service':
        return FeatureTypes.Service;
      case 'Structures':
        return FeatureTypes.Structures;
      case 'Surveys':
        return FeatureTypes.Surveys;
      default:
        return FeatureTypes.Unknown;
    }
  }

  static mapFeatureTypeToTileType(featureType: FeatureTypes): TileTypes {
    switch (featureType) {
      case FeatureTypes.Employees:
        return TileTypes.Employees;

      case FeatureTypes.DataInsights:
        return TileTypes.DataInsights;

      case FeatureTypes.JobDescriptions:
        return TileTypes.JobDescriptions;

      case FeatureTypes.MyJobs:
        return TileTypes.MyJobs;

      case FeatureTypes.PayMarkets:
        return TileTypes.PayMarkets;

      case FeatureTypes.PricingProjects:
        return TileTypes.PricingProjects;

      case FeatureTypes.Resources:
        return TileTypes.Resources;

      case FeatureTypes.Service:
        return TileTypes.Service;

      case FeatureTypes.Structures:
        return TileTypes.Structures;

      case FeatureTypes.Surveys:
        return TileTypes.Surveys;

      default:
        return TileTypes.Unknown;
    }
  }
}
