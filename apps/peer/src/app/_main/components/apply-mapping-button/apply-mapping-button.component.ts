import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'pf-apply-mapping-button',
  templateUrl: './apply-mapping-button.component.html',
  styleUrls: ['./apply-mapping-button.component.scss']
})
export class ApplyMappingButtonComponent {
  @Input() mapped: boolean;
  @Input() applyingMapping: boolean;
  @Input() selectedMapping: boolean;
  @Input() applyingMappingError: boolean;

  @Output() applyMapping = new EventEmitter();

  constructor() {}

  handleApplyMappingClicked() {
    this.applyMapping.emit();
  }
}
