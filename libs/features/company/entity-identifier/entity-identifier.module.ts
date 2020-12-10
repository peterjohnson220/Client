import { NgModule } from '@angular/core';

import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { EntityIdentifiersEffects } from './effects/entity-identifiers.effects';
import { reducer } from './reducers/entity-identifiers.reducer';

@NgModule({
    imports: [
        StoreModule.forFeature('feature_entityIdentifier', reducer),
        EffectsModule.forFeature([
            EntityIdentifiersEffects
        ]),
    ],
})
export class PfEntityIdentifierModule { }
