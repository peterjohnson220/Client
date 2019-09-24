import {Component, EventEmitter, Input, OnChanges, Output, SimpleChanges} from '@angular/core';
import { PfDataGridFieldModel } from 'libs/models';
import { Observable } from 'rxjs';
import { DataGridService } from '../../services/data-grid.service';
import { Store } from '@ngrx/store';
import * as fromReducer from '../../reducers';
import * as fromActions from '../../actions';

@Component({
  selector: 'pf-action-bar',
  templateUrl: './action-bar.component.html',
  styleUrls: ['./action-bar.component.scss'],
  providers: [DataGridService]
})
export class ActionBarComponent implements OnChanges {

  @Input() entity: string;
  @Output() onFilterSidebarToggle = new EventEmitter<boolean>();

  dataFields$: Observable<PfDataGridFieldModel[]>;

  testPayMarketData = ['Boston', 'Chicago', 'Los Angeles'];
  displayFilterSidebar = false;

  constructor(private store: Store<fromReducer.State>) { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['entity']) {
      this.dataFields$ = this.store.select(fromReducer.getFields, changes['entity'].currentValue);
    }
  }

  updateFields(updatedFields: PfDataGridFieldModel[]) {
    this.store.dispatch(new fromActions.UpdateFields(this.entity, updatedFields));
  }

  toggleFilterPanel() {
    this.displayFilterSidebar = !this.displayFilterSidebar;
    this.onFilterSidebarToggle.emit(this.displayFilterSidebar);
  }
}
