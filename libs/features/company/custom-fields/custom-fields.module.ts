import { NgModule } from '@angular/core';

import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { CustomFieldsEffect } from './effects/custom-fields.effect';
import { reducer } from './reducers/custom-fields.reducer';

@NgModule({
    imports: [
        StoreModule.forFeature('feature_customFields', reducer),
        EffectsModule.forFeature([
            CustomFieldsEffect
        ]),
    ],
})
export class PfCustomFieldsModule { }
