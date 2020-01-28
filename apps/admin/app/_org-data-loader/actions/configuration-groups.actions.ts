import { Action } from '@ngrx/store';
import { GetLoaderConfigurationGroupRequest } from 'libs/models/data-loads/request';
import { ConfigurationGroup} from 'libs/models/data-loads';

export const LOADING_CONFIGURATION_GROUPS = '[Org Data Autoloader/Configuration Groups] Loading Configuration Groups';
export const LOADING_CONFIGURATION_GROUPS_SUCCESS = '[Org Data Autoloader/Configuration Groups] Loading Configuration Groups Success';
export const LOADING_CONFIGURATION_GROUPS_ERROR = '[Org Data Autoloader/Configuration Groups] Loading Configuration Groups Error';
export const SAVING_CONFIGURATION_GROUP = '[Org Data Autoloader/Configuration Groups] Saving Configuration Group';
export const SAVING_CONFIGURATION_GROUP_SUCCESS = '[Org Data Autoloader/Configuration Groups] Saving Configuration Group Success';
export const SAVING_CONFIGURATION_GROUP_ERROR = '[Org Data Autoloader/Configuration Groups] Saving Configuration Group Error';

export class LoadingConfigurationGroups implements Action {
  readonly type = LOADING_CONFIGURATION_GROUPS;

  constructor(public payload: GetLoaderConfigurationGroupRequest) {}
}

export class LoadingConfigurationGroupsError implements Action {
  readonly type = LOADING_CONFIGURATION_GROUPS_ERROR;
}

export class LoadingConfigurationGroupsSuccess implements Action {
  readonly type = LOADING_CONFIGURATION_GROUPS_SUCCESS;

  constructor(public payload: ConfigurationGroup[]) {}
}

export class SavingConfigurationGroup implements Action {
  readonly type = SAVING_CONFIGURATION_GROUP;

  constructor(public payload: ConfigurationGroup) {}
}

export class SavingConfigurationGroupError implements Action {
  readonly type = SAVING_CONFIGURATION_GROUP_ERROR;
}

export class SavingConfigurationGroupSuccess implements Action {
  readonly type = SAVING_CONFIGURATION_GROUP_SUCCESS;

  constructor(public payload: ConfigurationGroup) {}
}

export type Actions
  = LoadingConfigurationGroups
  | LoadingConfigurationGroupsSuccess
  | LoadingConfigurationGroupsError
  | SavingConfigurationGroup
  | SavingConfigurationGroupSuccess
  | SavingConfigurationGroupError;
