import * as statementActions from './statement.actions';
import * as settingsActions from './settings.actions';
import * as controlActions from './control.actions';
import * as previewActions from './preview.actions';

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
  statementActions.PageScroll |
  statementActions.GenerateStatementPreview |
  statementActions.GenerateStatementPreviewSuccess |
  statementActions.GenerateStatementPreviewError |
  statementActions.GenerateStatementPreviewComplete |
  statementActions.CalculateRepeatableHeaderContentHeightInPixels |

  controlActions.UpdateStatementName |
  controlActions.UpdateStatementControlTitle |
  controlActions.UpdateCalculationControlFieldTitle |
  controlActions.UpdateCalculationControlSummaryTitle |
  controlActions.AddCalculationControlCompensationField |
  controlActions.RemoveCalculationControlCompensationField |
  controlActions.ReorderCalculationControlCompensationField |
  controlActions.UpdateRichTextControlContent |
  controlActions.UpdateAdditionalPageRichTextControlHeight |
  controlActions.UpdateRichTextControlUdfsInContent |
  controlActions.SaveImageControlImage |
  controlActions.SelectImageControlImage |
  controlActions.RemoveImageControlImage |
  controlActions.GetCompanyUDF |
  controlActions.GetCompanyUDFSuccess |
  controlActions.GetCompanyUDFError |
  controlActions.UpdateActiveRichTextEditorId |

  settingsActions.OpenSettingsPanel |
  settingsActions.CloseSettingsPanel |
  settingsActions.PrepareSaveSettings |
  settingsActions.SaveSettings |
  settingsActions.SaveSettingsSuccess |
  settingsActions.SaveSettingsError |
  settingsActions.UpdateSettingsFontSize |
  settingsActions.UpdateSettingsFontFamily |
  settingsActions.UpdateSettingsColor |
  settingsActions.ToggleDisplaySetting |
  settingsActions.ResetSettings |
  settingsActions.UpdateAdditionalPageSettings |

  previewActions.SearchAssignedEmployees |
  previewActions.SearchAssignedEmployeesSuccess |
  previewActions.SearchAssignedEmployeesError |
  previewActions.GetEmployeeRewardsData |
  previewActions.GetEmployeeRewardsDataError |
  previewActions.GetEmployeeRewardsDataSuccess |
  previewActions.ResetEmployeeRewardsData;
