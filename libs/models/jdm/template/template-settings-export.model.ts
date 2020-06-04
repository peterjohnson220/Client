import { TemplateSettingsSection } from './template-settings-section.model';
import { TemplateSettingsControl } from './template-settings-control.model';

export interface TemplateSettingsExport {
  Sections: TemplateSettingsSection[];
  Controls: TemplateSettingsControl[];
}
