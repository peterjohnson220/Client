import { TemplateSettingsExport } from './template-settings-export.model';

export interface TemplateSettings {
  TemplateId: number;
  CompanyId: number;
  Export: TemplateSettingsExport;
}
