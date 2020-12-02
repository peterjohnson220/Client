export interface ProjectTemplate {
  ProjectTemplateId: number;
  TemplateName: string;
}

export interface ProjectTemplateFields extends ProjectTemplate {
  ReferencePoints: number[];
  TemplateFields: CompositeFieldHierarchy[];
}

export function generateMockProjectTemplateFields(): ProjectTemplateFields {
  return {
    ReferencePoints: [],
    TemplateFields: [generateMockCompositeFieldHierarchy()],
    ProjectTemplateId: 1,
    TemplateName: 'Something'
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


