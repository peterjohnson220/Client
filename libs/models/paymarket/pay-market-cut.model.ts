export interface PayMarketMDCutModel {
  CompanyPayMarketId: number;
  CompanyId: number;
  IndustryLabel: string;
  IndustryValue: string;
  SizeLabel: string;
  SizeValue: string;
  GeoLabel: string;
  GeoValue: string;
  Weight: number;
  Adjustment: number;
  CreateDate: Date;
  CreateUser: number;
  DisplayOrder: number;
}

export interface PayMarketCut extends PayMarketMDCutModel {
  Scope: string;
}

export class PayMarketCutHelper {
  static mapPayMarketCutToPayMarketMDCutModel(cut: PayMarketCut, createUser = null): PayMarketMDCutModel {
    return {
      CompanyPayMarketId: cut.CompanyPayMarketId,
      CompanyId: cut.CompanyId,
      IndustryLabel: cut.IndustryLabel,
      IndustryValue: cut.IndustryValue,
      SizeLabel: cut.SizeLabel,
      SizeValue: cut.SizeValue,
      GeoLabel: cut.GeoLabel,
      GeoValue: cut.GeoValue,
      Weight: cut.Weight,
      Adjustment: cut.Adjustment,
      CreateDate: null,
      CreateUser: createUser ? createUser : cut.CreateUser,
      DisplayOrder: cut.DisplayOrder
    };
  }

  static mapPayMarketCutsToPayMarketMDCutModels(cuts: PayMarketCut[], createUser = null): PayMarketMDCutModel[] {
    return cuts.map(cut => this.mapPayMarketCutToPayMarketMDCutModel(cut, createUser));
  }

  static generateMockPayMarketCut(): PayMarketCut {
    return {
      Adjustment: 10,
      CompanyId: 610,
      CompanyPayMarketId: 105908,
      CreateDate: new Date('11/20/2020'),
      CreateUser: 21687,
      DisplayOrder: 0,
      GeoLabel: 'Metro',
      GeoValue: 'Columbus, OH',
      IndustryLabel: 'SubIndustry',
      IndustryValue: 'Health Care Facilities',
      Scope: 'Health Care Facilities with 3,000-7,500 employees in the Columbus, OH area',
      SizeLabel: 'Employees',
      SizeValue: '3,000 - 7,500',
      Weight: 80
    };
  }
}
