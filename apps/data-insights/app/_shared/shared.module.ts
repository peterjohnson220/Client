import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { DropDownListModule } from '@progress/kendo-angular-dropdowns';
import { NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';

import { PfCommonModule } from 'libs/core';
import { PfCommonUIModule } from 'libs/ui/common';

import { reducers } from './reducers';
import { BaseDataViewModalComponent } from './containers';
import { BaseDataViewModalEffects } from './effects';

@NgModule({
  imports: [
    // Angular
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    // 3rd Party
    StoreModule.forFeature('dataInsightsShared_main', reducers),
    EffectsModule.forFeature([
      BaseDataViewModalEffects
    ]),
    DropDownListModule,
    NgbPopoverModule,

    // Payfactors
    PfCommonModule,
    PfCommonUIModule
  ],
  declarations: [ BaseDataViewModalComponent ],
  exports: [ BaseDataViewModalComponent ],
  entryComponents: [BaseDataViewModalComponent]
})
export class DataInsightsSharedModule {}
