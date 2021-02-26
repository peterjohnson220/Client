import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'pf-field-selection-card',
  templateUrl: './field-selection-card.component.html',
  styleUrls: ['./field-selection-card.component.scss']
})
export class FieldSelectionCardComponent implements OnChanges{
  @Input() selectedEntities: string[];
  @Input() sourceName: string;
  @Input() targetName: string;
  activeId: string;

  constructor() { }

  ngOnChanges(changes: SimpleChanges): void {
    if (!!changes.selectedEntities && !!this.selectedEntities && !!this.selectedEntities[0]) {
      this.activeId = this.selectedEntities[0].toLowerCase();
    }
  }
}
