export interface SaveProjectTemplateRequest extends SaveCompositeFieldsRequest {
  TemplateName: string;
}

export interface SaveCompositeFieldsRequest {
  CompositeFieldIds: number[];
  BaseRefPt: number;
  TCCRefPt: number;
  BonusRefPt: number;
  TCCTargetRefPt: number;
  LTIPRefPt: number;
  TDCRefPt: number;
  AllowRefPt: number;
  FixedRefPt: number;
  RemunRefPt: number;
  TGPRefPt: number;
  BonusTargetRefPt: number;
  LTIPTargetRefPt: number;
  TDCTargetRefPt: number;
  SalesIncentiveActualPctRefPt?: number;
  SalesIncentiveTargetPctRefPt?: number;
  TCCPlusAllowRefPt?: number;
  TCCPlusAllowNoCarRefPt?: number;
  TCCTargetPlusAllowRefPt?: number;
  TCCTargetPlusAllowNoCarRefPt?: number;
  LTIPPctRefPt?: number;
  BonusPctRefPt: number;
  BonusTargetPctRefPt: number;
  SalesIncentiveActualRefPt?: number;
  SalesIncentiveTargetRefPt?: number;
}
