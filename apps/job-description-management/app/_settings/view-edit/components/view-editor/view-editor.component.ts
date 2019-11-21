import { Component, EventEmitter, Input, Output } from '@angular/core';

import { ControlViewToggleObj } from '../../models';

import { JobDescriptionView } from '../../../shared/models';

@Component({
  selector: 'pf-view-editor',
  templateUrl: './view-editor.component.html',
  styleUrls: ['./view-editor.component.scss']
})
export class ViewEditorComponent {
  @Input() templateView: JobDescriptionView;

  @Output() addHiddenElementId: EventEmitter<ControlViewToggleObj> = new EventEmitter();
  @Output() removeHiddenElementId: EventEmitter<ControlViewToggleObj> = new EventEmitter();

  constructor() {}

  handleControlClicked(controlId: number) {
    this.buildAndEmitControlViewToggleObj(controlId, !this.isHiddenControl(controlId));
  }

  isHiddenControl(controlId: number) {
    return this.templateView.HiddenElementIds.some(h => h === controlId);
  }

  private buildAndEmitControlViewToggleObj(controlId: number, added: boolean) {
    const controlViewToggleObj = {
      ViewName: this.templateView.Name,
      TemplateId: this.templateView.TemplateId,
      ControlId: controlId
    };

    added
      ? this.addHiddenElementId.emit(controlViewToggleObj)
      : this.removeHiddenElementId.emit(controlViewToggleObj);
  }
}
