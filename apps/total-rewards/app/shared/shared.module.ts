import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import { EffectsModule } from '@ngrx/effects';
import { ChartModule } from '@progress/kendo-angular-charts';
import { DragulaModule } from 'ng2-dragula';
import 'hammerjs';

import { TotalRewardsStatementComponent, TotalRewardsControlComponent, TotalRewardsItemWellComponent } from './components';

@NgModule({
  imports: [
    // Angular
    CommonModule,
    HttpClientModule,

    // Third Party
    ChartModule,
    DragulaModule.forRoot(),
  ],
  declarations: [
    TotalRewardsStatementComponent,
    TotalRewardsControlComponent,
    TotalRewardsItemWellComponent,
  ],
  exports: [
    TotalRewardsStatementComponent,
    TotalRewardsItemWellComponent,
  ],
  providers: [],
})
export class SharedModule {
  constructor() {}
}
