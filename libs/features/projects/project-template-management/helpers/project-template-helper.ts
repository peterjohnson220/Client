import { CompositeField, ProjectTemplateFields, ReferencePoints } from 'libs/models/projects/project-templates';

export class ProjectTemplateHelper {

  static getReferencePoint(compositeField: CompositeField, referencePoints: number[]): number {
    const index = this.getReferencePointIndex(compositeField);
    return this.getReferencePointValue(referencePoints, index);
  }

  static setTemplateFieldsCompanyName(template: ProjectTemplateFields, companyNameShort: string): ProjectTemplateFields  {
    // todo this should probably happen server side. Doing client side here to avoid issues in ASP
    if (!!template && template.TemplateFields) {
      template.TemplateFields.forEach(t => {
        t.ModalTab = t.ModalTab?.replace('Company', companyNameShort);
        t.Category = t.Category?.replace('Company', companyNameShort);
        t.Fields.forEach(f => {
          f.Category = t.Category;
        });
      });
    }
    return template;
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
