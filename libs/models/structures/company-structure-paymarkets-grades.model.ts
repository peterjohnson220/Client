export interface CompanyStructureInfo {
  StructureName: string;
  PayMarket: string;
  GradeName: string;
  CompanyPayMarketId: number;
  CompanyStructuresId: number;
  CompanyStructuresGradesId: number;
  CompanyStructuresRangeGroupId: number;
}

export interface CompanyStructurePaymarketGrade {
  CompanyStructuresId: number;
  CompanyPayMarketId: number;
  PayMarket: string;
  CompanyStructuresGradesId: number;
  GradeName: string;
}

export interface SimplePaymarket {
  CompanyPayMarketId: number;
  PayMarket: string;
}

export interface SimpleGrade {
  CompanyStructuresGradesId: number;
  GradeName: string;
}
