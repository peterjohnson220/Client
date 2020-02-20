import { Component, Input, EventEmitter, Output, OnInit } from '@angular/core';

import { FilterOperator, IsTrueFalse } from '../../../models';

@Component({
  selector: 'pf-bit-filter',
  templateUrl: './bit-filter.component.html',
  styleUrls: [ './bit-filter.component.scss' ]
})
export class BitFilterComponent implements OnInit {
  @Input() value: string;
  @Input() selectedOperator: FilterOperator;
  @Output() selectedValueChanged: EventEmitter<string[]> = new EventEmitter<string[]>();

  operators = [ IsTrueFalse ];
  values = [ 'true', 'false' ];

  ngOnInit(): void {
    if (!this.value) {
      this.value = this.values[0];
      this.selectedOperator = this.operators[0];
      this.selectedValueChanged.emit([ this.value ]);
    }
  }

  handleSelectedValueChanged(value: string): void {
    this.selectedValueChanged.emit([ value ]);
  }
}
