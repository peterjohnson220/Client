import { Component, Input, OnDestroy, OnInit } from '@angular/core';

import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';

import { CompensableFactorModel } from 'libs/models/comphub';

import * as fromComphubCsdReducer from '../../reducers';
import { CompensableFactorsConstants } from '../../constants/compensable-factors-constants';
import { CompensableFactorTypes } from '../../constants';

@Component({
  selector: 'pf-compensable-factors',
  templateUrl: './compensable-factors.component.html',
  styleUrls: ['./compensable-factors.component.scss']
})
export class CompensableFactorsComponent implements OnInit, OnDestroy {
  @Input() selectedJobTitle: string;
  compensableFactorsDataSub: Subscription;

  skills: CompensableFactorModel[];
  factorTypes = CompensableFactorTypes;
  compensableFactorsConstants = CompensableFactorsConstants;

  constructor(
    private store: Store<fromComphubCsdReducer.State>,
  ) {
    this.compensableFactorsDataSub = this.store.select(fromComphubCsdReducer.getCompensableFactors).subscribe(f => {
      if (f) {
        this.skills = f[CompensableFactorsConstants.SKILLS];
      }
    });
  }

  ngOnInit(): void {

  }

  ngOnDestroy(): void {
    this.compensableFactorsDataSub.unsubscribe();
  }
}
