export enum TileTypes {
  Unknown = 'Unknown',
  DataInsights = 'DataInsights',
  Employees = 'Employees',
  JobDescriptions = 'JobDescriptions',
  MyJobs = 'MyJobs',
  PayMarkets = 'PayMarkets',
  Peer = 'Peer',
  PricingProjects = 'PricingProjects',
  Resources = 'Resources',
  Service = 'Service',
  Structures = 'Structures',
  Surveys = 'Surveys',
  DataDiagnostics = 'DataDiagnostics',
  Community = 'Community',
  NewCommunity = 'NewCommunity',
  Ideas = 'Ideas',
  QuickPrice = 'QuickPrice',
  TotalRewards = 'TotalRewards',
  DataManagement = 'DataManagement',
  InternationalData = 'InternationalData',
  WhatIsNew = 'WhatIsNew',
  PayEquity = 'PayEquity',
  MeritPlanning = 'MeritPlanning'
}

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
  DataManagement = TileTypes.DataManagement;
  InternationalData = TileTypes.InternationalData;
  WhatIsNew = TileTypes.WhatIsNew;
  PayEquity = TileTypes.PayEquity;
  MeritPlanning = TileTypes.MeritPlanning;

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
      TileTypes.TotalRewards,
      TileTypes.DataManagement,
      TileTypes.InternationalData,
      TileTypes.WhatIsNew,
      TileTypes.PayEquity,
      TileTypes.MeritPlanning
    ];
  }
}
