import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {StoreModule} from '@ngrx/store';
import {EffectsModule} from '@ngrx/effects';

import {AddDataEffects} from './effects';
import {reducers} from './reducers';
import {SurveySearchModule} from '../../surveys/survey-search';
import {PfCommonUIModule} from '../../../ui/common';
import {PfFormsModule} from '../../../forms';
import {PfSearchModule} from '../../search/search';
import {WindowCommunicationService} from '../../../core/services';
import { AddDataComponent } from './add-data/add-data.component';


@NgModule({
  declarations: [
    AddDataComponent
  ],
  imports: [
    CommonModule, FormsModule, ReactiveFormsModule,


    StoreModule.forFeature('project_addData', reducers),
    EffectsModule.forFeature([AddDataEffects]),

    // Payfactors
    SurveySearchModule,
    PfCommonUIModule,
    PfFormsModule,
    PfSearchModule

  ],
  providers: [WindowCommunicationService],
  exports: [AddDataComponent]
})
export class AddDataModule { }
