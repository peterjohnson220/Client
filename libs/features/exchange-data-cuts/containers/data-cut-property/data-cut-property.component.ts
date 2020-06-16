import {Component, Input, OnInit, OnChanges} from '@angular/core';

@Component({
  selector: 'pf-data-cut-property',
  templateUrl: './data-cut-property.component.html',
  styleUrls: ['./data-cut-property.component.scss']
})
export class DataCutPropertyComponent implements OnInit, OnChanges {

  @Input() value: any;
  @Input() label: string;
  @Input() labelPlural: string;
  @Input() singleValue: boolean;

  currentLabel: string;
  currentValue: string;
  constructor() { }

  ngOnInit() {
  }

  ngOnChanges() {
    this.currentLabel = this.value && (this.value.length === 1 || typeof this.value === 'string') ? this.label : this.labelPlural;
    if (!this.value || this.value.length === 0) {
      this.currentValue = !this.singleValue ? null : 'All';
    } else {
      this.currentValue = !this.singleValue ? this.value.join(', ') : this.value;
    }
  }
}
