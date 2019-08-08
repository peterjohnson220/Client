import { Component } from '@angular/core';
import { select, Store} from '@ngrx/store';
import { Observable } from 'rxjs';
import { Field } from '../../models';

import * as fromDataInsightsMainReducer from '../../reducers/index';




@Component({
  selector: 'pf-left-sidebar-existing-fields',
  templateUrl: './left-sidebar-existing-fields.component.html',
  styleUrls: ['./left-sidebar-existing-fields.component.scss']
})
export class LeftSidebarExistingFieldsComponent  {
  existingFieldExpanded = true;
  fields$: Observable<Field[]>;

  constructor(
    private store: Store<fromDataInsightsMainReducer.State>
  ) {
     this.fields$ = this.store.pipe(select(fromDataInsightsMainReducer.getSelectedFields));
  }

  toggleField() {
    this.existingFieldExpanded = !this.existingFieldExpanded;
  }

  trackByFn(index: any, field: Field) {
    return field.DataElementId;
  }

}
