import {Component, Input, OnInit, OnChanges, SimpleChanges} from '@angular/core';

@Component({
  selector: 'pf-data-cut-summary-property',
  templateUrl: './data-cut-summary-property.component.html',
  styleUrls: ['./data-cut-summary-property.component.scss']
})
export class DataCutSummaryPropertyComponent implements OnInit, OnChanges {

  @Input() value: any;
  @Input() label: string;
  @Input() labelPlural: string;
  @Input() singleValue = false;

  currentLabel: string;
  currentValue: string;
  constructor() { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    this.currentLabel = (!this.value || this.value.length === 1 || typeof this.value === 'string') ? this.label : this.labelPlural;
    if (!this.value || this.value.length === 0) {
      this.currentValue = this.singleValue ? null : 'All';
    } else {
      this.currentValue = Array.isArray(this.value) ? this.value.join(', ') : this.value;
    }
  }
}
