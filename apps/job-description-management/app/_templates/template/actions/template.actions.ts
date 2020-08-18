import { Action } from '@ngrx/store';

import { Template, TemplateSection, TemplateControl } from 'libs/models/jdm/template';

import { SaveError, JobInformationField } from 'libs/features/job-description-management';

export const PUBLISH_TEMPLATE = '[JobDescription/Template] Publish Template';
export const PUBLISH_TEMPLATE_SUCCESS = '[JobDescription/Template] Publish Template Success';
export const PUBLISH_TEMPLATE_ERROR = '[JobDescription/Template] Publish Template Error';

export const SAVE_TEMPLATE = '[JobDescription/Template] Save Template';
export const SAVE_TEMPLATE_SUCCESS = '[JobDescription/Template] Save Template Success';
export const SAVE_TEMPLATE_ERROR = '[JobDescription/Template] Save Template Error';
export const CLEAR_SAVE_TEMPLATE_ERROR = '[JobDescription/Template] Clear Save Template Error';

export const SAVE_TEMPLATE_NAME = '[JobDescription/Template] Save Template Name';
export const SAVE_TEMPLATE_NAME_SUCCESS = '[JobDescription/Template] Save Template Name Success';
export const SAVE_TEMPLATE_NAME_ERROR = '[JobDescription/Template] Save Template Name Error';

export const DISCARD_TEMPLATE_DRAFT = '[JobDescription/Template] Discard Template Draft';
export const DISCARD_TEMPLATE_DRAFT_SUCCESS = '[JobDescription/Template] Discard Template Draft Success';
export const DISCARD_TEMPLATE_DRAFT_ERROR = '[JobDescription/Template] Discard Template Draft Error';

export const COPY_TEMPLATE = '[JobDescription/Template] Copy Template';
export const COPY_TEMPLATE_SUCCESS = '[JobDescription/Template] Copy Template Success';
export const COPY_TEMPLATE_ERROR = '[JobDescription/Template] Copy Template Error';

export const LOAD_TEMPLATE = '[JobDescription/Template] Load Template';
export const LOAD_TEMPLATE_SUCCESS = '[JobDescription/Template] Load Template Success';
export const LOAD_TEMPLATE_ERROR = '[JobDescription/Template] Load Template Error';

export const LOAD_TEMPLATE_ASSIGNMENT_SUMMARY = '[JobDescription/Template] Load Template Assignment Summary';
export const LOAD_TEMPLATE_ASSIGNMENT_SUMMARY_SUCCESS = '[JobDescription/Template] Load Template Assignment Summary Success';
export const LOAD_TEMPLATE_ASSIGNMENT_SUMMARY_ERROR = '[JobDescription/Template] Load Template Assignment Summary Error';

export const ADD_SECTION = '[JobDescription/Template] Add Section';
export const DELETE_SECTION = '[JobDescription/Template] Delete Section';
export const EDIT_SECTION = '[JobDescription/Template] Edit Section';
export const MOVE_SECTION = '[JobDescription/Template] Move Section';

export const ADD_CONTROL_TO_SECTION = '[JobDescription/Template] Add Control To Section';
export const DELETE_CONTROL_FROM_SECTION = '[JobDescription/Template] Delete Control From Section';
export const ADD_DATA_ROW_TO_CONTROL = '[JobDescription/Template] Add Data Row To Control';
export const REORDER_CONTROL_DATA = '[JobDescription/Template] Reorder Control Data';
export const REPLACE_CONTROL_DATA = '[JobDescription/Template] Replace Control Data';
export const REMOVE_CONTROL_DATA_ROW = '[JobDescription/Template] Remove Control Data Row';
export const UPDATE_CONTROL_DATA = '[JobDescription/Template] Update Control Data';
export const UPDATE_CONTROL_LABEL = '[JobDescription/Template] Update Control Label';
export const MOVE_CONTROL_TO_SECTION = '[JobDescription/Template] Move Control To Section';
export const MOVE_CONTROL = '[JobDescription/Template] Move Control';
export const UPDATE_CONTROL_ADDITIONAL_PROPERTIES = '[JobDescription/Template] Update Control Additional Properties';

