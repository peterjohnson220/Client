import { Action } from '@ngrx/store';
import { Statement, StatementModeEnum, UpdateStringPropertyRequest, Settings } from '../../../shared/models';
import * as requestModels from '../../../shared/models/request-models';
import { FontSize, FontFamily } from '../../../shared/types';

import * as statementActions from './statement.actions';
import * as settingsActions from './settings.actions';
import * as controlActions from './control.actions';

export type StatementEditPageActions =
  statementActions.CloneStatementFromTemplate |
  statementActions.CloneStatementFromTemplateSuccess |
  statementActions.CloneStatementFromTemplateError |
  statementActions.ToggleStatementEditMode |
  statementActions.LoadStatement |
  statementActions.LoadStatementSuccess |
  statementActions.LoadStatementError |
  statementActions.ResetStatement |
  statementActions.SaveStatement |
  statementActions.SaveStatementSuccess |
  statementActions.SaveStatementError |

  controlActions.UpdateStatementName |
  controlActions.UpdateStatementControlTitle |
  controlActions.UpdateCalculationControlFieldTitle |
  controlActions.UpdateCalculationControlSummaryTitle |
  controlActions.AddCalculationControlCompensationField |
  controlActions.RemoveCalculationControlCompensationField |
  controlActions.UpdateRichTextControlContent |
  controlActions.AddCalculationControlCompensationField |

  settingsActions.OpenSettings |
  settingsActions.CloseSettings |
  settingsActions.SaveSettings |
  settingsActions.SaveSettingsSuccess |
  settingsActions.SaveSettingsError |
  settingsActions.UpdateSettingsFontSize |
  settingsActions.UpdateSettingsFontFamily |
  settingsActions.UpdateSettingsChartColor |
  settingsActions.ResetSettings;
