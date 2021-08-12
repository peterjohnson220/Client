import { Component, Input, OnDestroy, OnInit } from '@angular/core';

import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';

import { CompensableFactorModel } from 'libs/models/comphub';
import { CompensableFactorRequest, GetCrowdSourcedJobPricingRequest } from 'libs/models/comphub/get-crowd-sourced-job-pricing';

import * as fromComphubCsdReducer from '../../reducers';
import { CompensableFactorsConstants } from '../../constants/compensable-factors-constants';
import { CompensableFactorTypes } from '../../constants';
import * as fromJobGridActions from '../../../_shared/actions/job-grid.actions';

@Component({
  selector: 'pf-compensable-factors',
  templateUrl: './compensable-factors.component.html',
  styleUrls: ['./compensable-factors.component.scss']
})
export class CompensableFactorsComponent implements OnInit, OnDestroy {
  @Input() selectedJobTitle: string;
  @Input() selectedCountry: string;
  @Input() selectedPaymarketId: number;

  compensableFactorsDataSub: Subscription;
  selectedFactorsSub: Subscription;

  skills: CompensableFactorModel[];
  certs: CompensableFactorModel[];

  factorTypes = CompensableFactorTypes;
  compensableFactorsConstants = CompensableFactorsConstants;
  selectedFactors;
  educationTypes: CompensableFactorModel[];
  supervisoryRole: CompensableFactorModel[];
  yearsOfExperience: CompensableFactorModel[];
  educationTypesSub: Subscription;

  constructor(
    private store: Store<fromComphubCsdReducer.State>,
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

    this.selectedFactorsSub = this.store.select(fromComphubCsdReducer.getSelectedFactors).subscribe(f => {
      if (f) {
        this.selectedFactors = f;
      }
    });

    this.educationTypesSub = this.store.select(fromComphubCsdReducer.getEducationTypes).subscribe(et => {
      if (et) {
        et.map(x => this.educationTypes.push({ Name: x, Data: null, Selected: false }));
      }
    });
  }

  ngOnInit(): void {
  }

  handleSubmitClicked() {
    const request: GetCrowdSourcedJobPricingRequest = {
      JobTitle: this.selectedJobTitle,
      Country: this.selectedCountry,
      PaymarketId: this.selectedPaymarketId,
      SelectedFactors: this.mapSelectedFactorsToCompensableFactorsRequest(this.selectedFactors)
    };

    this.store.dispatch(new fromJobGridActions.GetCrowdSourcedJobPricing(request));
  }

  mapSelectedFactorsToCompensableFactorsRequest(sf): CompensableFactorRequest[] {
    const factorsToSend: CompensableFactorRequest[] = [];
    if (!!sf.Years_Experience) {
       factorsToSend.push({ Name: 'Years_Experience', SelectedFactors: sf.Years_Experience.map(x => x.Name) });
    }
    if (!!sf.Skills) {
       factorsToSend.push({ Name: 'Skills', SelectedFactors: sf.Skills.map(x => x.Name) });
    }
    if (!!sf.Certs) {
       factorsToSend.push({ Name: 'Certs', SelectedFactors: sf.Certs.map( x => x.Name) });
    }
    if (!!sf.Education) {
      factorsToSend.push({ Name: 'Education', SelectedFactors: sf.Education });
    }
    // always have this, defaults to 'No'
    factorsToSend.push({ Name: 'Supervisory_Role', SelectedFactors: sf.Supervisory_Role });

    return factorsToSend;
  }

  ngOnDestroy(): void {
    this.compensableFactorsDataSub.unsubscribe();
    this.educationTypesSub.unsubscribe();
  }
}
