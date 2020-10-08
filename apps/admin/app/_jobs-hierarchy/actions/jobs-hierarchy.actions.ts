import { Action } from '@ngrx/store';

import { JobLevelHierarchy, JobLevelHierarchyDetail } from 'libs/models';

export const GET_JOB_FAMILIES = '[Admin/Jobs Hierarchy] Get Job Families';
export const GET_JOB_FAMILIES_SUCCESS = '[Admin/Jobs Hierarchy] Get Job Families Success';
export const GET_JOB_FAMILIES_ERROR = '[Admin/Jobs Hierarchy] Get Job Families Error';

export const GET_AVAILABLE_JOB_LEVELS = '[Admin/Jobs Hierarchy] Get Available Job Levels';
export const GET_AVAILABLE_JOB_LEVELS_SUCCESS = '[Admin/Jobs Hierarchy] Get Available Job Levels Success';
export const GET_AVAILABLE_JOB_LEVELS_ERROR = '[Admin/Jobs Hierarchy] Get Available Job Levels Error';

export const GET_JOB_LEVEL_HIERARCHIES = '[Admin/Jobs Hierarchy] Get Job Level Hierarchies';
export const GET_JOB_LEVEL_HIERARCHIES_SUCCESS = '[Admin/Jobs Hierarchy] Get Job Level Hierarchies Success';
export const GET_JOB_LEVEL_HIERARCHIES_ERROR = '[Admin/Jobs Hierarchy] Get Job Level Hierarchies Error';

export const GET_JOB_LEVEL_HIERARCHY = '[Admin/Jobs Hierarchy] Get Job Level Hierarchy';
export const GET_JOB_LEVEL_HIERARCHY_SUCCESS = '[Admin/Jobs Hierarchy] Get Job Level Hierarchy Success';
export const GET_JOB_LEVEL_HIERARCHY_ERROR = '[Admin/Jobs Hierarchy] Get Job Level Hierarchy Error';

export const SAVE_JOB_LEVEL_HIERARCY = '[Admin/Jobs Hierarchy] Save Company Job Level Hierarchy';
export const SAVE_JOB_LEVEL_HIERARCY_SUCCESS = '[Admin/Jobs Hierarchy] Save Company Job Level Hierarchy Success';
export const SAVE_JOB_LEVEL_HIERARCY_ERROR = '[Admin/Jobs Hierarchy] Save Company Job Level Hierarchy Error';

export const RESET_JOB_LEVEL_HIERARCY_FORM = '[Admin/Jobs Hierarchy] Reset Company Job Level Hierarchy Form';
export const RESET_JOB_LEVEL_HIERARCY_FORM_SUCCESS = '[Admin/Jobs Hierarchy] Reset Company Job Level Hierarchy Form Success';


export class ResetJobLevelHierarchyForm implements Action {
  readonly type = RESET_JOB_LEVEL_HIERARCY_FORM;

  constructor() {}
}

export class ResetJobLevelHierarchyFormSuccess implements Action {
  readonly type = RESET_JOB_LEVEL_HIERARCY_FORM_SUCCESS;

  constructor() {}
}

export class GetJobLevelHierarchies implements Action {
  readonly type = GET_JOB_LEVEL_HIERARCHIES;

  constructor() {}
}

export class GetJobLevelHierarchiesSuccess implements Action {
  readonly type = GET_JOB_LEVEL_HIERARCHIES_SUCCESS;

  constructor(public payload: JobLevelHierarchy[]) {}
}

export class GetJobLevelHierarchiesError implements Action {
  readonly type = GET_JOB_LEVEL_HIERARCHIES_ERROR;

  constructor(public error: any) {}
}

export class GetJobLevelHierarchy implements Action {
  readonly type = GET_JOB_LEVEL_HIERARCHY;

  constructor(public payload: {hierarchyId: number}) {}
}

export class GetJobLevelHierarchySuccess implements Action {
  readonly type = GET_JOB_LEVEL_HIERARCHY_SUCCESS;

  constructor(public payload: JobLevelHierarchyDetail) {}
}

export class GetJobLevelHierarchyError implements Action {
  readonly type = GET_JOB_LEVEL_HIERARCHY_ERROR;

  constructor(public error: any) {}
}

export class SaveJobLevelHierarchy implements Action {
  readonly type = SAVE_JOB_LEVEL_HIERARCY;

  constructor(public payload: { jobLevelHierarchy: JobLevelHierarchyDetail }) {}
}

export class SaveJobLevelHierarchySuccess implements Action {
  readonly type = SAVE_JOB_LEVEL_HIERARCY_SUCCESS;

  constructor() {}
}

export class SaveJobLevelHierarchyError implements Action {
  readonly type = SAVE_JOB_LEVEL_HIERARCY_ERROR;

  constructor(public error: any) {}
}

export class GetAvailableJobLevels implements Action {
  readonly type = GET_AVAILABLE_JOB_LEVELS;

  constructor(public payload: {selectedJobFamilies?: string[], hierarchyId: number}) {}
}

export class GetAvailableJobLevelsSuccess implements Action {
  readonly type = GET_AVAILABLE_JOB_LEVELS_SUCCESS;

  constructor(public payload: string[]) {}
}

export class GetAvailableJobLevelsError implements Action {
  readonly type = GET_AVAILABLE_JOB_LEVELS_ERROR;

  constructor(public payload: any) {}
}

export class GetJobFamilies implements Action {
  readonly type = GET_JOB_FAMILIES;

  constructor() {}
}

export class GetJobFamiliesSuccess implements Action {
  readonly type = GET_JOB_FAMILIES_SUCCESS;

  constructor(public payload: string[]) {}
}

export class GetJobFamiliesError implements Action {
  readonly type = GET_JOB_FAMILIES_ERROR;

  constructor(public payload: any) {}
}

export type Actions
  = GetJobFamilies
  | GetJobFamiliesSuccess
  | GetJobFamiliesError
  | SaveJobLevelHierarchy
  | SaveJobLevelHierarchySuccess
  | SaveJobLevelHierarchyError
  | GetAvailableJobLevels
  | GetAvailableJobLevelsSuccess
  | GetAvailableJobLevelsError
  | GetJobLevelHierarchies
  | GetJobLevelHierarchiesSuccess
  | GetJobLevelHierarchiesError
  | GetJobLevelHierarchy
  | GetJobLevelHierarchySuccess
  | GetJobLevelHierarchyError
  | ResetJobLevelHierarchyFormSuccess
  | ResetJobLevelHierarchyForm;
