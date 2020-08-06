import {Component, Input, OnInit, ViewChild} from '@angular/core';

import {NgbTabset} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'pf-field-selection-card',
  templateUrl: './field-selection-card.component.html',
  styleUrls: ['./field-selection-card.component.scss']
})
export class FieldSelectionCardComponent implements OnInit {
  @Input() selectedEntities: string[];
  @Input() sourceName: string;
  @Input() targetName: string;
  @ViewChild(NgbTabset, { static: true }) tabSet: NgbTabset;

  constructor() { }

  ngOnInit(): void {
  }
}
