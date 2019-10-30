import {Component, Input, OnChanges, SimpleChanges, TemplateRef} from '@angular/core';
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

  @Input() showColumnChooser = true;
  @Input() showFilterChooser = true;
  @Input() allowExport = true;
  @Input() pageViewId: string;
  @Input() globalFilterAlignment: string;
  @Input() globalActionsTemplate: TemplateRef<any>;

  dataFields$: Observable<ViewField[]>;
  globalFilters$: Observable<ViewField[]>;
  constructor(private store: Store<fromReducer.State>) { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['pageViewId']) {
      this.dataFields$ = this.store.select(fromReducer.getFields, changes['pageViewId'].currentValue);
      this.globalFilters$ = this.store.select(fromReducer.getGlobalFilters, changes['pageViewId'].currentValue);
    }
  }

  updateFields(updatedFields: ViewField[]) {
    this.store.dispatch(new fromActions.UpdateFields(this.pageViewId, updatedFields));
    this.store.dispatch(new fromActions.LoadData(this.pageViewId));
  }
}
