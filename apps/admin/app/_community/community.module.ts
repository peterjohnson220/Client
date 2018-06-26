import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GridModule } from '@progress/kendo-angular-grid';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';

import { PfCommonUIModule } from 'libs/ui/common';

import { CommunityRoutingModule } from './community-routing.module';
import { CommunityPollsComponent } from './containers/community-polls/community-polls.component';

@NgModule({
  imports: [
    // Angular
    CommonModule,
    PfCommonUIModule,

    // 3rd Party
    GridModule,
    DropDownsModule,

    // Routing
    CommunityRoutingModule
  ],
  declarations: [
      // Components
      CommunityPollsComponent
  ]
})
export class CommunityModule { }
