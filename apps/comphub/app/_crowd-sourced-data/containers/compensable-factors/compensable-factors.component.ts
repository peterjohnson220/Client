import { Component, Input, OnDestroy } from '@angular/core';

import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';

import { CompensableFactorModel } from 'libs/models/comphub';
import { CompensableFactorsResponse, GetCrowdSourcedJobPricingRequest } from 'libs/models/payfactors-api';

import * as fromComphubCsdReducer from '../../reducers';
import { CompensableFactorsConstants } from '../../constants/compensable-factors-constants';
import { CompensableFactorTypes } from '../../constants';
import * as fromJobGridActions from '../../../_shared/actions/job-grid.actions';
import { CompensableFactorDataMapper } from '../../helpers';
import * as fromExportDataActions from '../../actions/export-data.actions';

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

  compensableFactorsDataSub: Subscription;

  skills: CompensableFactorModel[];
  certs: CompensableFactorModel[];

  factorTypes = CompensableFactorTypes;
  compensableFactorsConstants = CompensableFactorsConstants;
  educationTypes: CompensableFactorModel[];
  supervisoryRole: CompensableFactorModel[];
  yearsOfExperience: CompensableFactorModel[];

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
    this.store.dispatch(new fromExportDataActions.GetExportData());
  }

  ngOnDestroy(): void {
    this.compensableFactorsDataSub.unsubscribe();
  }
}
