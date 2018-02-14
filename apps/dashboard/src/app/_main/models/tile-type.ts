import { TileTypes } from './tile-types';

export class TileType {
  AllTypes: TileTypes[] = [];

  DataInsights = TileTypes.DataInsights;
  Employees = TileTypes.Employees;
  JobDescriptions = TileTypes.JobDescriptions;
  MyJobs = TileTypes.MyJobs;
  PayMarkets = TileTypes.PayMarkets;
  PricingProjects = TileTypes.PricingProjects;
  Resources = TileTypes.Resources;
  Service = TileTypes.Service;
  Structures = TileTypes.Structures;
  Surveys = TileTypes.Surveys;

  constructor() {
    this.AllTypes = [
      TileTypes.DataInsights,
      TileTypes.Employees,
      TileTypes.JobDescriptions,
      TileTypes.MyJobs,
      TileTypes.PayMarkets,
      TileTypes.PricingProjects,
      TileTypes.Resources,
      TileTypes.Service,
      TileTypes.Structures,
      TileTypes.Surveys
    ];
  }
}
