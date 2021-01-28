import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { reducers } from './reducers';
import { EntityDescriptionEffects } from './effects/entity-description.effects';
import { EntityDescriptionComponent } from './containers/entity-description.component';

@NgModule({
  imports: [
    // 3rd Party
    StoreModule.forFeature('feature_entityDescription', reducers),
    EffectsModule.forFeature([
      EntityDescriptionEffects
    ]),
    NgbPopoverModule,
    CommonModule,
    FontAwesomeModule
  ],
  exports: [
    EntityDescriptionComponent
  ],
  declarations: [
    // components
    EntityDescriptionComponent
  ]
})
export class PfEntityDescriptionModule { }
