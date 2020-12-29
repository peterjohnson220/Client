import { NotesBase } from '../../../notes';

export interface PricingInfo {
  PricingID: number;
  Status: string;
  EnablePricingReview: boolean;
  IsThisMostRecent: boolean;
  DefaultFields: PricingInfoDefaultField[];
  DistinctCategories: string[];
  PricingDetails: PricingDetails;
  Matches: PricingMatches[];
  Notes: PricingNote[];
}

export interface PricingInfoDefaultField {
  Category: string;
  DisplayName: string;
  FieldName: string;
}

export interface PricingNote extends NotesBase {
  CompanyJobPricingNoteId:  number;
  CompanyJobPricingId:  number;
  CompanyJobId:  number;
  CompanyId:  number;
  CompanyPayMarketId:  number;
}

export interface PricedPayMarkets {
  Id: number;
  Name: string;
  Rate: string;
  Currency: string;
  StartDate: Date;
  EndDate: Date;
  IsDefault: boolean;
}

export interface PricingHistoryChartFilters {
  PayMarkets: PricedPayMarkets[];
  Currency: string;
  Rate: string;
  StartDate: Date;
  EndDate: Date;
}

export interface PricingDetails {
  FirstName: string;
  LastName: string;
  JobTitle: string;
  JobCode: string;
  PayMarket: string;
  Scope: string;
  Job_Description: string;
  CompanyJobPricingId: number;
  CompanyJob_Id: number;
  CompanyId: number;
  CompanyPayMarketId: number;
  EffectiveDate: Date;
  AgingFactor: number;
  Rate: string;
  Currency: string;
  JobFamily: string;
  BaseReferencePoint: number;
  TCCReferencePoint: number;
  CompositeAdjustment: number;
  BaseAvg: number;
  Base10: number;
  Base25: number;
  Base50: number;
  Base75: number;
  Base90: number;
  BaseMRP: number;
  TCCAvg: number;
  TCC10: number;
  TCC25: number;
  TCC50: number;
  TCC75: number;
  TCC90: number;
  TCCMRP: number;
  CreateDate: Date;
  CreateUser: number;
  PublishingUserJobListTempId: number;
  TCCTargetAvg: number;
  TCCTarget25: number;
  TCCTarget50: number;
  TCCTarget75: number;
  BonusAvg: number;
  Bonus25: number;
  Bonus50: number;
  Bonus75: number;
  BonusTargetAvg: number;
  BonusTarget25: number;
  BonusTarget50: number;
  BonusTarget75: number;
  BonusTargetPctAvg: number;
  BonusTargetPct25: number;
  BonusTargetPct50: number;
  BonusTargetPct75: number;
  LTIPAvg: number;
  LTIP25: number;
  LTIP50: number;
  LTIP75: number;
  TDCAvg: number;
  TDC25: number;
  TDC50: number;
  TDC75: number;
  StructureMin: number;
  StructureMid: number;
  StructureMax: number;
  Base60: number;
  FixedAvg: number;
  Fixed10: number;
  Fixed25: number;
  Fixed50: number;
  Fixed60: number;
  Fixed75: number;
  Fixed90: number;
  TGPAvg: number;
  TGP10: number;
  TGP25: number;
  TGP50: number;
  TGP60: number;
  TGP75: number;
  TGP90: number;
  Bonus10: number;
  Bonus60: number;
  Bonus90: number;
  BonusTarget10: number;
  BonusTarget60: number;
  BonusTarget90: number;
  BonusTargetPct10: number;
  BonusTargetPct60: number;
  BonusTargetPct90: number;
  TCC60: number;
  TCCTarget10: number;
  TCCTarget60: number;
  TCCTarget90: number;
  LTIP10: number;
  LTIP60: number;
  LTIP90: number;
  TargetLTIPAvg: number;
  TargetLTIP10: number;
  TargetLTIP25: number;
  TargetLTIP50: number;
  TargetLTIP60: number;
  TargetLTIP75: number;
  TargetLTIP90: number;
  TDC10: number;
  TDC60: number;
  TDC90: number;
  TargetTDCAvg: number;
  TargetTDC10: number;
  TargetTDC25: number;
  TargetTDC50: number;
  TargetTDC60: number;
  TargetTDC75: number;
  TargetTDC90: number;
  RemunAvg: number;
  Remun10: number;
  Remun25: number;
  Remun50: number;
  Remun60: number;
  Remun75: number;
  Remun90: number;
  AllowAvg: number;
  Allow10: number;
  Allow25: number;
  Allow50: number;
  Allow60: number;
  Allow75: number;
  Allow90: number;
  BonusReferencePoint: number;
  TCCTargetReferencePoint: number;
  BonusMRP: number;
  TCCTargetMRP: number;
  CalcBackedinBase: number;
  LastCalculated: Date;
  LinkedCompanyJobPricingId: number;
  BonusPctAvg: number;
  BonusPct10: number;
  BonusPct25: number;
  BonusPct50: number;
  BonusPctMRP: number;
  BonusPct60: number;
  BonusPct75: number;
  BonusPct90: number;
  BonusTargetMRP: number;
  BonusTargetPctMRP: number;
  LTIPMRP: number;
  TDCMRP: number;
  TargetLTIPMRP: number;
  TargetTDCMRP: number;
  AllowMRP: number;
  FixedMRP: number;
  RemunMRP: number;
  TGPMRP: number;
  LTIPReferencePoint: number;
  TDCReferencePoint: number;
  AllowReferencePoint: number;
  FixedReferencePoint: number;
  RemunReferencePoint: number;
  TGPReferencePoint: number;
  BonusPctReferencePoint: number;
  BonusTargetReferencePoint: number;
  BonusTargetPctReferencePoint: number;
  TargetLTIPReferencePoint: number;
  TargetTDCReferencePoint: number;
  Status: string;
  EditUser: number;
  EditDate: Date;
  SalesIncentiveTargetAvg: number;
  SalesIncentiveTarget25: number;
  SalesIncentiveTarget50: number;
  SalesIncentiveTarget75: number;
  SalesIncentiveActualAvg: number;
  SalesIncentiveActual25: number;
  SalesIncentiveActual50: number;
  SalesIncentiveActual75: number;
  SalesIncentiveTargetMRP: number;
  SalesIncentiveTargetReferencePoint: number;
  SalesIncentiveActualMRP: number;
  SalesIncentiveActualReferencePoint: number;
  Base65: number;
  TCC65: number;
  Bonus65: number;
  BonusTarget65: number;
  BonusTargetPct65: number;
  BonusPct65: number;
  LTIP65: number;
  TDC65: number;
  Fixed65: number;
  TCCTarget65: number;
  TargetTDC65: number;
  LTIPPct10: number;
  LTIPPct25: number;
  LTIPPct50: number;
  LTIPPct60: number;
  LTIPPct65: number;
  LTIPPct75: number;
  LTIPPct90: number;
  LTIPPctAvg: number;
  LTIPPctMRP: number;
  LTIPPctReferencePoint: number;
  SalesIncentiveTargetPct25: number;
  SalesIncentiveTargetPct50: number;
  SalesIncentiveTargetPct75: number;
  SalesIncentiveTargetPctAvg: number;
  SalesIncentiveTargetPctMRP: number;
  SalesIncentiveTargetPctReferencePoint: number;
  SalesIncentiveActualPct25: number;
  SalesIncentiveActualPct50: number;
  SalesIncentiveActualPct75: number;
  SalesIncentiveActualPctAvg: number;
  SalesIncentiveActualPctMRP: number;
  SalesIncentiveActualPctReferencePoint: number;
  SalesQuotaTarget50: number;
  SalesQuotaTargetAvg: number;
  TCCTargetPlusAllowNoCar10: number;
  TCCTargetPlusAllowNoCar25: number;
  TCCTargetPlusAllowNoCar50: number;
  TCCTargetPlusAllowNoCar60: number;
  TCCTargetPlusAllowNoCar65: number;
  TCCTargetPlusAllowNoCar75: number;
  TCCTargetPlusAllowNoCar90: number;
  TCCTargetPlusAllowNoCarAvg: number;
  TCCTargetPlusAllowNoCarMRP: number;
  TCCTargetPlusAllowNoCarReferencePoint: number;
  TCCTargetPlusAllow10: number;
  TCCTargetPlusAllow25: number;
  TCCTargetPlusAllow50: number;
  TCCTargetPlusAllow60: number;
  TCCTargetPlusAllow65: number;
  TCCTargetPlusAllow75: number;
  TCCTargetPlusAllow90: number;
  TCCTargetPlusAllowAvg: number;
  TCCTargetPlusAllowMRP: number;
  TCCTargetPlusAllowReferencePoint: number;
  TCCPlusAllowNoCar10: number;
  TCCPlusAllowNoCar25: number;
  TCCPlusAllowNoCar50: number;
  TCCPlusAllowNoCar60: number;
  TCCPlusAllowNoCar65: number;
  TCCPlusAllowNoCar75: number;
  TCCPlusAllowNoCar90: number;
  TCCPlusAllowNoCarAvg: number;
  TCCPlusAllowNoCarMRP: number;
  TCCPlusAllowNoCarReferencePoint: number;
  TCCPlusAllow10: number;
  TCCPlusAllow25: number;
  TCCPlusAllow50: number;
  TCCPlusAllow60: number;
  TCCPlusAllow65: number;
  TCCPlusAllow75: number;
  TCCPlusAllow90: number;
  TCCPlusAllowAvg: number;
  TCCPlusAllowMRP: number;
  TCCPlusAllowReferencePoint: number;
  AllowHouse50: number;
  AllowHouseAvg: number;
  AllowTrans50: number;
  AllowTransAvg: number;
  AllowOther50: number;
  AllowOtherAvg: number;
  AllowCar50: number;
  AllowCarAvg: number;
  NewHireBonus50: number;
  NewHireBonusAvg: number;
  NewHireBonusPct50: number;
  NewHireBonusPctAvg: number;
  LTINewHireStockValue50: number;
  LTINewHireStockValueAvg: number;
  IsLatest: boolean;
}

