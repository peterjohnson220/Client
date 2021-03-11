import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'pf-field-mappings-card',
  templateUrl: './field-mappings-card.component.html',
  styleUrls: ['./field-mappings-card.component.scss']
})
export class FieldMappingCardComponent implements OnChanges {
  @Input() selectedEntities: string[];
  @Input() sourceName: string;
  @Input() targetName: string;
  @Input() provider = '';
  @Input() connectionId: number;
  activeId: string;

  constructor() { }

  ngOnChanges(changes: SimpleChanges): void {
    if (!!changes.selectedEntities && !!this.selectedEntities && !!this.selectedEntities[0]) {
      this.activeId = this.selectedEntities[0].toLowerCase();
    }
  }
}
