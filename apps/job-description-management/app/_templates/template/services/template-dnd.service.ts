import { Injectable, QueryList } from '@angular/core';

import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs/Subscription';
import { DragulaService } from 'ng2-dragula';

import { Template, TemplateControl, ControlType } from 'libs/models';
import { DragulaHelperService } from 'libs/core';

import { TemplateSectionComponent, UpsertControlModalComponent } from '../components';
import * as fromTemplateActions from '../actions';
import * as fromTemplateReducers from '../reducers';
import * as fromJdmSharedReducer from '../../../shared/reducers';
import { TemplateService } from './template.service';
import { JobDescriptionManagementService } from '../../../shared';

@Injectable()
export class TemplateDnDService {

    private template: Template;
    private controlTypes: ControlType[];

    private sectionDropSubscription: Subscription;
    private controlDropSubscription: Subscription;
    private sectionDragSubscription: Subscription;
    private controlDragSubscription: Subscription;
    private sectionCancelSubscription: Subscription;
    private controlCancelSubscription: Subscription;

    private templateSections: QueryList<TemplateSectionComponent>;

    constructor(
        private dragulaService: DragulaService,
        private templateService: TemplateService,
        private jobDescriptionManagementService: JobDescriptionManagementService,
        private store: Store<fromTemplateReducers.State>
    ) { }

    initTemplatePageDnD(labelControlTypeComponent: UpsertControlModalComponent) {

        // Drop
        this.sectionDropSubscription = this.dragulaService.drop('template-section-bag').subscribe((value) => {
            const dropInfo = DragulaHelperService.getDropModel(value);
            const targetIndex = Array.from(dropInfo.target.children).indexOf(dropInfo.target.querySelector('.template-section.gu-transit'));
                    const sourceAndTargetIndex = DragulaHelperService.templatePageReorder(dropInfo, targetIndex);
                    this.moveSection(sourceAndTargetIndex.sourceIndex, sourceAndTargetIndex.targetIndex);
        });

        this.controlDropSubscription = this.dragulaService.drop('control-bag').subscribe((value) => {
            const dropInfo = DragulaHelperService.getDropModel(value);
            if (dropInfo.target != null) {
                if (dropInfo.target.className.includes('section-control-container') && dropInfo.element.className.includes('control-drag-handle')) {
                    this.handleDroppedControlFromType(dropInfo, labelControlTypeComponent);
                } else {
                    this.handleDroppedControlFromSection(dropInfo);
                }
            }

            this.resetControlsBodyVisiblity();
        });

        // Drag
        this.sectionDragSubscription = this.dragulaService.drag('template-section-bag').subscribe((value) => {
            this.hideSectionBodies();
        });

        this.controlDragSubscription = this.dragulaService.drag('control-bag').subscribe((value) => {
            this.hideControlBodies();
        });


        // Cancel
        this.sectionCancelSubscription = this.dragulaService.cancel('template-section-bag').subscribe((value) => {
            this.resetSectionsBodyVisibility();
        });
        this.controlCancelSubscription = this.dragulaService.cancel('control-bag').subscribe((value) => {
            this.resetControlsBodyVisiblity();
        });

        // Bag Options
        this.dragulaService.createGroup('template-section-bag', {
            moves: function (el, container, handle) {
                return  typeof handle.className === 'string' ? handle.className.includes('section-drag-handle') : false;
            }
        });

        this.dragulaService.createGroup('control-bag', {
            copy: function (el, source) {
                return source.className === 'control-type-container';
            },
            accepts: function (el, target) {
                return target.className !== 'control-type-container';
            },
            moves: function (el, container, handle) {
                return typeof handle.className === 'string' ? handle.className.includes('control-drag-handle') : false;
            }
        });
    }

    destroyTemplatePageDnD() {
        this.dragulaService.destroy('template-section-bag');
        this.dragulaService.destroy('control-bag');
        this.sectionDropSubscription.unsubscribe();
        this.controlDropSubscription.unsubscribe();
        this.sectionDragSubscription.unsubscribe();
        this.controlDragSubscription.unsubscribe();
        this.sectionCancelSubscription.unsubscribe();
        this.controlCancelSubscription.unsubscribe();
    }

    setTemplate(template: Template) {
        this.template = template;
    }

    setTemplateSections(templateSections: QueryList<TemplateSectionComponent>) {
        this.templateSections = templateSections;
    }

    setControlTypes(controls: ControlType[]) {
        this.controlTypes = controls;
    }

