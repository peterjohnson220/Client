export interface ProjectTemplate {
  ProjectTemplateId: number;
  TemplateName: string;
}

export interface ProjectTemplateFields extends ProjectTemplate {
  ReferencePoints: number[];
  TemplateFields: CompositeFieldHierarchy[];
}

export interface CompositeFieldHierarchy {
  Category: string;
  ModalTab: string;
  MinOrderNum: number;
  GroupHasAsterisk: boolean;
  Fields: CompositeField[];
}

export interface CompositeField {
  ListCompositeFieldId: number;
  FieldName: string;
  DisplayName: string;
  Category: string;
  OrderNum?: number;
  AppDisplayName?: string;
  Checked: boolean;
  PayfactorsDataExists: boolean;
}

export enum ReferencePoints {
  BaseReferencePoint,
  TCCReferencePoint,
  BonusReferencePoint,
  TCCTargetReferencePoint,
  LTIPReferencePoint,
  TDCReferencePoint,
  AllowReferencePoint,
  FixedReferencePoint,
  RemunReferencePoint,
  TGPReferencePoint,
  BonusTargetReferencePoint,
  TargetLTIPReferencePoint,
  TargetTDCReferencePoint,
  SalesIncentiveActualPctReferencePoint,
  SalesIncentiveTargetPctReferencePoint,
  TCCPlusAllowReferencePoint,
  TCCPlusAllowNoCarReferencePoint,
  TCCTargetPlusAllowReferencePoint,
  TCCTargetPlusAllowNoCarReferencePoint,
  LTIPPctReferencePoint,
  BonusPctReferencePoint,
  BonusTargetPctReferencePoint,
  SalesIncentiveActualReferencePoint,
  SalesIncentiveTargetReferencePoint
}


