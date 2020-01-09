import { Feature, FeatureTypes } from '../models';
import { UserFeatureDto } from 'libs/models/dashboard';

export class UserFeatureDtoToFeatureMapper {
  static mapToFeature(userFeatureDto: UserFeatureDto): Feature {
    const featureType = UserFeatureDtoToFeatureMapper.mapTileNameToFeatureType(userFeatureDto.Name);

    return {
      Name: userFeatureDto.Name,
      Url: userFeatureDto.Url,
      Type: featureType
    };
  }

  static mapTileNameToFeatureType(label: string): FeatureTypes {
    switch (label) {
      case 'Activity':
        return FeatureTypes.Activity;
      case 'Community':
        return FeatureTypes.Community;
      case 'New Community':
          return FeatureTypes.NewCommunity;
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
      case 'Total Rewards':
        return FeatureTypes.TotalRewards;
      default:
        return FeatureTypes.Unknown;
    }
  }
}
