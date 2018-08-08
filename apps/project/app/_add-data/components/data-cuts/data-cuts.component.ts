import { Component, Input, Output, EventEmitter } from '@angular/core';
import { SurveyDataCut } from '../../models';

@Component({
  selector: 'pf-data-cuts',
  templateUrl: './data-cuts.component.html',
  styleUrls: ['./data-cuts.component.scss']
})
export class DataCutsComponent {

  @Input() dataCuts: SurveyDataCut[];
  @Input() currencyCode: string;
  @Output() dataCutSelected: EventEmitter<{dataCutId: number}> = new EventEmitter();
  constructor() {}


  toggleCutSelection(dataCut: SurveyDataCut): void {
    this.dataCutSelected.emit({dataCutId: dataCut.SurveyDataId});
  }


}
