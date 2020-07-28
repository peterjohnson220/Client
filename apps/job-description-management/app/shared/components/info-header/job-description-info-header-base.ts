import { Input, OnInit, OnChanges, Directive } from '@angular/core';

import { Store } from '@ngrx/store';

import { Observable } from 'rxjs/Observable';

import { UserContext } from 'libs/models/index';
import { JobDescription } from 'libs/models/jdm/job-description.model';
import { JobInformationField } from 'libs/models/jdm/job-information-field.model';
import * as fromRootState from 'libs/state/state';

import * as fromJobDescriptionAppliesToReducers from 'libs/features/job-description-management/reducers/index';
import * as fromJobDescriptionAppliesToActions from 'libs/features/job-description-management/actions/job-description-appliesto.actions';
import { JobDescriptionAppliesToItem } from 'libs/features/job-description-management/models';

@Directive()
export abstract class JobDescriptionInfoHeaderBase implements OnInit, OnChanges {
  jobInfoFieldRows: any;

  jobDescriptionAppliesToItems$: Observable<JobDescriptionAppliesToItem[]>;
  jobDescriptionAppliesToItemsLoading$: Observable<boolean>;
  userContext$: Observable<UserContext>;

  protected constructor(
    private store: Store<fromJobDescriptionAppliesToReducers.State>

  ) {
    this.userContext$ = this.store.select(fromRootState.getUserContext);
    this.jobDescriptionAppliesToItems$ = this.store.select(
      fromJobDescriptionAppliesToReducers.getJobDescriptionAppliesToItems);
    this.jobDescriptionAppliesToItemsLoading$ = this.store.select(fromJobDescriptionAppliesToReducers.getJobDescriptionAppliesToLoading);
  }

  @Input() jobDescription: JobDescription;
  @Input() jobInformationFields: JobInformationField[];
  @Input() showingLibrary = false;
  @Input() isPublic: JobDescriptionAppliesToItem;

  ngOnInit() {
    this.userContext$.subscribe(uc => {
      if (!uc.IsPublic && !uc.WorkflowStepInfo) {
        this.store.dispatch(new fromJobDescriptionAppliesToActions.LoadJobDescriptionAppliesTo());
      }
    });
  }

  ngOnChanges(changes) {
    if (changes.jobInformationFields && changes.jobInformationFields.currentValue) {
      this.buildJobInfoFieldRows();
    }
  }

  private buildJobInfoFieldRows() {
    const rows = [];
    const jobInfoFields = this.jobInformationFields;

    jobInfoFields.forEach((jif, index) => {
      if (jif.FieldName === 'TemplateName'
        && (this.jobDescription
        && !this.jobDescription['WorkflowId']
        && this.jobDescription['JobDescriptionStatus'] !== 'Draft')) {
        return;
      }
      if (index % 2 === 0) {
        const lastInfoField = typeof jobInfoFields[index + 1] === 'undefined'
          ? { DisplayName: '', FieldName: '' }  : jobInfoFields[index + 1];
        rows.push({fields: [jobInfoFields[index], lastInfoField]});
      }
    });

    this.jobInfoFieldRows = rows;
  }
}
