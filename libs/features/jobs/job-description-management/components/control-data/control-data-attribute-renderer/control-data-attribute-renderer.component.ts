import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

import { ControlDataConfig } from '../../../models';

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
