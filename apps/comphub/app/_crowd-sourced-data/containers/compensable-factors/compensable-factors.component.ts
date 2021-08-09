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
  yearsOfExperience: CompensableFactorModel[] = [
    { Name: '0', Data: null },
    { Name: '1', Data: null },
    { Name: '2', Data: null },
    { Name: '3', Data: null },
    { Name: '4', Data: null },
    { Name: '5', Data: null },
    { Name: '6', Data: null },
    { Name: '7', Data: null },
    { Name: '8', Data: null },
    { Name: '9', Data: null },
    { Name: '10', Data: null },
    { Name: '11', Data: null },
    { Name: '12', Data: null },
    { Name: '13', Data: null },
    { Name: '14', Data: null },
    { Name: '15', Data: null },
    { Name: '16', Data: null },
    { Name: '17', Data: null },
    { Name: '18', Data: null },
    { Name: '19', Data: null },
    { Name: '20', Data: null },
    { Name: '21', Data: null },
    { Name: '22', Data: null },
    { Name: '23', Data: null },
    { Name: '24', Data: null },
    { Name: '25', Data: null}
  ];
  factorTypes = CompensableFactorTypes;
  compensableFactorsConstants = CompensableFactorsConstants;
  selectedFactors;

  constructor(
    private store: Store<fromComphubCsdReducer.State>,
  ) {
    this.compensableFactorsDataSub = this.store.select(fromComphubCsdReducer.getCompensableFactors).subscribe(f => {
      if (f) {
        this.skills = f[CompensableFactorsConstants.SKILLS];
        this.certs = f[CompensableFactorsConstants.CERTS];
      }
    });

    this.selectedFactorsSub = this.store.select(fromComphubCsdReducer.getSelectedFactors).subscribe(f => {
      if (f) {
        this.selectedFactors = f;
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
       factorsToSend.push({ Name: 'Years_Experience', SelectedFactors: sf.Years_Experience });
    }
    if (!!sf.Skills) {
       factorsToSend.push({ Name: 'Skills', SelectedFactors: sf.Skills });
    }
    if (!!sf.Certs) {
       factorsToSend.push({ Name: 'Certs', SelectedFactors: sf.Certs });
    }

    return factorsToSend;
  }

  ngOnDestroy(): void {
    this.compensableFactorsDataSub.unsubscribe();
  }
}
