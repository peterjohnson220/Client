import * as statementActions from './statement.actions';
import * as settingsActions from './settings.actions';
import * as controlActions from './control.actions';

export type StatementEditPageActions =
  statementActions.ToggleStatementEditMode |
  statementActions.LoadStatement |
  statementActions.LoadStatementSuccess |
  statementActions.LoadStatementError |
  statementActions.ResetStatement |
  statementActions.SaveStatement |
  statementActions.SaveStatementSuccess |
  statementActions.SaveStatementError |
  statementActions.UpdateEffectiveDate |

  controlActions.UpdateStatementName |
  controlActions.UpdateStatementControlTitle |
  controlActions.UpdateCalculationControlFieldTitle |
  controlActions.UpdateCalculationControlSummaryTitle |
  controlActions.AddCalculationControlCompensationField |
  controlActions.RemoveCalculationControlCompensationField |
  controlActions.UpdateRichTextControlContent |
  controlActions.SaveImageControlImage |
  controlActions.RemoveImageControlImage |

  settingsActions.OpenSettingsPanel |
  settingsActions.CloseSettingsPanel |
  settingsActions.ToggleSettingsPanel |
  settingsActions.SaveSettings |
  settingsActions.SaveSettingsSuccess |
  settingsActions.SaveSettingsError |
  settingsActions.UpdateSettingsFontSize |
  settingsActions.UpdateSettingsFontFamily |
  settingsActions.UpdateSettingsChartColor |
  settingsActions.ResetSettings;
