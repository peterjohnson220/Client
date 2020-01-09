import { TileTypes } from './tile-types';

export class TileType {
  AllTypes: TileTypes[] = [];

  DataInsights = TileTypes.DataInsights;
  Employees = TileTypes.Employees;
  JobDescriptions = TileTypes.JobDescriptions;
  MyJobs = TileTypes.MyJobs;
  PayMarkets = TileTypes.PayMarkets;
  Peer = TileTypes.Peer;
  PricingProjects = TileTypes.PricingProjects;
  Resources = TileTypes.Resources;
  Service = TileTypes.Service;
  Structures = TileTypes.Structures;
  Surveys = TileTypes.Surveys;
  DataDiagnostics = TileTypes.DataDiagnostics;
  Community = TileTypes.Community;
  NewCommunity = TileTypes.NewCommunity;
  QuickPrice = TileTypes.QuickPrice;
  Ideas = TileTypes.Ideas;
  TotalRewards = TileTypes.TotalRewards;

  constructor() {
    this.AllTypes = [
      TileTypes.DataInsights,
      TileTypes.Employees,
      TileTypes.JobDescriptions,
      TileTypes.MyJobs,
      TileTypes.PayMarkets,
      TileTypes.Peer,
      TileTypes.PricingProjects,
      TileTypes.Resources,
      TileTypes.Service,
      TileTypes.Structures,
      TileTypes.Surveys,
      TileTypes.DataDiagnostics,
      TileTypes.Community,
      TileTypes.NewCommunity,
      TileTypes.QuickPrice,
      TileTypes.Ideas,
      TileTypes.TotalRewards
    ];
  }
}
