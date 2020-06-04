import * as cloneDeep from 'lodash.clonedeep';

import { TemplateControl } from 'libs/models/jdm/template';
import { arrayMoveMutate, arrayMove } from 'libs/core/functions';

import * as fromTemplateActions from '../actions';
import * as templateHelper from './template-helper';

export const reducer = (state, action) => {
  switch (action.type) {
  case fromTemplateActions.ADD_CONTROL_TO_SECTION: {
    const templateControl: TemplateControl = action.payload.templateControl;
    const index: number = action.payload.index;
    const newState = cloneDeep(state);
    newState.template.Sections = templateHelper.addControlToSection(newState.template.Sections, templateControl, index);

    return newState;
  }
  case fromTemplateActions.ADD_DATA_ROW_TO_CONTROL: {
    const templateControl: TemplateControl = action.payload.templateControl;
    const dataRow: string = action.payload.dataRow;
    const newState = cloneDeep(state);
    templateHelper.getControl(newState.template.Sections, templateControl).Data.push(dataRow);

    return newState;
  }
  case fromTemplateActions.DELETE_CONTROL_FROM_SECTION: {
    const templateControl: TemplateControl = action.payload.templateControl;
    const newState = cloneDeep(state);
    newState.template.Sections = templateHelper.deleteControlFromSection(newState.template.Sections, templateControl);
    return newState;
  }
  case fromTemplateActions.MOVE_CONTROL_TO_SECTION: {
    const templateControl: TemplateControl = action.payload.templateControl;
    const newSectionId: number = action.payload.newSectionId;
    const index: number = action.payload.index;
    const newState = cloneDeep(state);
    newState.template.Sections = templateHelper.deleteControlFromSection(newState.template.Sections, templateControl);

    templateControl.SectionId = newSectionId;
    newState.template.Sections = templateHelper.addControlToSection(newState.template.Sections, templateControl, index);

    return newState;
  }
  case fromTemplateActions.REORDER_CONTROL_DATA: {
    const payload = action.payload;
    const newState = cloneDeep(state);
    const controlData = templateHelper.getControl(newState.template.Sections, payload.templateControl).Data;

    arrayMoveMutate(controlData, payload.oldIndex, payload.newIndex);

    return newState;
  }
  case fromTemplateActions.REPLACE_CONTROL_DATA: {
    const payload = action.payload;
    const newState = cloneDeep(state);
    const control = templateHelper.getControl(newState.template.Sections, payload.templateControl);

    control.Data = payload.dataRows;

    return newState;
  }
    case fromTemplateActions.UPDATE_CONTROL_DATA: {
    const changeObj: any = action.payload;
    const newState = cloneDeep(state);
    const currentDataRow = templateHelper.getDataRow(newState.template.Sections, changeObj.control, changeObj.change.dataRowId);

    currentDataRow[changeObj.change.attribute] = changeObj.change.newValue;

    return newState;
  }
  case fromTemplateActions.UPDATE_CONTROL_LABEL: {
    const templateControl: TemplateControl = action.payload.templateControl;
    const newLabel: string = action.payload.newLabel;
    const newState = cloneDeep(state);

    templateHelper.getControl(newState.template.Sections, templateControl).Label = newLabel;
    const secIndex = newState.template.Sections.findIndex(s => s.Id === templateControl.SectionId);
    newState.template.Sections[secIndex] = cloneDeep(newState.template.Sections[secIndex]);

    return newState;
  }
  case fromTemplateActions.REMOVE_CONTROL_DATA_ROW: {
    const templateControl: TemplateControl = action.payload.templateControl;
    const dataRowId: number = action.payload.dataRowId;
    const newState = cloneDeep(state);
    const currentControl = templateHelper.getControl(newState.template.Sections, templateControl);

    currentControl.Data = currentControl.Data.filter(d => d.Id !== dataRowId);

    return newState;
  }
  case fromTemplateActions.MOVE_CONTROL: {
    const newState = cloneDeep(state);

    newState.template.Sections = newState.template.Sections.map(section => {
      if (section.Id === action.payload.sectionId) {
        section.Controls = arrayMove(section.Controls, action.payload.oldIndex, action.payload.newIndex);
      }
      return section;
    });

    return newState;
  }
  case fromTemplateActions.UPDATE_CONTROL_ADDITIONAL_PROPERTIES: {
    const templateControl: TemplateControl = action.payload.templateControl;
    const additionalProperties: object = action.payload.additionalProperties;
    const newState = cloneDeep(state);

    const control = templateHelper.getControl(newState.template.Sections, templateControl);

    control.AdditionalProperties = control.AdditionalProperties || {};
    // Only set the properties we passed in so we do not overwrite any other properties that may already exist.
    for (const additionalProperty in additionalProperties) {
      if (additionalProperty) {
      control.AdditionalProperties[additionalProperty] = additionalProperties[additionalProperty];
      }
    }

    return newState;
  }
  default:
    return state;
}
};
