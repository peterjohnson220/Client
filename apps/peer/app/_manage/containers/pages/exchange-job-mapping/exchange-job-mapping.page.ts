import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { select, Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { PageChangeEvent } from '@progress/kendo-angular-grid';

import { GridTypeEnum } from 'libs/models/common';
import { ExchangeJobMapping, ExchangeRequestTypeEnum } from 'libs/models/peer';
import { UserContext } from 'libs/models';
import { CompanyJob } from 'libs/models/company';
import {Permissions} from 'libs/constants';
import { CompanySecurityApiService } from 'libs/data/payfactors-api/security/company-security-api.service';
import { ExchangeJobMappingService } from '../../../services';
import { SettingsService } from 'libs/state/app-context/services';
import { CompanySettingsEnum } from 'libs/models/company';
import { InputDebounceComponent } from 'libs/forms/components/input-debounce';

import * as fromExchangeJobMappingGridActions from '../../../actions/exchange-job-mapping-grid.actions';
import * as fromExchangeRequestActions from '../../../../shared/actions/exchange-request.actions';
import * as fromGridActions from 'libs/core/actions/grid.actions';
import * as companyJobsActions from '../../../actions/company-jobs.actions';
import * as fromPeerManagementReducer from '../../../reducers';
import * as fromRootState from 'libs/state/state';
import * as fromImportRequestActions from '../../../actions/import.actions';

@Component({
    selector: 'pf-exchange-job-mapping-page',
    templateUrl: './exchange-job-mapping.page.html',
    styleUrls: ['./exchange-job-mapping.page.scss']
})
export class ExchangeJobMappingPageComponent implements OnInit, OnDestroy {
    @ViewChild('companyJobsSearchComponent', { static: true }) public companyJobsSearchComponent: InputDebounceComponent;

    exchangeId: number;
    showCompanyJobs: boolean;
    companyJobsSearchTerm: string;

    collapse = false;
    disableGridScollTo = false;
    _Permissions = null;

    gridPageRowIndexToScrollTo$: Observable<number>;
    selectedExchangeJobMapping$: Observable<ExchangeJobMapping>;
    userContext$: Observable<UserContext>;

    selectedExchangeJobMappingSubscription: Subscription;
    showCompanyJobsSubscription: Subscription;
    companyJobsSearchTermSubscription: Subscription;
    selectedCompanyJob$: Observable<CompanyJob>;

    constructor(
        private store: Store<fromPeerManagementReducer.State>,
        private route: ActivatedRoute,
        private exchangeJobMappingService: ExchangeJobMappingService,
        private companySecurityApi: CompanySecurityApiService,
        private settingsService: SettingsService
    ) {
        this.exchangeId = this.route.snapshot.params.id;

        this.gridPageRowIndexToScrollTo$ = this.store.select(fromPeerManagementReducer.getExchangeJobMappingPageRowIndexToScrollTo);
        this.selectedExchangeJobMapping$ = this.store.select(fromPeerManagementReducer.getSelectedExchangeJobMapping);
        this.userContext$ = store.select(fromRootState.getUserContext);
        this.selectedCompanyJob$ = this.store.select(fromPeerManagementReducer.getCompanyJobsSelectedCompanyJob);

        this._Permissions = Permissions;
    }

    handleSearchChanged(query: string): void {
        this.store.dispatch(new fromGridActions.UpdateFilter(
            GridTypeEnum.ExchangeJobMapping,
            { columnName: 'ExchangeJobTitle', value: query }
        ));
        this.exchangeJobMappingService.loadExchangeJobMappings();
    }

    handleCompanyJobsSearchChanged(searchTerm: string): void {
        this.store.dispatch(new companyJobsActions.UpdateSearchTerm(searchTerm));
        this.store.dispatch(new fromGridActions.PageChange(GridTypeEnum.PeerManageCompanyJobs, { skip: 0 } as PageChangeEvent));
        this.store.dispatch(new companyJobsActions.LoadCompanyJobs());
    }

    isUserAdmin(): boolean {
        let isCompanyAdmin: boolean;
        let isSystemAdmin: boolean;

        this.store.select(fromRootState.getIsAdmin).pipe(
            take(1)
        ).subscribe(r => isSystemAdmin = r);

        this.companySecurityApi.getIsCompanyAdmin().pipe(take(1)).subscribe(ret => isCompanyAdmin = ret);

        return isCompanyAdmin || isSystemAdmin;
    }

    handleExchangeJobMappingInfoClosed() {
        // Need to clear out the index so clicking on the same row will cause a change to the scrollTo Directive
        this.store.dispatch(new fromExchangeJobMappingGridActions.UpdatePageRowIndexToScrollTo(null));
        this.store.dispatch(new fromExchangeJobMappingGridActions.SetActiveExchangeJob(null));
        this.collapse = false;
        this.disableGridScollTo = false;
    }

    requestJobButtonClick() {
        this.store.dispatch(new fromExchangeRequestActions.OpenExchangeRequestModal(ExchangeRequestTypeEnum.PayfactorsJob));
    }

    importAssociationClick() {
        this.store.dispatch(new fromImportRequestActions.SwitchAssociationImportModalOpenAction(true));
    }

    // Lifecycle
    ngOnInit() {
        this.selectedExchangeJobMappingSubscription = this.selectedExchangeJobMapping$.subscribe(selectedMapping => {
            this.disableGridScollTo = this.collapse;
            this.collapse = !!selectedMapping;
        });

        this.showCompanyJobsSubscription = this.settingsService
          .selectCompanySetting<string>(CompanySettingsEnum.PeerManageShowCompanyJobs, 'string')
          .subscribe(setting => this.showCompanyJobs = (setting === 'true'));

        if (this.showCompanyJobs) {
          this.companyJobsSearchTermSubscription = this.store.select(fromPeerManagementReducer.getCompanyJobsSearchTerm).subscribe(term => {
            this.companyJobsSearchComponent.writeValue(term);
            this.companyJobsSearchTerm = term;
          });
        }

        this.store.dispatch(new companyJobsActions.SetExchangeId(parseInt(this.route.snapshot.params.id, 10)));
    }

    ngOnDestroy() {
        this.selectedExchangeJobMappingSubscription.unsubscribe();
        this.showCompanyJobsSubscription.unsubscribe();
        if (this.showCompanyJobs) {
          this.companyJobsSearchTermSubscription.unsubscribe();
        }

        this.store.dispatch(new fromGridActions.ResetGrid(GridTypeEnum.ExchangeJobMapping));
        this.store.dispatch(new fromExchangeJobMappingGridActions.SetActiveExchangeJob(null));

        this.store.dispatch(new companyJobsActions.UpdateSearchTerm(null));
    }
}
