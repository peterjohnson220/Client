import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Store, select } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import * as lodash from 'lodash';

import { Job, UserContext, ExchangeJobSearch, LatestCompanyJob, GenericKeyValue } from 'libs/models';
import { ExchangeApiService } from 'libs/data/payfactors-api/';
import { WindowCommunicationService } from 'libs/core/services';
import { isNullOrUndefined } from 'libs/core/functions';
import * as fromRootState from 'libs/state/state';

import * as fromAssociateAction from '../../../actions/associate-company-jobs.actions';
import * as fromAssociateReducer from '../../../reducers';

@Component({
    selector: 'pf-associate-exchange-job',
    templateUrl: './associate-company-job.page.html',
    styleUrls: ['./associate-company-job.page.scss']
})
export class AssociateCompanyJobComponent implements OnInit, OnDestroy {
    private _jobTitleText: string;

    nullCheck = isNullOrUndefined;
    companyJobInfo: Job;
    companyJobId: number;

    exchangeId: number = null;
    exchangeJobQuery = '';
    exchangeDescriptionQuery = '';

    // Observables
    searchResults$: Observable<ExchangeJobSearch[]>;
    isLoading$: Observable<boolean>;
    hasLoadingError$: Observable<boolean>;
    isAddingAssociation$: Observable<boolean>;
    hasAddingAssociationError$: Observable<boolean>;
    userContext$: Observable<UserContext>;
    companyJob$: Observable<LatestCompanyJob>;
    exchanges$: Observable<GenericKeyValue<number, string>[]>;
    activeExchange$: Observable<number>;

    // Subscriptions
    userContextSubscription: Subscription;
    companyJobsSubscription: Subscription;

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
        this.userContext$ = this.store.pipe(select(fromRootState.getUserContext));
        this.companyJob$ = this.store.pipe(select(fromAssociateReducer.getCompanyJob));
        this.exchanges$ = this.store.pipe(select(fromAssociateReducer.getExchangeDictionaryForCompany));
        this.activeExchange$ = this.store.pipe(select(fromAssociateReducer.getActiveExchange));
    }

    ngOnInit(): void {
        const queryParamMap = this.route.snapshot.queryParamMap;
        this.companyJobId = +queryParamMap.get('companyJobId') || 0;

        this.userContextSubscription = this.userContext$.subscribe(userContext => {
            this.store.dispatch(new fromAssociateAction.LoadCompanyJob(this.companyJobId)),
            this.store.dispatch(new fromAssociateAction.LoadExchangeDictionary(userContext.CompanyId));
            this.store.dispatch(new fromAssociateAction.LoadActiveExchange());
            this.exchanges$.pipe(take(1)).subscribe(() => {
              this.windowCommunicationService.postMessage(fromAssociateAction.INITIAL_LOAD_SUCCESS);
            });
        });

        this.companyJobsSubscription = this.companyJob$.subscribe(ejm => {
            if (ejm != null) {
                this.companyJobInfo = {
                    JobType: 'Company',
                    JobId: ejm.CompanyJobId,
                    JobTitle: ejm.JobTitle,
                    JobCode: ejm.JobCode,
                    JobFamily: ejm.JobFamily,
                    JobLevel: ejm.JobLevel,
                    JobDescription: ejm.JobDescription
                };
                this.searchChanged();
            }
        });
    }

    get jobTitleText(): string {
        return this._jobTitleText;
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

        if (this.exchangeJobQuery.length <= 0 && this.exchangeDescriptionQuery.length <= 0 && !!this.companyJobInfo) {
            titleQuery = this.companyJobInfo.JobTitle;
        }
        if (this.exchangeId) {
          this.store.dispatch(new fromAssociateAction.LoadExchangeJobs({
            exchangeId: this.exchangeId,
            titleQuery: titleQuery,
            exchangeDescriptionQuery: this.exchangeDescriptionQuery
          }));
        }
    }

    buildNoResultsString(): string {
        let s = 'No results for ';

        const companyJob = lodash.escape(this.exchangeJobQuery);
        const jobDescription = lodash.escape(this.exchangeDescriptionQuery);

        if (!companyJob && !jobDescription && !!this.companyJobInfo) {
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

    displayTooltip(element: HTMLElement, text: string): boolean {
        if (element.offsetWidth < element.scrollWidth) {
            this._jobTitleText = text;
            return true;
        }
        this._jobTitleText = '';
        return false;
    }

    ngOnDestroy(): void {
      this.userContextSubscription.unsubscribe();
      this.companyJobsSubscription.unsubscribe();
    }
}

