import { OnInit, Component} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

import { forkJoin, Subscription } from 'rxjs';
import {Observable} from 'rxjs/Observable';
import {Store} from '@ngrx/store';
import 'rxjs-compat/add/operator/take';

import { UserContext } from 'libs/models/security';
import { ControlType } from 'libs/models/common';
import * as fromRootState from 'libs/state/state';
import { AsyncStateObj } from 'libs/models/state';

import {JobDescriptionHistoryListItem} from '../../../models';
import * as fromJobDescriptionReducer from '../../../reducers';
import * as fromJobDescriptionVersionCompareActions from '../../../actions/job-description-version-compare.actions';
import * as fromJobDescriptionHistoryListActions from '../../../actions/job-description-history-list.actions';
import * as fromJobDescriptionManagementSharedReducer from '../../../../shared/reducers';
import * as fromControlTypeActions from '../../../../shared/actions/control-types.actions';
import * as fromJobDescriptionActions from '../../../actions/job-description.actions';


@Component({
  selector: 'pf-job-description-version-compare.page',
  templateUrl: './job-description-version-compare.page.html',
  styleUrls: ['./job-description-version-compare.page.scss']
})
export class JobDescriptionVersionComparePageComponent implements OnInit {
  companyLogoPath: string;

  sourceHistoryItem$: Observable<JobDescriptionHistoryListItem>;
  jobDescriptionHistoryList$: Observable<JobDescriptionHistoryListItem[]>;
  comparisonHistoryItem$: Observable<JobDescriptionHistoryListItem>;
  jobDescriptionVersionComparisonLoading$: Observable<boolean>;
  jobDescriptionVersionComparisonLoadingError$: Observable<boolean>;
  jobDescriptionVersionComparison$: Observable<any>;
  controlTypesLoaded$: Observable<any>;
  companyLogo$: Observable<AsyncStateObj<string>>;
  controlTypes$: Observable<ControlType[]>;

  identity$: Observable<UserContext>;

  companyLogoSubscription: Subscription;

  constructor(private sharedStore: Store<fromJobDescriptionManagementSharedReducer.State>,
              private store: Store<fromJobDescriptionReducer.State>,
              private router: Router, private route: ActivatedRoute,
              private userContextStore: Store<fromRootState.State>) {

    this.store.dispatch(new fromJobDescriptionHistoryListActions.LoadJobDescriptionHistoryListItems(
      {JobDescriptionId: this.route.snapshot.params.id}
      ));
    this.sharedStore.dispatch(new fromControlTypeActions.LoadControlTypes());

    this.controlTypesLoaded$ =   this.sharedStore.select(fromJobDescriptionManagementSharedReducer.getControlTypesLoaded);
    this.jobDescriptionHistoryList$ = this.store.select(fromJobDescriptionReducer.getJobDescriptionHistoryList);
    this.sourceHistoryItem$ = this.store.select(fromJobDescriptionReducer.getSourceHistoryListItem);
    this.comparisonHistoryItem$ = this.store.select(fromJobDescriptionReducer.getComparisonHistoryListItem);
    this.jobDescriptionVersionComparison$ = this.store.select(fromJobDescriptionReducer.getJobDescriptionComparison);
    this.jobDescriptionVersionComparisonLoading$ = this.store.select(fromJobDescriptionReducer.getJobDescriptionComparisonLoading);
    this.jobDescriptionVersionComparisonLoadingError$ = this.store.select(fromJobDescriptionReducer.getJobDescriptionComparisonLoadingError);
    this.companyLogo$ = this.store.select(fromJobDescriptionReducer.getCompanyLogoAsync);
    this.controlTypes$ = this.store.select(fromJobDescriptionManagementSharedReducer.getControlTypeAndVersion);

    this.identity$ = this.userContextStore.select(fromRootState.getUserContext);
  }

  // Events
  handleSourceVersionChanged(jobDescriptionHistoryListItem: JobDescriptionHistoryListItem) {
    this.store.dispatch(new fromJobDescriptionVersionCompareActions.SetSelectedSourceHistoryListItem(jobDescriptionHistoryListItem));
    this.versionDropDownChanged({ sourceVersion: jobDescriptionHistoryListItem.VersionNumber});
  }

  handleComparisonVersionChanged(jobDescriptionHistoryListItem: JobDescriptionHistoryListItem) {
    this.store.dispatch(new fromJobDescriptionVersionCompareActions.SetSelectedComparisonHistoryListItem(jobDescriptionHistoryListItem));
    this.versionDropDownChanged({ compareVersion: jobDescriptionHistoryListItem.VersionNumber});
  }

  stopComparing() {
     this.router.navigate([`job-descriptions/${this.route.snapshot.params.id}`]);
  }

  ngOnInit() {
    this.store.dispatch(new fromJobDescriptionVersionCompareActions.LoadJobDescriptionHistoryListSuccess({
      historyList: this.route.snapshot.data['historyList'],
      sourceVersion: Number(this.route.snapshot.params.sourceVersion),
      compareVersion: Number(this.route.snapshot.params.compareVersion)
    }));

    this.getDetailCompareFromSelectedVersions();

    // Get Identity
    this.identity$.subscribe(identity => {
      this.companyLogoSubscription = this.companyLogo$.subscribe((companyLogo) => {
        this.companyLogoPath = companyLogo && companyLogo.obj
          ? identity.ConfigSettings.find(c => c.Name === 'CloudFiles_PublicBaseUrl').Value + '/company_logos/' + companyLogo.obj
          : '';
      });

      this.store.dispatch(new fromJobDescriptionActions.LoadCompanyLogo(identity.CompanyId));
    });

    // Get all control types
    this.store.dispatch(new fromControlTypeActions.LoadControlTypes());
  }

  private getDetailCompareFromSelectedVersions() {
    forkJoin([this.sourceHistoryItem$.pipe().take(1), this.comparisonHistoryItem$.pipe().take(1)]).subscribe(result => {
      if (result[0] && result[1]) {
        const sourceVersionNum = result[0].VersionNumber;
        const comparisonVersionNumber = result[1].VersionNumber;

        this.store.dispatch(new fromJobDescriptionVersionCompareActions.LoadJobDescriptionComparison({
          jobDescriptionId: this.route.snapshot.params.id,
          revisionNumber: sourceVersionNum,
          previousRevisionNumber: comparisonVersionNumber}));
      }
    });
  }

  private versionDropDownChanged(updatedParamObj: any) {
    this.updateRouteMatrixParams(updatedParamObj);
    this.getDetailCompareFromSelectedVersions();
  }

  private updateRouteMatrixParams(updatedParamObj: any) {
   const currentParamsObj = Object.assign({}, this.route.snapshot.params);
    delete currentParamsObj.id;

    const updatedUrl = this.router.createUrlTree([
      Object.assign(currentParamsObj, updatedParamObj)
    ], { relativeTo: this.route });

    // TODO[BC]: This causes the history list resolve guard to be fired again. Research how to avoid it.
    this.router.navigateByUrl(updatedUrl);
  }

}
