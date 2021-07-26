import { Action } from '@ngrx/store';

export const NAVIGATE_TO_SETTINGS_FROM_JDM_LIST = '[job-description-management / Job Description Navigation] Navigate to Settings From JDM List';
export const NAVIGATE_TO_SETTINGS_FROM_TEMPLATE_LIST = '[job-description-management / Job Description Navigation] Navigate to Settings From Template List';
export const NAVIGATE_TO_SETTINGS_FROM_TEMPLATE = '[job-description-management / Job Description Navigation] Navigate to Settings From Template';

export class NavigateToSettingsFromJdmList implements Action {
  readonly type = NAVIGATE_TO_SETTINGS_FROM_JDM_LIST;
}

export class NavigateToSettingsFromTemplateList implements Action {
  readonly type = NAVIGATE_TO_SETTINGS_FROM_TEMPLATE_LIST;
}

export class NavigateToSettingsFromTemplate implements Action {
  readonly type = NAVIGATE_TO_SETTINGS_FROM_TEMPLATE;
  constructor(public templateId: number) {}
}

export type Actions
= NavigateToSettingsFromJdmList
| NavigateToSettingsFromTemplateList
| NavigateToSettingsFromTemplate;

