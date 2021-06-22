import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

import * as quill from 'quill';

import { CustomColor } from 'libs/core/helpers/quill-colorblot-helper';

import { ControlDataConfig } from '../../../models';

const Quill = quill.default || quill;
CustomColor.blotName = 'customColor';
CustomColor.tagName = 'FONT';
Quill.register(CustomColor, true);


@Component({
  selector: 'pf-control-data-attribute-renderer',
  templateUrl: './control-data-attribute-renderer.component.html',
  styleUrls: ['./control-data-attribute-renderer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class ControlDataAttributeRendererComponent {
  @Input() editable: boolean;
  @Input() checkInheritedData: boolean;
  @Input() dataRow: any;
  @Input() attribute: any;

  @Output() dataChangesDetected = new EventEmitter();

  richTextQuillConfig = ControlDataConfig.richTextQuillConfig;

  constructor(
    public sanitizer: DomSanitizer
  ) {
  }

  handleDataChangesDetected(dataRowId: number, attribute: any, newValue: any) {
    this.dataChangesDetected.emit({dataRowId, attribute, newValue});
  }

  displayValueByKey(selection: any) {
    for (const choice of this.attribute.Choices) {
      if (choice.value.trim() === selection.trim()) {
        return choice.display;
      }
    }
    return '';
  }

  trackByChoiceValue(index: number, choice: {display: string, value: string}) {
    return choice.value;
  }
}
