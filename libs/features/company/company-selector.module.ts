import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { ComboBoxModule } from '@progress/kendo-angular-dropdowns';

import { PfApiModule } from 'libs/data/payfactors-api';
import { PfCommonUIModule } from 'libs/ui/common';

import { CompanySelectorComponent } from './components';
import { reducers } from './reducers';
import { CompanySelectorEffects } from './effects';

@NgModule({
    imports: [
        // 3rd Party
        StoreModule.forFeature('feature_companyselector', reducers),
        EffectsModule.forFeature([
            CompanySelectorEffects
        ]),
        ComboBoxModule,

        // NG
        FormsModule,
        CommonModule,

        // PF
        PfCommonUIModule,
        PfApiModule
    ],
    declarations: [
        // Containers
        CompanySelectorComponent,
    ],
    exports: [CompanySelectorComponent],
})
export class PfCompanySelectorModule { }
