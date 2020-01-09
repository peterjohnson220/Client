import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { PfCommonUIModule } from 'libs/ui/common';
import { PfFormsModule } from 'libs/forms';
import { PfCommonModule } from 'libs/core';
import { SharedModule } from '../../shared/shared.module';
import { reducers } from './reducers';
import { RoutingWorkflowsListEffects, RoutingWorkflowsDeleteEffects, RoutingWorkflowsUpsertEffects } from './effects';
import { RoutingWorkflowsPageComponent } from './routing-workflows-list.page';
import { RoutingWorkflowsDeleteModalComponent, RoutingWorkflowsUpsertModalComponent } from './containers';

@NgModule({
  declarations: [RoutingWorkflowsPageComponent, RoutingWorkflowsDeleteModalComponent, RoutingWorkflowsUpsertModalComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,

    // 3rd Party
    FontAwesomeModule,
    StoreModule.forFeature('jobDescriptionManagement_settings_routingWorkflowsList', reducers),
    EffectsModule.forFeature([RoutingWorkflowsListEffects, RoutingWorkflowsDeleteEffects, RoutingWorkflowsUpsertEffects]),

    // Payfactors
    PfCommonUIModule,
    PfFormsModule,
    PfCommonModule,
    SharedModule
  ]
})
export class RoutingWorkflowsModule { }