export const BEGIN_EDITING = '[JobDescription/Template] Begin Editing';
export const UPDATE_TEMPLATE_LOGO = '[JobDescription/Template] Update Template Logo';
export const CLEAN_TEMPLATE_STATE = '[JobDescription/Template] Clean Template State';
export const SET_JOB_HAS_TEMPLATE_MESSAGE = '[JobDescription/Template] Set Job Has Template';
export const REPLACE_JOB_INFORMATION_FIELDS = '[JobDescription/Template] Replace Job Information Fields';

export class DiscardTemplateDraft implements Action {
  readonly type = DISCARD_TEMPLATE_DRAFT;

  constructor(public payload: {templateId: number}) {}
}

export class DiscardTemplateDraftSuccess implements Action {
  readonly type = DISCARD_TEMPLATE_DRAFT_SUCCESS;
}

export class DiscardTemplateDraftError implements Action {
  readonly type = DISCARD_TEMPLATE_DRAFT_ERROR;

  constructor(public payload: {errorMessage: string}) {}
}

export class UpdateTemplateLogo implements Action {
  readonly type = UPDATE_TEMPLATE_LOGO;

  constructor(public payload: {logoUrl: string}) {}
}

export class ReplaceJobInformationFields implements Action {
  readonly type = REPLACE_JOB_INFORMATION_FIELDS;

  constructor(public payload: {jobInformationFields: JobInformationField[]}) {}
}

export class AddControlToSection implements Action {
  readonly type = ADD_CONTROL_TO_SECTION;

  constructor(public payload: {templateControl: TemplateControl, index: number}) {}
}

export class DeleteControlFromSection implements Action {
  readonly type = DELETE_CONTROL_FROM_SECTION;

  constructor(public payload: {templateControl: TemplateControl}) {}
}

export class AddDataRowToControl implements Action {
  readonly type = ADD_DATA_ROW_TO_CONTROL;

  constructor(public payload: {templateControl: TemplateControl, dataRow: any}) {}
}

export class ReorderControlData implements Action {
  readonly type = REORDER_CONTROL_DATA;

  constructor(public payload: {templateControl: TemplateControl, oldIndex: number, newIndex: number}) {}
}

export class ReplaceControlData implements Action {
  readonly type = REPLACE_CONTROL_DATA;

  constructor(public payload: {templateControl: TemplateControl, dataRows: any}) {}
}

export class RemoveControlDataRow implements Action {
  readonly type = REMOVE_CONTROL_DATA_ROW;

  constructor(public payload: {templateControl: TemplateControl, dataRowId: number}) {}
}

export class UpdateControlData implements Action {
  readonly type = UPDATE_CONTROL_DATA;

  constructor(public payload: {changeObj: any}) {}
}

export class UpdateControlLabel implements Action {
  readonly type = UPDATE_CONTROL_LABEL;

  constructor(public payload: {templateControl: TemplateControl, newLabel: string}) {}
}

export class MoveControlToSection implements Action {
  readonly type = MOVE_CONTROL_TO_SECTION;

  constructor(public payload: {templateControl: TemplateControl, newSectionId: number, index: number}) {}
}

export class MoveControl implements Action {
  readonly type = MOVE_CONTROL;

  constructor(public payload: {sectionId: number, oldIndex: number, newIndex: number}) {}
}

export class UpdateControlAdditionalProperties implements Action {
  readonly type = UPDATE_CONTROL_ADDITIONAL_PROPERTIES;

  constructor(public payload: {templateControl: TemplateControl, additionalProperties: object}) {}
}

export class SetJobHadTemplateMessage implements Action {
  readonly type = SET_JOB_HAS_TEMPLATE_MESSAGE;

  constructor(public payload: {message: string}) {}
}

export class AddSection implements Action {
  readonly type = ADD_SECTION;

  constructor(public payload: {templateSection: TemplateSection}) {}
}

export class DeleteSection implements Action {
  readonly type = DELETE_SECTION;

  constructor(public payload: {templateSection: TemplateSection}) {}
}

export class EditSection implements Action {
  readonly type = EDIT_SECTION;

  constructor(public payload: {templateSection: TemplateSection}) {}
}

export class MoveSection implements Action {
  readonly type = MOVE_SECTION;

  constructor(public payload: {oldIndex: number, newIndex: number}) {}
}

export class SaveTemplate implements Action {
  readonly type = SAVE_TEMPLATE;

  constructor(public payload: {template: Template}) {}
}

export class SaveTemplateSuccess implements Action {
  readonly type = SAVE_TEMPLATE_SUCCESS;

  constructor(public payload: {template: Template}) {}
}

