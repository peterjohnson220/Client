import { Action } from '@ngrx/store';

// import { CompanyStructureRangeGroup } from 'libs/models/structures/company-structure-range-group.model';
import { CompanyStructure } from 'libs/models/structures/company-structure.model';
import { UpdateCompanyStructureRangeGroupNameDto } from 'libs/models/structures/update-company-structure-range-group-name-dto.model';

export const GET_MODEL_DATA = '[Structures/Job Range Modeling Page] Get Model Data';
export const GET_MODEL_DATA_SUCCESS = '[Structures/Job Range Modeling Page] Get Model Data Success';
export const SET_CURRENT_MODEL = '[Structures/Job Range Modeling Page] Set Current Model';
export const GET_STRUCTURE_DATA = '[Structures/Job Range Modeling Page] Get Structure Data';
export const GET_STRUCTURE_DATA_SUCCESS = '[Structures/Job Range Modeling Page] Get Structure Data Success';
export const SET_CURRENT_STRUCTURE = '[Structures/Job Range Modeling Page] Set Current Structure';
export const UPDATE_CURRENT_COMPANY_STRUCTURE_RANGE_GROUP_NAME
  = '[Structures/Job Range Modeling Page] Update Current Company Structure Range Group Name';
export const UPDATE_CURRENT_COMPANY_STRUCTURE_RANGE_GROUP_NAME_SUCCESS
  = '[Structures/Job Range Modeling Page] Update Current Company Structure Range Group Name Success';
export const UPDATE_CURRENT_COMPANY_STRUCTURE_RANGE_GROUP_NAME_ERROR
  = '[Structures/Job Range Modeling Page] Update Current Company Structure Range Group Name Error';
export const CLEAR_EDIT_MODEL_NAME_ERROR = '[Structures/Job Range Modeling Page] Clear Edit Model Name Error';

export class GetModelData implements Action {
  readonly type = GET_MODEL_DATA;

  constructor(public payload: number) {
  }
}

export class GetModelDataSuccess implements Action {
  readonly type = GET_MODEL_DATA_SUCCESS;

  constructor(public payload: any) {
  }
}

export class SetCurrentModel implements Action {
  readonly type = SET_CURRENT_MODEL;

  constructor(public payload: any) {
  }
}

export class GetStructureData implements Action {
  readonly type = GET_STRUCTURE_DATA;

  constructor(public payload: number) {
  }
}

export class GetStructureDataSuccess implements Action {
  readonly type = GET_STRUCTURE_DATA_SUCCESS;

  constructor(public payload: CompanyStructure) {
  }
}

export class SetCurrentStructure implements Action {
  readonly type = SET_CURRENT_STRUCTURE;

  constructor(public payload: CompanyStructure) {
  }
}

export class UpdateCurrentCompanyStructureRangeGroupName implements Action {
  readonly type = UPDATE_CURRENT_COMPANY_STRUCTURE_RANGE_GROUP_NAME;

  constructor(public payload: UpdateCompanyStructureRangeGroupNameDto) {
  }
}

export class UpdateCurrentCompanyStructureRangeGroupNameSuccess implements Action {
  readonly type = UPDATE_CURRENT_COMPANY_STRUCTURE_RANGE_GROUP_NAME_SUCCESS;

  constructor(public payload: any) {
  }
}

export class UpdateCurrentCompanyStructureRangeGroupNameError implements Action {
  readonly type = UPDATE_CURRENT_COMPANY_STRUCTURE_RANGE_GROUP_NAME_ERROR;

  constructor(public payload: string) {
  }
}

export class ClearEditModelNameError implements Action {
  readonly type = CLEAR_EDIT_MODEL_NAME_ERROR;

  constructor() {
  }
}

export type Actions
  = GetModelData
  | GetModelDataSuccess
  | SetCurrentModel
  | GetStructureData
  | GetStructureDataSuccess
  | SetCurrentStructure
  | UpdateCurrentCompanyStructureRangeGroupName
  | UpdateCurrentCompanyStructureRangeGroupNameSuccess
  | UpdateCurrentCompanyStructureRangeGroupNameError
  | ClearEditModelNameError;
