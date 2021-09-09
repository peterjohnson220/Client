import { Component, Input, OnDestroy } from '@angular/core';

import { Observable, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';

import { CompensableFactorModel } from 'libs/models/comphub';
import { CompensableFactorsResponse, GetCrowdSourcedJobPricingRequest } from 'libs/models/payfactors-api';

import * as fromComphubCsdReducer from '../../reducers';
import { CompensableFactorsConstants } from '../../../_shared/constants/compensable-factors-constants';
import { CompensableFactorTypes } from '../../constants';
import * as fromJobGridActions from '../../../_shared/actions/job-grid.actions';
import { CompensableFactorDataMapper } from '../../helpers';
import * as fromExportDataActions from '../../actions/export-data.actions';
import * as fromCompensableFactorsActions from '../../actions/compensable-factors.actions';

@Component({
  selector: 'pf-compensable-factors',
  templateUrl: './compensable-factors.component.html',
  styleUrls: ['./compensable-factors.component.scss']
})
export class CompensableFactorsComponent implements OnDestroy {
  @Input() selectedJobTitle: string;
  @Input() selectedCountry: string;
  @Input() selectedPaymarketId: number;
  @Input() selectedFactors: CompensableFactorsResponse[];
  @Input() loading: boolean;
  @Input() initialSelectedFactors: CompensableFactorsResponse[];

  compensableFactorsDataSub: Subscription;
  selectedCountSub: Subscription;
  warning$: Observable<boolean>;

  skills: CompensableFactorModel[];
  certs: CompensableFactorModel[];

  factorTypes = CompensableFactorTypes;
  compensableFactorsConstants = CompensableFactorsConstants;
  educationTypes: CompensableFactorModel[];
  supervisoryRole: CompensableFactorModel[];
  yearsOfExperience: CompensableFactorModel[];
  btnDisabled: boolean;

  constructor(
    private store: Store<fromComphubCsdReducer.State>
  ) {
    this.compensableFactorsDataSub = this.store.select(fromComphubCsdReducer.getCompensableFactors).subscribe(f => {
      if (f) {
        this.skills = f[CompensableFactorsConstants.SKILLS];
        this.certs = f[CompensableFactorsConstants.CERTS];
        this.supervisoryRole = f[CompensableFactorsConstants.SUPERVISORY_ROLE];
        this.educationTypes = f[CompensableFactorsConstants.EDUCATION];
        this.yearsOfExperience = f[CompensableFactorsConstants.YEARS_EXPERIENCE];
      }
    });

    this.selectedCountSub = this.store.select(fromComphubCsdReducer.getSelectedCount).subscribe(count => {
      this.btnDisabled = count === 0;
    });

    this.warning$ = this.store.select(fromComphubCsdReducer.getDisplayWarning);
  }

  handleSubmitClicked() {
    const request: GetCrowdSourcedJobPricingRequest = {
      JobTitle: this.selectedJobTitle,
      Country: this.selectedCountry,
      PaymarketId: this.selectedPaymarketId,
      SelectedFactors: CompensableFactorDataMapper.mapSelectedFactorsToCompensableFactorsRequest(this.selectedFactors),
      IncludeExportData: true
    };
    this.store.dispatch(new fromJobGridActions.GetCrowdSourcedJobPricing(request));
    this.store.dispatch(new fromExportDataActions.SetExportData());
    this.store.dispatch(new fromCompensableFactorsActions.DisableWarning());
  }

  handleResetClicked() {
    const request: GetCrowdSourcedJobPricingRequest = {
      JobTitle: this.selectedJobTitle,
      Country: this.selectedCountry,
      PaymarketId: this.selectedPaymarketId,
      SelectedFactors: CompensableFactorDataMapper.mapSelectedFactorsToCompensableFactorsRequest(this.initialSelectedFactors),
      IncludeExportData: true
    };
    this.store.dispatch(new fromJobGridActions.GetCrowdSourcedJobPricing(request));
    this.store.dispatch(new fromExportDataActions.SetExportData());
    this.store.dispatch(new fromCompensableFactorsActions.InitJobInitialPricing);
  }

  ngOnDestroy(): void {
    this.compensableFactorsDataSub?.unsubscribe();
    this.selectedCountSub.unsubscribe();
  }
}
