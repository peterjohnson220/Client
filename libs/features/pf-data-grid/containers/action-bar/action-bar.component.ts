import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ViewField } from 'libs/models/payfactors-api';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import * as fromReducer from '../../reducers';
import * as fromActions from '../../actions';

@Component({
  selector: 'pf-action-bar',
  templateUrl: './action-bar.component.html',
  styleUrls: ['./action-bar.component.scss'],
})
export class ActionBarComponent implements OnChanges {

  @Input() pageViewId: string;

  dataFields$: Observable<ViewField[]>;

  testPayMarketData = ['Boston', 'Chicago', 'Los Angeles'];

  constructor(private store: Store<fromReducer.State>) { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['pageViewId']) {
      this.dataFields$ = this.store.select(fromReducer.getFields, changes['pageViewId'].currentValue);
    }
  }

  updateFields(updatedFields: ViewField[]){
    this.store.dispatch(new fromActions.UpdateFields(this.pageViewId, updatedFields));
    this.store.dispatch(new fromActions.LoadData(this.pageViewId));
  }
}
