import { DataView } from '../../payfactors-api';

export interface ProjectTemplate {
  ProjectTemplateId: number;
  TemplateName: string;
}

export interface ProjectTemplateFields extends ProjectTemplate {
  Fields: BaseProjectFields;
}

export interface BaseProjectFields {
  ReferencePoints: number[];
  TemplateFields: CompositeFieldHierarchy[];
}

export interface ProjectTemplateFieldsResponse {
  TemplateName: string;
  ReferencePoints: number[];
  TemplateFields: CompositeFieldHierarchy[];
}

export interface SaveProjectFieldRequest {
  ProjectId: number;
  ProjectDataView: DataView;
  ReferencePoints: PricingProjectReferencePoints;
}

export interface PricingProjectReferencePoints {
  BaseReferencePoint: number;
  TCCReferencePoint: number;
  BonusReferencePoint: number;
  TCCTargetReferencePoint: number;
  LTIPReferencePoint: number;
  TDCReferencePoint: number;
  AllowReferencePoint: number;
  FixedReferencePoint: number;
  RemunReferencePoint: number;
  TGPReferencePoint: number;
  BonusTargetReferencePoint: number;
  TargetLTIPReferencePoint: number;
  TargetTDCReferencePoint: number;
  SalesIncentiveActualPctReferencePoint: number;
  SalesIncentiveTargetPctReferencePoint: number;
  TCCPlusAllowReferencePoint: number;
  TCCPlusAllowNoCarReferencePoint: number;
  TCCTargetPlusAllowReferencePoint: number;
  TCCTargetPlusAllowNoCarReferencePoint: number;
  LTIPPctReferencePoint: number;
  BonusPctReferencePoint: number;
  BonusTargetPctReferencePoint: number;
  SalesIncentiveActualReferencePoint: number;
  SalesIncentiveTargetReferencePoint: number;
}

export function getDefaultReferencePoints(): PricingProjectReferencePoints {
  return {
    BaseReferencePoint: 50,
    TCCReferencePoint: 50,
    BonusReferencePoint: 50,
    TCCTargetReferencePoint: 50,
    LTIPReferencePoint: 50,
    TDCReferencePoint: 50,
    AllowReferencePoint: 50,
    FixedReferencePoint: 50,
    RemunReferencePoint: 50,
    TGPReferencePoint: 50,
    BonusTargetReferencePoint: 50,
    TargetLTIPReferencePoint: 50,
    TargetTDCReferencePoint: 50,
    SalesIncentiveActualPctReferencePoint: 50,
    SalesIncentiveTargetPctReferencePoint: 50,
    TCCPlusAllowReferencePoint: 50,
    TCCPlusAllowNoCarReferencePoint: 50,
    TCCTargetPlusAllowReferencePoint: 50,
    TCCTargetPlusAllowNoCarReferencePoint: 50,
    LTIPPctReferencePoint: 50,
    BonusPctReferencePoint: 50,
    BonusTargetPctReferencePoint: 50,
    SalesIncentiveActualReferencePoint: 50,
    SalesIncentiveTargetReferencePoint: 50,
  };
}

export function generateMockProjectTemplateFields(): ProjectTemplateFields {
  return {
    ProjectTemplateId: 1,
    TemplateName: 'Something',
    Fields: {
      ReferencePoints: [],
      TemplateFields: [generateMockCompositeFieldHierarchy()]
    }
  };
}
export interface CompositeFieldHierarchy {
  Category: string;
  ModalTab: string;
  MinOrderNum: number;
  GroupHasAsterisk: boolean;
  Fields: CompositeField[];
}

export function generateMockCompositeFieldHierarchy(): CompositeFieldHierarchy {
  return {
    Fields: [
      generateMockCompositeField(),
      {
        ...generateMockCompositeField(),
        FieldName: 'Currency',
        DisplayName: 'Currency',
        ListCompositeFieldId: 2
      }
    ],
    Category: 'Test',
    ModalTab: 'Basic Data',
    GroupHasAsterisk: false,
    MinOrderNum: 1
  };
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

export function generateMockCompositeField(): CompositeField {
  return {
    FieldName: 'Job_Code',
    Checked: false,
    DisplayName: 'Job Code',
    ListCompositeFieldId: 1,
    PayfactorsDataExists: true,
    AppDisplayName: 'Baa Code',
    Category: 'Info',
    OrderNum: 12
  };
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


