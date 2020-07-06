import { Component, Input, Output, EventEmitter } from '@angular/core';

import { Observable } from 'rxjs';

import { AsyncStateObj } from 'libs/models';
import { DataViewFieldDataType, BasicDataViewField } from 'libs/models/payfactors-api';

@Component({
  selector: 'pf-basic-data-grid',
  templateUrl: './basic-data-grid.component.html',
  styleUrls: ['./basic-data-grid.component.scss']
})
export class BasicDataGridComponent {
  @Input() dataAsync$: Observable<AsyncStateObj<any[]>>;
  @Input() fields$: Observable<BasicDataViewField[]>;
  @Input() loadingMoreData$: Observable<boolean>;
  @Output() scrollBottom: EventEmitter<any> = new EventEmitter();

  dataViewFieldDataType = DataViewFieldDataType;

  handleScrollBottom(): void {
    this.scrollBottom.emit();
  }

  trackByFn(index: any, field: BasicDataViewField) {
    return field.KendoGridField;
  }
}
