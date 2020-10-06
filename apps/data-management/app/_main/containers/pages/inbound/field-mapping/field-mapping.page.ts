import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import isEmpty from 'lodash/isEmpty';

import { LoaderSetting } from 'libs/models';

import * as fromFieldMappingActions from '../../../../actions/field-mapping.actions';
import * as fromHrisConnectionActions from '../../../../actions/hris-connection.actions';
import * as fromDataManagementMainReducer from '../../../../reducers';
import { ConnectionSummary } from '../../../../models';


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
  loaderSettings$: Observable<LoaderSetting[]>;

  connectionSummarySub: Subscription;
  loaderSettingsSubscription: Subscription;

  selectedEntities: string[];
  workflowComplete: boolean;
  connectionSummary: ConnectionSummary;

  constructor(private store: Store<fromDataManagementMainReducer.State>, private router: Router) {
  }

  ngOnInit() {
    this.fieldMappingPageLoading$ = this.store.select(fromDataManagementMainReducer.getFieldMappingPageLoading);
    this.fieldMappingPageLoadingError$ = this.store.select(fromDataManagementMainReducer.getFieldMappingPageLoadingError);
    this.canSaveMappings$ = this.store.select(fromDataManagementMainReducer.canSaveMappings);
    this.savingMappings$ = this.store.select(fromDataManagementMainReducer.savingMappings);
    this.errorSavingMapping$ = this.store.select(fromDataManagementMainReducer.savingMappingsError);
    this.loaderSettings$ = this.store.select(fromDataManagementMainReducer.getLoaderSettings);

    this.store.dispatch(new fromHrisConnectionActions.GetHrisConnectionSummary());
    this.connectionSummarySub = this.store.select(fromDataManagementMainReducer.getHrisConnectionSummary)
    .pipe(filter((v) => !!v)).subscribe((connectionSummary) => {
      this.connectionSummary = connectionSummary;
      this.workflowComplete = connectionSummary.hasConnection;
      if (!connectionSummary.hasConnection && isEmpty(connectionSummary.selectedEntities)) {
        return this.router.navigate(['/']);
      }
      this.selectedEntities = connectionSummary.selectedEntities;
      return [
        this.store.dispatch(new fromFieldMappingActions.InitFieldMappingCard(this.selectedEntities))
      ];
    });

    this.loaderSettingsSubscription = this.loaderSettings$.pipe(filter((v) => !!v))
    .subscribe(v => {
      if (v.length > 0) {
        const isEmployeeFullReplace = v.find(ls => ls.KeyName === 'IsEmployeesFullReplace')?.KeyValue === 'true';
        const isStructureMappingsFullReplace = v.find(ls => ls.KeyName === 'IsStructureMappingsFullReplace')?.KeyValue === 'true';
        this.store.dispatch(new fromHrisConnectionActions.SetFullReplaceMode({
          employeeFullReplace: isEmployeeFullReplace,
          structureMappingsFullReplace: isStructureMappingsFullReplace
        }));
      }
    });
  }

  ngOnDestroy() {
    this.connectionSummarySub.unsubscribe();
  }

  saveMappings() {
    this.store.dispatch(new fromFieldMappingActions.TrySaveMapping());
  }
}
