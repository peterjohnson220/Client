import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import * as cloneDeep from 'lodash.clonedeep';

import { JobDescriptionView } from '../../../shared/models';
import { TemplateSettingsSection } from 'libs/models';
import { ElementViewToggleObj } from '../../models';

@Component({
  selector: 'pf-view-editor',
  templateUrl: './view-editor.component.html',
  styleUrls: ['./view-editor.component.scss']
})
export class ViewEditorComponent implements OnInit {
  @Input() templateView: JobDescriptionView;

  @Output() addHiddenElementId: EventEmitter<ElementViewToggleObj> = new EventEmitter();
  @Output() removeHiddenElementId: EventEmitter<ElementViewToggleObj> = new EventEmitter();
  @Output() addHiddenControlNameElementId: EventEmitter<ElementViewToggleObj> = new EventEmitter();
  @Output() removeHiddenControlNameElementId: EventEmitter<ElementViewToggleObj> = new EventEmitter();
  @Output() addHiddenSectionSubheadingElementId: EventEmitter<ElementViewToggleObj> = new EventEmitter();
  @Output() removeHiddenSectionSubheadingElementId: EventEmitter<ElementViewToggleObj> = new EventEmitter();


  public sectionSetting: TemplateSettingsSection;
  public templateViewCopy: JobDescriptionView;

  constructor() {}

  ngOnInit() {
    this.templateViewCopy = cloneDeep(this.templateView);
  }

  handleControlClicked(controlId: number) {
    this.buildAndEmitElementViewToggleObj(controlId, !this.isHiddenControl(controlId));
  }

  isHiddenControl(controlId: number) {
    return this.templateViewCopy.HiddenElementIds.some(h => h === controlId);
  }

  isHiddenControlName(controlId: number) {
    return this.templateViewCopy.HiddenControlNameElementIds.some(h => h === controlId);
  }

  isHiddenSectionSubheading(sectionId: number) {
    return this.templateViewCopy.HiddenSubHeadingElementIds.some(h => h === sectionId);
  }

  getControlNameIcon (controlId: number) {
    if (this.isHiddenControlName(controlId)) { return 'eye-slash'; } else { return 'eye'; }
  }

  getSectionSubheadIcon (sectionId: number) {
    if (this.isHiddenSectionSubheading(sectionId)) { return 'eye-slash'; } else { return 'eye'; }
  }

  private buildAndEmitElementViewToggleObj(controlId: number, added: boolean) {
    const elementViewToggleObj = {
      ViewName: this.templateViewCopy.Name,
      TemplateId: this.templateViewCopy.TemplateId,
      ElementId: controlId
    };

    added
      ? this.addHiddenElementId.emit(elementViewToggleObj)
      : this.removeHiddenElementId.emit(elementViewToggleObj);
  }

  private buildAndEmitControlNameViewToggleObj(controlId: number, added: boolean) {
    const elementViewToggleObj = {
      ViewName: this.templateViewCopy.Name,
      TemplateId: this.templateViewCopy.TemplateId,
      ElementId: controlId
    };

    added
      ? this.addHiddenControlNameElementId.emit(elementViewToggleObj)
      : this.removeHiddenControlNameElementId.emit(elementViewToggleObj);
  }

  private buildAndEmitSectionSubheaderToggleObj(sectionId: number, added: boolean) {
    const elementViewToggleObj = {
      ViewName: this.templateViewCopy.Name,
      TemplateId: this.templateViewCopy.TemplateId,
      ElementId: sectionId
    };

    added
      ? this.addHiddenSectionSubheadingElementId.emit(elementViewToggleObj)
      : this.removeHiddenSectionSubheadingElementId.emit(elementViewToggleObj);
  }

  toggleControlName(controlId: number) {
    const index = this.templateViewCopy.HiddenControlNameElementIds.findIndex(h => h === controlId);
    if (index >= 0) {
      this.templateViewCopy.HiddenControlNameElementIds.splice(index, 1);
      this.buildAndEmitControlNameViewToggleObj(controlId, false);
    } else {
      this.templateViewCopy.HiddenControlNameElementIds.push(controlId);
      this.buildAndEmitControlNameViewToggleObj(controlId, true);
    }
  }

  toggleSubheading(sectionId: number) {
    const index = this.templateViewCopy.HiddenSubHeadingElementIds.findIndex(h => h === sectionId);
    if (index >= 0) {
      this.templateViewCopy.HiddenSubHeadingElementIds.splice(index, 1);
      this.buildAndEmitSectionSubheaderToggleObj(sectionId, false);
    } else {
      this.templateViewCopy.HiddenSubHeadingElementIds.push(sectionId);
      this.buildAndEmitSectionSubheaderToggleObj(sectionId, true);
    }
  }
}
