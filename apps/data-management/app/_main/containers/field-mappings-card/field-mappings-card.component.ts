import { Component, ViewChild, Input } from '@angular/core';

import { NgbTabset } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'pf-field-mappings-card',
  templateUrl: './field-mappings-card.component.html',
  styleUrls: ['./field-mappings-card.component.scss']
})
export class FieldMappingCardComponent {
  @Input() selectedEntities: string[];
  @ViewChild(NgbTabset, { static: true }) tabSet: NgbTabset;

  constructor() { }
}
