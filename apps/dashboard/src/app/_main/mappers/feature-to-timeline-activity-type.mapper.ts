import { Feature, FeatureTypes } from '../models';

export class FeatureToTimelineActivityTypeMapper {
  static mapToStringArray(features: Feature[]): string[] {
    const timelineActivityTypesAsStrings = [];
    for (const feature of features) {
      const typeAsString = FeatureToTimelineActivityTypeMapper.mapToString(feature);
      if (typeAsString !== null) {
        timelineActivityTypesAsStrings.push(typeAsString);
      }
    }
    return timelineActivityTypesAsStrings;
  }

  static mapToString(feature: Feature): string {
    switch (feature.Type) {
      case FeatureTypes.Activity: {
        return 'ActivityPost';
      }
      case FeatureTypes.Community: {
        return 'CommunityPost';
      }
      case FeatureTypes.Resources: {
        return 'ResourcesPost';
      }
      case FeatureTypes.JobDescriptions: {
        return 'JobDescriptionsPost';
      }
      default: {
        return null;
      }
    }
  }

}
