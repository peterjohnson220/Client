import { FeatureTypes } from './feature-types';

export class FeatureType {
  AllTypes: FeatureTypes[] = [];

  Activity: FeatureTypes.Activity;
  Community: FeatureTypes.Community;
  DataInsights: FeatureTypes.DataInsights;
  Employees: FeatureTypes.Employees;
  JobDescriptions: FeatureTypes.JobDescriptions;
  MyJobs: FeatureTypes.MyJobs;
  PayMarkets: FeatureTypes.PayMarkets;
  PricingProjects: FeatureTypes.PricingProjects;
  Resources: FeatureTypes.Resources;
  Service: FeatureTypes.Service;
  Structures: FeatureTypes.Structures;
  Surveys: FeatureTypes.Surveys;

  constructor() {
    this.AllTypes = [
      FeatureTypes.Activity,
      FeatureTypes.Community,
      FeatureTypes.DataInsights,
      FeatureTypes.Employees,
      FeatureTypes.JobDescriptions,
      FeatureTypes.MyJobs,
      FeatureTypes.PayMarkets,
      FeatureTypes.PricingProjects,
      FeatureTypes.Resources,
      FeatureTypes.Service,
      FeatureTypes.Structures,
      FeatureTypes.Surveys
    ];
  }
}
