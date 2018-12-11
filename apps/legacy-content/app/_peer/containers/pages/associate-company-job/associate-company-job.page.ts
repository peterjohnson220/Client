import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store, select, } from '@ngrx/store';

import { Observable } from 'rxjs';
import * as lodash from 'lodash';

import * as fromRootState from 'libs/state/state';
import { Job, UserContext, ExchangeJobSearch, CompanyJobSummary, GenericKeyValue } from 'libs/models';
import { ExchangeApiService } from 'libs/data/payfactors-api/';
import { WindowCommunicationService } from 'libs/core/services';
import { isNullOrUndefined } from 'libs/core/functions';

import * as fromAssociateAction from '../../../actions/associate-company-jobs.actions';
import * as fromAssociateReducer from '../../../reducers';

@Component({
    selector: 'pf-associate-exchange-job',
    templateUrl: './associate-company-job.page.html',
    styleUrls: ['./associate-company-job.page.scss']
})
export class AssociateCompanyJobComponent implements OnInit {

    nullCheck = isNullOrUndefined;
    companyJobInfo: Job;
    companyJobId: number;
    exchanges: GenericKeyValue<number, string>[];

    exchangeId: number = null;
    exchangeJobQuery = '';
    exchangeDescriptionQuery = '';

    // observables
    searchResults$: Observable<ExchangeJobSearch[]>;
    isLoading$: Observable<boolean>;
    hasLoadingError$: Observable<boolean>;
    isAddingAssociation$: Observable<boolean>;
    hasAddingAssociationError$: Observable<boolean>;
    userContext$: Observable<UserContext>;
    companyJob$: Observable<CompanyJobSummary>;

    constructor(
        private route: ActivatedRoute,
        private exchangeApiService: ExchangeApiService,
        private store: Store<fromAssociateReducer.State>,
        private windowCommunicationService: WindowCommunicationService
    ) {
        this.searchResults$ = this.store.pipe(select(fromAssociateReducer.getExchangeSearchResult));
        this.isLoading$ = this.store.pipe(select(fromAssociateReducer.getIsLoading));
        this.hasLoadingError$ = this.store.pipe(select(fromAssociateReducer.getHasLoadingError));
        this.isAddingAssociation$ = this.store.pipe(select(fromAssociateReducer.getIsAdding));
        this.hasAddingAssociationError$ = this.store.pipe(select(fromAssociateReducer.getHasAddingError));
        this.userContext$ = store.select(fromRootState.getUserContext);
        this.companyJob$ = store.select(fromAssociateReducer.getCompanyJob);
    }

    ngOnInit(): void {
        const queryParamMap = this.route.snapshot.queryParamMap;
        this.companyJobId = +queryParamMap.get('companyJobId') || 0;

        this.userContext$.subscribe(userContext => {
            this.store.dispatch(new fromAssociateAction.LoadCompanyJob(this.companyJobId)),
                this.exchangeApiService.getExchangeDictionaryForCompany(userContext.CompanyId)
                    .subscribe(f => {
                        this.exchanges = f;
                        this.windowCommunicationService.postMessage(fromAssociateAction.INITIAL_LOAD_SUCCESS);
                    });
        });

        this.companyJob$.subscribe(ejm => {
            if (ejm != null) {
                this.companyJobInfo = {
                    JobType: 'Company',
                    JobId: ejm.CompanyJobId,
                    JobTitle: ejm.JobTitle,
                    JobCode: ejm.JobCode,
                    JobFamily: ejm.JobFamily,
                    JobLevel: ejm.JobLevel,
                    JobDescription: ejm.JobSummary
                };
            }
        });
    }

    setSelectedKey(exchangeId: number) {
        this.exchangeId = exchangeId;
        if (!isNullOrUndefined(exchangeId)) {
            this.searchChanged();
        }
    }

    handleSearchDescValueChanged(event: string) {
        this.exchangeDescriptionQuery = event;
        this.searchChanged();
    }

    handleSearchTitleValueChanged(event: string) {
        this.exchangeJobQuery = event;
        this.searchChanged();
    }

    handleApplyMapping(exchangeJobId: number) {
        this.store.dispatch(new fromAssociateAction.MapExchangeJob({
            ExchangeId: this.exchangeId,
            ExchangeJobId: exchangeJobId,
            CompanyJobId: this.companyJobId
        }));
    }

    searchChanged() {

        let titleQuery = this.exchangeJobQuery;

        if (this.exchangeJobQuery.length <= 0 && this.exchangeDescriptionQuery.length <= 0) {
            titleQuery = this.companyJobInfo.JobTitle;
        }

        this.store.dispatch(new fromAssociateAction.LoadExchangeJobs({
            exchangeId: this.exchangeId,
            titleQuery: titleQuery,
            exchangeDescriptionQuery: this.exchangeDescriptionQuery
        }));

    }

    buildNoResultsString(): string {

        let s = 'No results for ';

        const companyJob = lodash.escape(this.exchangeJobQuery);
        const jobDescription = lodash.escape(this.exchangeDescriptionQuery);

        if (!companyJob && !jobDescription) {
            s += '<u>' + this.companyJobInfo.JobTitle + '</u>';
        } else if (companyJob) {
            s += '<u>' + companyJob + '</u>';
            if (jobDescription) {
                s += ' <i>and</i> ';
            }
        }

        if (jobDescription) {
            s += '<u>' + jobDescription + '</u>';
        }
        return s;

    }
}

