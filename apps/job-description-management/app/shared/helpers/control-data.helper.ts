import { JobDescriptionControl } from 'libs/models/jdm';

export class ControlDataHelper {
  static getControl = (sections, jobDescriptionControl): JobDescriptionControl => {
    return sections
      .find(s => s.Id === +jobDescriptionControl.SectionId).Controls
      .find(c => c.Id === +jobDescriptionControl.Id);
  }

  static updateControlAttribute = (sections, jobDescriptionControl, dataRowId, attribute, value) => {
    const section = sections
      .find(s => s.Id === jobDescriptionControl.SectionId);
    const index = section.Controls
      .findIndex(c => c.Id === jobDescriptionControl.Id);
    const controlClone = Object.assign({}, section.Controls[index]);
    controlClone.Data.find(d => d.Id === dataRowId)[attribute] += value;
    section.Controls[index] = controlClone;
  }

  static getJobDescriptionControlDataRow = (sections, jobDescriptionControl, dataRowId) => {
    return ControlDataHelper.getControl(sections, jobDescriptionControl).Data.find(d => d.Id === dataRowId);
  }
}
