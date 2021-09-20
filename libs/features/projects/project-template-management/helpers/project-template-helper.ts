import { CompositeField, ProjectTemplateFieldsResponse, ProjectTemplateFields, ReferencePoints } from 'libs/models/projects/project-templates';

export class ProjectTemplateHelper {

  static getReferencePoint(compositeField: CompositeField, referencePoints: number[]): number {
    const index = this.getReferencePointIndex(compositeField);
    return this.getReferencePointValue(referencePoints, index);
  }

  static setTemplateFieldsCompanyName(response: ProjectTemplateFieldsResponse, companyNameShort: string): ProjectTemplateFields  {
    // todo this should probably happen server side. Doing client side here to avoid issues in ASP
    if (!!response && response.TemplateFields) {
      response.TemplateFields.forEach(t => {
        t.ModalTab = t.ModalTab?.replace('Company', companyNameShort);
        t.Category = t.Category?.replace('Company', companyNameShort);
        t.Fields.forEach(f => {
          f.Category = t.Category;
        });
      });
    }
    return {
      ProjectTemplateId: 0, // API doesn't return this property
      TemplateName: response.TemplateName,
      Fields: {
        TemplateFields: response.TemplateFields,
        ReferencePoints: response.ReferencePoints
      }
    };
  }

  private static getReferencePointValue(referencePoints: number[], referencePointIndex: number) {
    if (referencePoints.length > referencePointIndex) {
      return referencePoints[referencePointIndex];
    }
    return 50;
  }

  private static getReferencePointIndex(compositeField: CompositeField): number {
    const enumName = compositeField.FieldName.replace('MRP', 'ReferencePoint');
    return ReferencePoints[enumName];
  }
}
