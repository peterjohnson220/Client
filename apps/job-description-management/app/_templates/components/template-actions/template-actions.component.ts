import { Component, EventEmitter, Input, Output } from '@angular/core';

import { Template } from '../../models';

@Component({
  selector: 'pf-template-actions',
  templateUrl: './template-actions.component.html',
  styleUrls: ['./template-actions.component.scss']
})
export class TemplateActionsComponent {

    @Input() template: Template;
    @Input() editingTemplate: boolean;
    @Input() editingTemplateSettings: boolean;
    @Input() templatePublishing: boolean;

    @Output() publishTemplateClick = new EventEmitter();
    @Output() discardDraftClick = new EventEmitter();
    @Output() addSectionClick = new EventEmitter();
    @Output() editClick = new EventEmitter();
    @Output() assignClick = new EventEmitter();
    @Output() copyClick = new EventEmitter();
    @Output() exportSettingsClick = new EventEmitter();
    @Output() completeExportSettingsClick = new EventEmitter();
    @Output() cancelExportSettingsClick = new EventEmitter();

    constructor() { }

}
