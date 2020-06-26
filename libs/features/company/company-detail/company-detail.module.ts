import {EffectsModule} from '@ngrx/effects';
import {NgModule} from '@angular/core';
import {StoreModule} from '@ngrx/store';

import {reducers} from './reducers';
import {CompanyDetailEffects} from './effects/company-detail.effects';

@NgModule({
  imports: [
    // 3rd Party
    StoreModule.forFeature('feature_companydetail', reducers),
    EffectsModule.forFeature([
      CompanyDetailEffects
    ])
  ]
})
export class PfCompanyDescriptionModule { }
