import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

// Effects
import { CommunityPollEffects } from './effects';

// Reducers
import { reducers } from './reducers';

// Third party
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { GridModule } from '@progress/kendo-angular-grid';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';

// Libs / Controls
import { PfCommonUIModule } from 'libs/ui/common';
import { PfFormsModule } from 'libs/forms';
import { PfCommunityModule } from 'libs/ui/community-poll-choices/community.module';


import { CommunityRoutingModule } from './community-routing.module';
import { CommunityPollsComponent } from './containers/community-polls/community-polls.component';
import { CommunityPollModalComponent } from './containers/community-poll-modal/community-poll-modal.component';

// Services
import { CommunityPollAdminApiService } from 'libs/data/payfactors-api/community/community-poll-admin-api.service';
import { ButtonsModule } from '@progress/kendo-angular-buttons';

@NgModule({
  imports: [
    // Angular
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonsModule,

    // 3rd Party
    GridModule,
    DropDownsModule,
    StoreModule.forFeature('communityAdminMain', reducers),
    EffectsModule.forFeature([CommunityPollEffects]),

    // Routing
    CommunityRoutingModule,

    // Payfactors
    PfCommonUIModule,
    PfFormsModule,
    PfCommunityModule
  ],
  declarations: [
      // Components
      CommunityPollsComponent,
      CommunityPollModalComponent
  ],
providers: [ CommunityPollAdminApiService ]
})
export class CommunityModule { }
