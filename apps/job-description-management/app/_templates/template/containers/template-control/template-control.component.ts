import { Component, Input, Output, EventEmitter, OnInit, ChangeDetectionStrategy, OnChanges, OnDestroy } from '@angular/core';

import { Store } from '@ngrx/store';
import { Subject } from 'rxjs/Subject';
import { skip } from 'rxjs/operators';
import { Subscription } from 'rxjs';

import { TemplateControl, TemplateSettings, TemplateSettingsControl, ControlType } from 'libs/models';

import * as fromJdmSharedReducer from 'libs/features/job-description-management/reducers';

@Component({
    selector: 'pf-template-control',
    templateUrl: './template-control.component.html',
    styleUrls: ['./template-control.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TemplateControlComponent implements OnInit, OnChanges, OnDestroy {

    @Input() templateControl: TemplateControl;
    @Input() readOnly: boolean;
    @Input() templateSettings: TemplateSettings;
    @Input() editingTemplateSettings: boolean;
    @Input() controlTypesLoaded: boolean;

    @Output() editControlLabelClicked = new EventEmitter();
    @Output() deleteControlClicked = new EventEmitter();
    @Output() dataChangesDetected = new EventEmitter();
    @Output() bulkDataChangesDetected = new EventEmitter();
    @Output() additionalPropertiesChangesDetected = new EventEmitter();
    @Output() dataRowDeleted = new EventEmitter();
    @Output() controlSettingUpdated = new EventEmitter();
    @Output() dataRowAdded = new EventEmitter();

    public hideBody = false;
    public controlType: ControlType;
    public controlSetting: TemplateSettingsControl;
    private bodyVisibilityBeforeDrag: boolean;
    private changesSubject: Subject<any>;
    private bulkChangesSubject: Subject<any>;

    private controlTypeSubscription: Subscription;

    constructor(private sharedJdmStore: Store<fromJdmSharedReducer.State>) {
        this.changesSubject = new Subject();
        this.bulkChangesSubject = new Subject();
    }

    toggleBody() {
        this.hideBody = !this.hideBody;
    }

    addDataRow(triggerSave: boolean) {
        this.dataRowAdded.emit(
            {
                control: this.templateControl,
                attributes: this.controlType.Attributes[0],
                save: triggerSave
            });
    }

    hideBodyWhileDragging() {
        this.bodyVisibilityBeforeDrag = this.hideBody;
        this.hideBody = true;
    }

    resetBodyVisiblity() {
        this.hideBody = this.bodyVisibilityBeforeDrag;
    }

    deleteControl() {
        this.deleteControlClicked.emit(this.templateControl);
    }

    editControlLabel() {
        this.editControlLabelClicked.emit(this.templateControl);
    }

    // Events
    handledDataRowDeleted(id: number) {
        this.dataRowDeleted.emit({ control: this.templateControl, dataRowId: id });
    }

    handleDataChangesDetected(dataRowChangeObj: any) {
        this.changesSubject.next({ control: this.templateControl, change: dataRowChangeObj });
    }

    handleBulkDataChangesDetected(bulkData: string[]) {
        this.bulkChangesSubject.next({ control: this.templateControl, attributes: this.controlType.Attributes, bulkData: bulkData });
    }

    hideOnExport() {
        this.updateExportSetting(false);
    }

    showOnExport() {
        this.updateExportSetting(true);
    }

    handleAdditionalPropertiesChangesDetected(additionalProperties: object) {
        this.additionalPropertiesChangesDetected.emit({ control: this.templateControl, additionalProperties: additionalProperties });
    }

    updateExportSetting(checked: boolean) {
        this.controlSetting.ShowLabelOnExport = checked;
        this.controlSettingUpdated.emit(this.controlSetting);
    }

    // Lifecycle
    ngOnInit() {
      this.controlTypeSubscription = this.sharedJdmStore.select(fromJdmSharedReducer.getControlTypes).subscribe((controlTypes) => {
        this.controlType = controlTypes.find(ct => ct.Type === this.templateControl.Type && ct.ControlVersion === this.templateControl.ControlVersion );

        if (this.controlType) {

          this.watchForControlDataChanges();

          if (!this.templateControl.Data.length && this.controlType.EditorType !== 'SmartList') {
            this.addDataRow(false);
          }

        }
      });

    }

    ngOnDestroy() {
      this.controlTypeSubscription.unsubscribe();
    }

    ngOnChanges(changes: any): void {

        const templateSettings = changes.templateSettings;
        if (templateSettings && templateSettings.currentValue) {

            const controlSettings = templateSettings.currentValue.Export.Controls
                .filter(settings => settings.Id === this.templateControl.Id)
                .map(control => {
                        return {
                            Id: control.Id,
                            ShowLabelOnExport: control.ShowLabelOnExport
                        };
                    }
                );

            if (controlSettings.length > 0) {
                this.controlSetting = controlSettings[0];
            } else {
                const settings = {
                Id: this.templateControl.Id,
                ShowLabelOnExport: true
            };
            this.controlSetting = settings;
            }
        }

        const editingTemplateSettingsStatus = changes.editingTemplateSettings;
        if (editingTemplateSettingsStatus && editingTemplateSettingsStatus.currentValue) {
            this.hideBody = true;
        }

        if (changes.readOnly) {
            if (!this.templateControl.Data.length && this.controlType.EditorType !== 'SmartList') {
                this.addDataRow(false);
            }
        }
    }
    // Private Methods
    private watchForControlDataChanges() {
        const RTEWithDataCount = this.getRTEWithDataCount();

        const controlDataChanges$ = RTEWithDataCount > 0 ? this.changesSubject.pipe(skip(RTEWithDataCount)) : this.changesSubject;
        const bulkControlDataChanges$ = this.bulkChangesSubject.pipe(skip(this.templateControl.Data.length ? 1 : 0));

        controlDataChanges$.subscribe(dataRowChangeObj => this.dataChangesDetected.emit(dataRowChangeObj));
        bulkControlDataChanges$.subscribe(bulkDataChangeObj => this.bulkDataChangesDetected.emit(bulkDataChangeObj));
    }

    private getRTEWithDataCount() {
        let rteCount = 0;

        this.templateControl.Data.forEach(dataRow => {
            this.controlType.Attributes.forEach(a => {
                (a.Type === 'RichText' || a.Type === 'Textarea') && !!dataRow[a.Name] ? rteCount += 1 : rteCount = rteCount;
            });
        });

        return rteCount;
    }
}
