import cloneDeep from 'lodash/cloneDeep';

import { JobDescriptionControl, JobDescriptionControlId, JobDescriptionSection } from 'libs/models/jdm';
import { ControlType, ControlTypeAttribute } from 'libs/models/common';


export class ControlDataHelper {
  static prevId = '0';
  static getControl = (sections: JobDescriptionSection[], jobDescriptionControl: JobDescriptionControlId): JobDescriptionControl => {
    return sections
      .find(s => s.Id === +jobDescriptionControl.SectionId).Controls
      .find(c => c.Id === +jobDescriptionControl.Id);
  }

  static updateControlAttribute = (sections, jobDescriptionControl, dataRowId, attribute, value) => {
    const section = sections.find(s => s.Id === +jobDescriptionControl.SectionId);
    const index = section.Controls.findIndex(c => c.Id === +jobDescriptionControl.Id);
    const controlClone = Object.assign({}, section.Controls[index]);
    controlClone.Data.find(d => d.Id === dataRowId)[attribute] += value;
    section.Controls[index] = controlClone;
  }

  static getJobDescriptionControlDataRow = (sections, jobDescriptionControl, dataRowId) => {
    return ControlDataHelper.getControl(sections, jobDescriptionControl).Data.find(d => d.Id === dataRowId);
  }

  static addSourcedDataToControl(sections: JobDescriptionSection[], jobDescriptionControl: JobDescriptionControl, controlType: ControlType, data: string) {
    // Find which attribute can be sourced
    const sourcedAttribute = controlType.Attributes.find(a => a.CanBeSourced);

    // Leave if no sourceable attribute
    if (!sourcedAttribute) {
      return;
    }
    if (controlType.EditorType === 'SmartList') {
      data += '========>FROM LIBRARY';
    }

    // Append the data to existing Row if it is a Editor Type of Single or If the last row has No Data in it
    if ((controlType.EditorType === 'Single' && !this.hasTemplateDataRow(jobDescriptionControl)) ||
        (jobDescriptionControl.Data.length && !this.hasData(controlType.Attributes, jobDescriptionControl.Data[jobDescriptionControl.Data.length - 1]))) {
      const rteWrappedData = `${jobDescriptionControl.Data[0][sourcedAttribute.Name].length ? '<p><br></p>' : ''}<p>${data}</p>`;
      const appendData = sourcedAttribute.Type === 'RichText' ? rteWrappedData : data;
      const dataRow = jobDescriptionControl.Data[jobDescriptionControl.Data.length - 1];

      this.updateControlAttribute(sections, jobDescriptionControl, dataRow.Id, sourcedAttribute.Name, appendData);
    } else if (!(controlType.EditorType === 'Single' && this.hasTemplateDataRow( jobDescriptionControl))) {
      this.addControlDataRow(sections, jobDescriptionControl, this.createDataRow(controlType.Attributes, data));
    }
  }

  static addControlDataRow = (sections, jobDescriptionControl, dataRow) => {
    const section = sections.find(s => s.Id === +jobDescriptionControl.SectionId);
    const index = section.Controls.findIndex(c => c.Id === +jobDescriptionControl.Id);
    const controlClone = cloneDeep(section.Controls[index]);
    const controlDataCopy = cloneDeep(controlClone.Data);
    controlDataCopy.push(dataRow);
    controlClone.Data = controlDataCopy;
    section.Controls[index] = controlClone;
  }

  static createDataRow(attributes: ControlTypeAttribute[], data?: string) {
    let Id = Date.now().toString();
    while (this.prevId === Id) {
      Id  =   Date.now().toString();
    }
    this.prevId = Id;
    const dataRow = {Id: Id};
    attributes.forEach(a => {
      (data && a.CanBeSourced) ? dataRow[a.Name] = data : dataRow[a.Name] = '';
    });

    return dataRow;
  }

  static initDataRows(sections: JobDescriptionSection[], allControlTypes: ControlType[]): JobDescriptionSection[] {
    return sections.map(section => {
      section.Controls.forEach(control => {
        const controlType = allControlTypes.find(x => x.Type === control.Type && x.ControlVersion === control.ControlVersion);
        if (!!controlType) {
          control.ControlType = controlType;
          if (this.shouldAddDataRowOnInit(control, controlType)) {
            control.Data = control.Data.concat([this.createDataRow(controlType.Attributes)]);
          }
        }
      });
      return section;
    });
  }

  static removeControlTypes(sections: JobDescriptionSection[]): JobDescriptionSection[] {
    return sections.map(section => {
      section.Controls = section.Controls.map(control => {
        return {
          Id: control.Id,
          SectionId: control.SectionId,
          Label: control.Label,
          Type: control.Type,
          EditorType: control.EditorType,
          ControlVersion: control.ControlVersion,
          Data: control.Data,
          AdditionalProperties: control.AdditionalProperties,
          Statuses: control.Statuses
        };
      });
      return section;
    });
  }

  static hasData(attributes: ControlTypeAttribute[], dataRow: any) {
    return attributes.some(a => !!dataRow[a.Name]);
  }

  private static hasTemplateDataRow(jobDescriptionControl: JobDescriptionControl) {
    return jobDescriptionControl.Data.some(dataRow => dataRow.TemplateId);
  }

  private static hasJobDescriptionDataRow(control: JobDescriptionControl) {
    return !control.Data.length ? false : control.Data.some(dataRow => !dataRow.TemplateId);
  }

  private static shouldAddDataRowOnInit(control: JobDescriptionControl, controlType: ControlType): boolean {
    return controlType.EditorType !== 'SmartList' &&
      !controlType.ReadOnly &&
      !(controlType.EditorType === 'Single' && control.Data.length) &&
      !(controlType.EditorType === 'List' && controlType.Locked && control.Data.length) &&
      !this.hasJobDescriptionDataRow(control);
  }
}