export class SaveTemplateError implements Action {
  readonly type = SAVE_TEMPLATE_ERROR;

  constructor(public payload: {error: SaveError}) {}
}

export class SaveTemplateName implements Action {
  readonly type = SAVE_TEMPLATE_NAME;

  constructor(public payload: {templateId: number, templateName: string}) {}
}

export class SaveTemplateNameSuccess implements Action {
  readonly type = SAVE_TEMPLATE_NAME_SUCCESS;
  constructor(public payload: any) {}
}

export class SaveTemplateNameError implements Action {
  readonly type = SAVE_TEMPLATE_NAME_ERROR;

  constructor(public payload: {error: SaveError}) {}
}

export class ClearSaveTemplateError implements Action {
  readonly type = CLEAR_SAVE_TEMPLATE_ERROR;
}

export class LoadTemplate implements Action {
  readonly type = LOAD_TEMPLATE;

  constructor(public payload: {templateId: number}) {}
}

export class LoadTemplateSuccess implements Action {
  readonly type = LOAD_TEMPLATE_SUCCESS;

  constructor(public payload: any) {}
}

export class LoadTemplateError implements Action {
  readonly type = LOAD_TEMPLATE_ERROR;

  constructor(public payload: {errorMessage: string}) {}
}

export class LoadTemplateAssignmentSummary implements Action {
  readonly type = LOAD_TEMPLATE_ASSIGNMENT_SUMMARY;

  constructor(public payload: {templateId: number}) {}
}

export class LoadTemplateAssignmentSummarySuccess implements Action {
  readonly type = LOAD_TEMPLATE_ASSIGNMENT_SUMMARY_SUCCESS;

  constructor(public payload: any) {}
}

export class LoadTemplateAssignmentSummaryError implements Action {
  readonly type = LOAD_TEMPLATE_ASSIGNMENT_SUMMARY_ERROR;

  constructor(public payload: {errorMessage: string}) {}
}

export class CleanTemplateState implements Action {
  readonly type = CLEAN_TEMPLATE_STATE;
}

export class CopyTemplate implements Action {
  readonly type = COPY_TEMPLATE;

  constructor(public payload: {templateId: number, templateName: string}) {}
}

export class CopyTemplateSuccess implements Action {
  readonly type = COPY_TEMPLATE_SUCCESS;

  constructor(public payload: Template) {}
}

export class CopyTemplateError implements Action {
  readonly type = COPY_TEMPLATE_ERROR;

  constructor(public payload: {errorMessage: string}) {}
}

export class PublishTemplate implements Action {
  readonly type = PUBLISH_TEMPLATE;

  constructor(public payload: {template: Template}) {}
}

export class PublishTemplateSuccess implements Action {
  readonly type = PUBLISH_TEMPLATE_SUCCESS;
}

export class PublishTemplateError implements Action {
  readonly type = PUBLISH_TEMPLATE_ERROR;

  constructor(public payload: {errorMessage: string}) {}
}

export class BeginEditing implements Action {
  readonly type = BEGIN_EDITING;
}

export type TemplateActions
  = SaveTemplate
  | SaveTemplateSuccess
  | SaveTemplateError
  | SaveTemplateName
  | SaveTemplateNameSuccess
  | SaveTemplateNameError
  | ClearSaveTemplateError
  | LoadTemplate
  | LoadTemplateSuccess
  | LoadTemplateError
  | LoadTemplateAssignmentSummary
  | LoadTemplateAssignmentSummarySuccess
  | LoadTemplateAssignmentSummaryError
  | CleanTemplateState
  | CopyTemplate
  | CopyTemplateSuccess
  | CopyTemplateError
  | PublishTemplate
  | PublishTemplateSuccess
  | PublishTemplateError
  | AddSection
  | DeleteSection
  | EditSection
  | MoveSection
  | DeleteControlFromSection
  | AddControlToSection
  | AddDataRowToControl
  | ReorderControlData
  | ReplaceControlData
  | RemoveControlDataRow
  | UpdateControlData
  | UpdateControlLabel
  | MoveControlToSection
  | MoveControl
  | UpdateControlAdditionalProperties
  | SetJobHadTemplateMessage
  | ReplaceJobInformationFields
  | UpdateTemplateLogo
  | DiscardTemplateDraft
  | DiscardTemplateDraftSuccess
  | DiscardTemplateDraftError
  | BeginEditing;
