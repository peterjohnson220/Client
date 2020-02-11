import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import { ChartModule } from '@progress/kendo-angular-charts';
import { DragulaModule } from 'ng2-dragula';
import 'hammerjs';

import { InlineStringEditorComponent, TotalRewardsStatementComponent, TotalRewardsControlComponent, TotalRewardsItemWellComponent } from './components';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';

@NgModule({
  imports: [
    // Angular
    CommonModule,
    HttpClientModule,

    // Third Party
    ChartModule,
    DragulaModule.forRoot(),

    FontAwesomeModule,
  ],
  declarations: [
    InlineStringEditorComponent,
    TotalRewardsStatementComponent,
    TotalRewardsControlComponent,
    TotalRewardsItemWellComponent,
  ],
  exports: [
    InlineStringEditorComponent,
    TotalRewardsStatementComponent,
    TotalRewardsItemWellComponent,
  ],
  providers: [],
})
export class SharedModule {
  constructor() {}
}
