import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { isEmpty } from 'lodash';

import * as fromFieldMappingActions from '../../../actions/field-mapping.actions';
import * as fromHrisConnectionActions from '../../../actions/hris-connection.actions';
import * as fromDataManagementMainReducer from '../../../reducers';


@Component({
  selector: 'pf-field-mapping-page',
  templateUrl: './field-mapping.page.html',
  styleUrls: ['./field-mapping.page.scss']
})
export class FieldMappingPageComponent implements OnInit, OnDestroy {

  fieldMappingPageLoading$: Observable<boolean>;
  fieldMappingPageLoadingError$: Observable<boolean>;
  canSaveMappings$: Observable<boolean>;
  errorSavingMapping$: Observable<boolean>;
  savingMappings$: Observable<boolean>;

  connectionSummarySub: Subscription;

  selectedEntities: string[];
  workflowComplete: boolean;

  constructor(private store: Store<fromDataManagementMainReducer.State>, private router: Router) {
  }

  ngOnInit() {
    this.fieldMappingPageLoading$ = this.store.select(fromDataManagementMainReducer.getFieldMappingPageLoading);
    this.fieldMappingPageLoadingError$ = this.store.select(fromDataManagementMainReducer.getFieldMappingPageLoadingError);
    this.canSaveMappings$ = this.store.select(fromDataManagementMainReducer.canSaveMappings);
    this.savingMappings$ = this.store.select(fromDataManagementMainReducer.savingMappings);
    this.errorSavingMapping$ = this.store.select(fromDataManagementMainReducer.savingMappingsError);

    this.store.dispatch(new fromHrisConnectionActions.GetHrisConnectionSummary());
    this.connectionSummarySub = this.store.select(fromDataManagementMainReducer.getHrisConnectionSummary)
    .pipe(filter((v) => !!v)).subscribe((connectionSummary) => {
      this.workflowComplete = connectionSummary.hasConnection;
      if (!connectionSummary.hasConnection && isEmpty(connectionSummary.selectedEntities)) {
        return this.router.navigate(['/']);
      }
      this.selectedEntities = connectionSummary.selectedEntities;
      return this.store.dispatch(new fromFieldMappingActions.InitFieldMappingCard(this.selectedEntities));
    });
  }

  ngOnDestroy() {
    this.connectionSummarySub.unsubscribe();
  }

  saveMappings() {
    this.store.dispatch(new fromFieldMappingActions.TrySaveMapping());
  }
}
