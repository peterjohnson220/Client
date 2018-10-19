import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';

import * as fromPriceJobActions from '../../../_job-search/actions/price-job.actions';
import * as fromPriceJob from '../../reducers';
import { Location } from '../../models/location';

@Component({
  selector: 'pf-price-job',
  templateUrl: './price-job.component.html',
  styleUrls: ['./price-job.component.scss']
})
export class PriceJobComponent implements OnInit {

  locationSearchTerm: string;
  selectedLocation$: Observable<Location>;
  locationResults$: Observable<Location[]>;

  constructor(private store: Store<fromPriceJob.State>) {
    this.selectedLocation$ = store.select(fromPriceJob.selectSelectedLocation);
    this.locationResults$ = store.select(fromPriceJob.selectLocationResults);
  }

  ngOnInit() {
    this.store.dispatch(new fromPriceJobActions.LocationSearchTermChanged({ searchTerm: '' }));
  }

  onLocationSearchTermChange(searchTerm: string) {
    this.store.dispatch(new fromPriceJobActions.LocationSearchTermChanged({ searchTerm }));
  }

  onLocationSelectionChange(location: Location) {
    this.store.dispatch(new fromPriceJobActions.LocationSelectionChanged({ location }));
  }
}
