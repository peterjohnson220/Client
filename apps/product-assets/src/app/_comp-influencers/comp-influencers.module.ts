import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GridModule } from '@progress/kendo-angular-grid';

import { PfCommonUIModule } from 'libs/ui/common';

import { CompInfluencersPageComponent } from './containers';
import { CompInfluencersRoutingModule } from './comp-influencers-routing.module';

import { ProductAssetsListComponent} from './components';


@NgModule({
  imports: [
    // Angular
    CommonModule,

    // 3rd Party
    GridModule,

    // Routing
    CompInfluencersRoutingModule,

    // Payfactors
    PfCommonUIModule
  ],
  declarations: [
    // Pages
    CompInfluencersPageComponent,

    // Components
    ProductAssetsListComponent
  ]
})
export class CompInfluencersModule { }








