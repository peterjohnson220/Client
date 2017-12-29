import { Feature, FeatureTypes, TileTypes } from '../models';
import { UserTileDto } from '../../../../../../libs/models';
import { TileMapper } from './tile.mapper';

export class FeatureMapper {

  static MapUserTileDtoToFeature(userTileDto: UserTileDto): Feature {
    const featureType = this.MapTileNameToFeatureType(userTileDto.TileName);
    const tileType = this.MapFeatureTypeToTileType(featureType);
    const tile = tileType === TileTypes.Unknown ? null : TileMapper.mapUserTileDtoToTile(userTileDto);

    return {
      Type: featureType,
      TileType: tileType,
      Tile: tile,
      HasAccess: userTileDto.Enabled,
      Url: userTileDto.Url
    };
  }

  static MapTileNameToFeatureType(label: string): FeatureTypes {
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

  static MapFeatureTypeToTileType(featureType: FeatureTypes): TileTypes {
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
