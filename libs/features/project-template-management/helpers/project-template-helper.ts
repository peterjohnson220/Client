import { CompositeField, ReferencePoints } from 'libs/models/projects/project-templates';

export class ProjectTemplateHelper {

  static getReferencePoint(compositeField: CompositeField, referencePoints: number[]): number {
    const index = this.getReferencePointIndex(compositeField);
    return this.getReferencePointValue(referencePoints, index);
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
