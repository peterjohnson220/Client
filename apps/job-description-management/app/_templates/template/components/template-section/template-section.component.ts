import { Component, Input, Output, EventEmitter, ViewChildren, QueryList, forwardRef, OnChanges } from '@angular/core';

import { TemplateSection, TemplateControl, TemplateSettings, TemplateSettingsSection } from 'libs/models';

import { TemplateControlComponent } from '../../containers';

@Component({
    selector: 'pf-template-section',
    templateUrl: './template-section.component.html',
    styleUrls: ['./template-section.component.scss']
})
export class TemplateSectionComponent implements OnChanges {

    @Input() section: TemplateSection;
    @Input() readOnly: boolean;
    @Input() templateSettings: TemplateSettings;
    @Input() editingTemplateSettings: boolean;
    @Input() controlTypesLoaded = false;

    @Output() editControlLabelClicked = new EventEmitter();
    @Output() controlDataChangesDetected = new EventEmitter();
    @Output() controlBulkDataChangesDetected = new EventEmitter();
    @Output() controlAdditionalPropertiesChangesDetected = new EventEmitter();
    @Output() controlDataRowAdded = new EventEmitter();
    @Output() controlDataRowDeleted = new EventEmitter();
    @Output() editSectionClicked = new EventEmitter();
    @Output() deleteSectionClicked = new EventEmitter();
    @Output() deleteControlClicked = new EventEmitter();
    @Output() sectionSettingUpdated = new EventEmitter();
    @Output() controlSettingUpdated = new EventEmitter();
    @ViewChildren(forwardRef(() => TemplateControlComponent)) public sectionControls: QueryList<TemplateControlComponent>;

    public hideBody = false;
    private bodyVisibilityBeforeDrag: boolean;
    public sectionSetting: TemplateSettingsSection;

    constructor() {}

    toggleBody() {
        this.hideBody = !this.hideBody;
    }

    hideBodyWhileDragging() {
        this.bodyVisibilityBeforeDrag = this.hideBody;
        this.hideBody = true;
    }

    hideControlBodies() {
        this.sectionControls.map(sc => sc.hideBodyWhileDragging());
    }

    resetControlsBodyVisiblity() {
        this.sectionControls.map(sc => sc.resetBodyVisiblity());
    }

    resetBodyVisiblity() {
        this.hideBody = this.bodyVisibilityBeforeDrag;
    }

    // Edit Button
    editSection() {
        this.editSectionClicked.emit(this.section);
    }

    // Delete Button
    deleteSection() {
        this.deleteSectionClicked.emit(this.section);
    }

    // Events
    handleEditControlLabelClicked(templateControl: TemplateControl) {
        this.editControlLabelClicked.emit(templateControl);
    }

    handleDeleteControlClicked(templateControl: TemplateControl) {
        this.deleteControlClicked.emit(templateControl);
    }

    handleControlDataChangesDetected(dataRowChangeObj: any) {
        this.controlDataChangesDetected.emit(dataRowChangeObj);
    }

    handleControlBulkDataChangesDetected(bulkChangeObj: any) {
        this.controlBulkDataChangesDetected.emit(bulkChangeObj);
    }

    handleAdditionalPropertiesChangesDetected(eventArgs: any) {
        this.controlAdditionalPropertiesChangesDetected.emit(eventArgs);
    }

    handleControlDataRowDeleted(removeDataRowObj: any) {
        this.controlDataRowDeleted.emit(removeDataRowObj);
    }

    handleControlDataRowAdded(addDataRowObj: any) {
        this.controlDataRowAdded.emit(addDataRowObj);
    }
    handleUpdateControlExportSetting(setting: any) {
        this.controlSettingUpdated.emit(setting);
    }
    hideOnExport() {
        this.updateExportSetting(false);
    }

    showOnExport() {
        this.updateExportSetting(true);
    }

    updateExportSetting(checked: boolean) {
        this.sectionSetting.ShowSubHeadingOnExport = checked;
        this.sectionSettingUpdated.emit(this.sectionSetting);
    }

    trackByFn(index: number, control: TemplateControl) {
    return control.Id;
    }

    ngOnChanges(changes: any): void {

        const availableSettings = changes.templateSettings;
        if (availableSettings && availableSettings.currentValue) {

            const sectionSettings = availableSettings.currentValue.Export.Sections
                .filter(settings => settings.Id === this.section.Id)
                .map(control => {
                        return {
                            Id: control.Id,
                            ShowSubHeadingOnExport: control.ShowSubHeadingOnExport
                        };
                    }
                );

            if (sectionSettings.length > 0) {
                this.sectionSetting = sectionSettings[0];
            } else {
                const settings = {
                  Id:  this.section.Id,
                  ShowSubHeadingOnExport: true
              };
              this.sectionSetting = settings;
            }
        }
    }
}
