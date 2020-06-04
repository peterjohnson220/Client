import { TemplateSettingsExport } from './template-settings-export.model';

export interface TemplateSettings {
  TemplateId: number;
  CompanyId: number;
  Export: TemplateSettingsExport;
}

export function getTemplateSetting(templateId: number, companyId: number, exportSetting: TemplateSettingsExport): TemplateSettings {
  return {
    TemplateId: templateId,
    CompanyId: companyId,
    Export: exportSetting
  };
}