export interface PricingMatches {
  CompanyJobPricingMatchId: number;
  CompanyJobPricingId: number;
  CompanyId: number;
  CompanyJobId: number;
  CompanyPayMarketId: number;
  MatchAdjustment: number;
  MatchWeight: number;
  MDJobCode: string;
  MDCompanyPayMarketId: number;
  SurveyDataId: number;
  CreateDate: Date;
  CreateUser: number;
  BaseAvg: number;
  Base10: number;
  Base25: number;
  Base50: number;
  Base75: number;
  Base90: number;
  BaseMRP: number;
  TCCAvg: number;
  TCC10: number;
  TCC25: number;
  TCC50: number;
  TCC75: number;
  TCC90: number;
  TCCMRP: number;
  TCCTargetAvg: number;
  TCCTarget25: number;
  TCCTarget50: number;
  TCCTarget75: number;
  BonusAvg: number;
  Bonus25: number;
  Bonus50: number;
  Bonus75: number;
  BonusTargetAvg: number;
  BonusTarget25: number;
  BonusTarget50: number;
  BonusTarget75: number;
  BonusTargetPctAvg: number;
  BonusTargetPct25: number;
  BonusTargetPct50: number;
  BonusTargetPct75: number;
  LTIPAvg: number;
  LTIP25: number;
  LTIP50: number;
  LTIP75: number;
  TDCAvg: number;
  TDC25: number;
  TDC50: number;
  TDC75: number;
  StructureMin: number;
  StructureMid: number;
  StructureMax: number;
  Base60: number;
  FixedAvg: number;
  Fixed10: number;
  Fixed25: number;
  Fixed50: number;
  Fixed60: number;
  Fixed75: number;
  Fixed90: number;
  TGPAvg: number;
  TGP10: number;
  TGP25: number;
  TGP50: number;
  TGP60: number;
  TGP75: number;
  TGP90: number;
  Bonus10: number;
  Bonus60: number;
  Bonus90: number;
  BonusTarget10: number;
  BonusTarget60: number;
  BonusTarget90: number;
  BonusTargetPct10: number;
  BonusTargetPct60: number;
  BonusTargetPct90: number;
  TCC60: number;
  TCCTarget10: number;
  TCCTarget60: number;
  TCCTarget90: number;
  LTIP10: number;
  LTIP60: number;
  LTIP90: number;
  TargetLTIPAvg: number;
  TargetLTIP10: number;
  TargetLTIP25: number;
  TargetLTIP50: number;
  TargetLTIP60: number;
  TargetLTIP75: number;
  TargetLTIP90: number;
  TDC10: number;
  TDC60: number;
  TDC90: number;
  TargetTDCAvg: number;
  TargetTDC10: number;
  TargetTDC25: number;
  TargetTDC50: number;
  TargetTDC60: number;
  TargetTDC75: number;
  TargetTDC90: number;
  RemunAvg: number;
  Remun10: number;
  Remun25: number;
  Remun50: number;
  Remun60: number;
  Remun75: number;
  Remun90: number;
  AllowAvg: number;
  Allow10: number;
  Allow25: number;
  Allow50: number;
  Allow60: number;
  Allow75: number;
  Allow90: number;
  WeightingType: number;
  BonusMRP: number;
  TCCTargetMRP: number;
  CalcBackedinBase: number;
  AgingFactor: number;
  SlottedCompanyJobId: number;
  BonusPctAvg: number;
  BonusPct10: number;
  BonusPct25: number;
  BonusPct50: number;
  BonusPct60: number;
  BonusPct75: number;
  BonusPct90: number;
  LTIPMRP: number;
  TDCMRP: number;
  AllowMRP: number;
  FixedMRP: number;
  RemunMRP: number;
  TGPMRP: number;
  BonusPctMRP: number;
  BonusTargetMRP: number;
  BonusTargetPctMRP: number;
  TargetLTIPMRP: number;
  TargetTDCMRP: number;
  PeerGroupJobCode: string;
  CrowdSourcedJobCode: string;
  CommunitySurveyId: number;
  OriginalSurveyDataId: number;
  HasBeenRolled: boolean;
  Source: string;
  SurveyPublisher: string;
  SurveyName: string;
  JobTitle: string;
  JobCode: string;
  CompositeAdjustment: number;
  Scope: string;
  JobDescription: string;
  SalesIncentiveTarget25: number;
  SalesIncentiveTarget50: number;
  SalesIncentiveTargetMRP: number;
  SalesIncentiveTarget75: number;
  SalesIncentiveTargetAvg: number;
  SalesIncentiveActual25: number;
  SalesIncentiveActual50: number;
  SalesIncentiveActualMRP: number;
  SalesIncentiveActual75: number;
  SalesIncentiveActualAvg: number;
  EEsEligSalesIncentivePct: number;
  SalesIncentiveTargetPct25: number;
  SalesIncentiveTargetPct50: number;
  SalesIncentiveTargetPctMRP: number;
  SalesIncentiveTargetPct75: number;
  SalesIncentiveTargetPctAvg: number;
  SalesIncentiveActualPct25: number;
  SalesIncentiveActualPct50: number;
  SalesIncentiveActualPctMRP: number;
  SalesIncentiveActualPct75: number;
  SalesIncentiveActualPctAvg: number;
  SalesQuotaTarget50: number;
  SalesQuotaTargetAvg: number;
  TCCPlusAllowNoCarAvg: number;
  TCCPlusAllowNoCar10: number;
  TCCPlusAllowNoCar25: number;
  TCCPlusAllowNoCar50: number;
  TCCPlusAllowNoCarMRP: number;
  TCCPlusAllowNoCar60: number;
  TCCPlusAllowNoCar65: number;
  TCCPlusAllowNoCar75: number;
  TCCPlusAllowNoCar90: number;
  TCCPlusAllowAvg: number;
  TCCPlusAllow10: number;
  TCCPlusAllow25: number;
  TCCPlusAllow50: number;
  TCCPlusAllowMRP: number;
  TCCPlusAllow60: number;
  TCCPlusAllow65: number;
  TCCPlusAllow75: number;
  TCCPlusAllow90: number;
  TCCTargetPlusAllowNoCarAvg: number;
  TCCTargetPlusAllowNoCar10: number;
  TCCTargetPlusAllowNoCar25: number;
  TCCTargetPlusAllowNoCar50: number;
  TCCTargetPlusAllowNoCarMRP: number;
  TCCTargetPlusAllowNoCar60: number;
  TCCTargetPlusAllowNoCar65: number;
  TCCTargetPlusAllowNoCar75: number;
  TCCTargetPlusAllowNoCar90: number;
  TCCTargetPlusAllowAvg: number;
  TCCTargetPlusAllow10: number;
  TCCTargetPlusAllow25: number;
  TCCTargetPlusAllow50: number;
  TCCTargetPlusAllowMRP: number;
  TCCTargetPlusAllow60: number;
  TCCTargetPlusAllow65: number;
  TCCTargetPlusAllow75: number;
  TCCTargetPlusAllow90: number;
  EEsRecCashLTIPct: number;
  EEsEligAllowPct: number;
  AllowHouse50: number;
  AllowHouseAvg: number;
  AllowTrans50: number;
  AllowTransAvg: number;
  EEsEligAllowOtherPct: number;
  AllowOther50: number;
  AllowOtherAvg: number;
  EEsEligAllowCarOrCarPct: number;
  EEsEligCarOnlyPct: number;
  EEsEligAllowCarOnlyPct: number;
  AllowCar50: number;
  AllowCarAvg: number;
  EEsRecNewHireBonusPct: number;
  NewHireBonus50: number;
  NewHireBonusAvg: number;
  NewHireBonusPct50: number;
  NewHireBonusPctAvg: number;
  EEsEligNewHireCashLTIPct: number;
  EEsRecNewHireCashLTIPct: number;
  LTINewHireStockValue50: number;
  LTINewHireStockValueAvg: number;
  LTIPPctMRP: number;
  Base65: number;
  TCC65: number;
  Bonus65: number;
  BonusTarget65: number;
  BonusTargetPct65: number;
  BonusPct65: number;
  LTIP65: number;
  TDC65: number;
  Fixed65: number;
  TCCTarget65: number;
  TargetTDC65: number;
  LTIPPct10: number;
  LTIPPct25: number;
  LTIPPct50: number;
  LTIPPct60: number;
  LTIPPct65: number;
  LTIPPct75: number;
  LTIPPct90: number;
  LTIPPctAvg: number;
  OrgRevenueAvg: number;
  OrgRevenue50: number;
  BonusTargetMix: string;
  BonusMix: string;
  PayoutRatio: number;
  ExchangeJobId: number;
  ExchangeDataCutId: number;
  JobType: number;
  FilterGUID: string;
  ToolTipId: any;
}