    // Private Methods
    private addControlToSection(sectionId: number, controlType: ControlType, label: string, index: number, additionalProperties: any) {
        const templateControl: TemplateControl = {
            Id: this.templateService.generateEpochId(),
            SectionId: sectionId,
            Label: label,
            Type: controlType.Type,
            EditorType: controlType.EditorType,
            ControlVersion: controlType.ControlVersion,
            Data: controlType.EditorType !== 'SmartList' ?  [this.jobDescriptionManagementService.createDataRow(controlType.Attributes)] : []
        };

        if (additionalProperties != null) {
            templateControl.AdditionalProperties = additionalProperties;
        }
        this.store.dispatch(new fromTemplateActions.AddControlToSection({templateControl: templateControl, index: index}));
        this.saveTemplate();

        return templateControl.Id;
    }

    private getControlAddAtIndex(dropModel: any) {
        const element = dropModel.target.querySelector('.gu-transit');
        const nextControl = element ? element.nextElementSibling : null;
        return nextControl ? nextControl.dataset.index : null;
    }

    private handleDroppedControlFromSection(dropModel: any) {
        const droppedFromSectionId = parseInt(dropModel.source.dataset.sectionId, 10);
        const droppedIntoSectionId = parseInt(dropModel.target.dataset.sectionId, 10);
        const targetIndex = Array.from(dropModel.target.children).indexOf(dropModel.target.querySelector('.section-control.gu-transit'));

        if (droppedFromSectionId === droppedIntoSectionId) {
            const sourceAndTargetIndex = DragulaHelperService.templatePageReorder(dropModel, targetIndex);
            this.moveControl(droppedFromSectionId, sourceAndTargetIndex.sourceIndex, sourceAndTargetIndex.targetIndex);
        } else {
            const controlId = dropModel.element.dataset.controlId;
            const addAtIndex = this.getControlAddAtIndex(dropModel);

            const control = this.template.Sections.find(s => s.Id === droppedFromSectionId).Controls.find(c => c.Id === controlId);
            this.moveControlToSection(control, droppedIntoSectionId, addAtIndex);
        }
    }

    private handleDroppedControlFromType(dropModel: any, labelControlTypeComponent: UpsertControlModalComponent) {
        const addAtIndex = this.getControlAddAtIndex(dropModel);
        const controlVerion = parseInt(dropModel.element.dataset.controlVersion, 10);
        if (this.controlTypes) {
            const control = this.controlTypes.find(c => c.Type === dropModel.element.dataset.controlType &&
                                                        c.ControlVersion === controlVerion);
            labelControlTypeComponent.open(control.Name, (controlName, additionalProperties) => {
                this.addControlToSection(dropModel.target.dataset.sectionId, control, controlName, addAtIndex, additionalProperties);
            }, false, null, control);
        }

        const droppedControl = document.querySelector('.section-control-container[data-section-id="' + dropModel.target.dataset.sectionId + '"] .control-type');
        if (droppedControl) {
        droppedControl.parentNode.removeChild(droppedControl);
        }
    }

    private hideControlBodies() {
        this.templateSections.forEach(ts => ts.hideControlBodies());
    }

    private hideSectionBodies() {
        this.templateSections.forEach(ts => ts.hideBodyWhileDragging());
    }

    private moveControl(sectionId: number, oldIndex: number, newIndex: number) {
        this.store.dispatch(new fromTemplateActions.MoveControl({sectionId, oldIndex, newIndex}));
        this.saveTemplate();
    }

    private moveControlToSection(templateControl: TemplateControl, droppedIntoSectionId: number, index: number) {
        this.store.dispatch(new fromTemplateActions.MoveControlToSection({templateControl, newSectionId: droppedIntoSectionId, index}));
        this.saveTemplate();
    }

    private moveSection(oldIndex: number, newIndex: number) {
        this.store.dispatch(new fromTemplateActions.MoveSection({oldIndex, newIndex}));
        this.resetSectionsBodyVisibility();
        this.saveTemplate();
    }

    private resetControlsBodyVisiblity() {
        this.templateSections.forEach(ts => ts.resetControlsBodyVisiblity());
    }

    private resetSectionsBodyVisibility() {
        this.templateSections.forEach(ts => ts.resetBodyVisiblity());
    }

    private saveTemplate() {
        this.store.dispatch(new fromTemplateActions.SaveTemplate({template: this.template}));
    }
}
