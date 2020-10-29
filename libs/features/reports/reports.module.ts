import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { reducers } from './reducers';
import { ReportViewEffects } from './effects';
import { ReportPreviewComponent } from './components/report-preview';
import { ReportViewComponent } from './containers/report-view';
import { PfCommonUIModule } from '../../ui/common';

const importsAndExports = [
  ReportPreviewComponent,
  ReportViewComponent
];

@NgModule({
  imports: [
    // 3rd Party
    StoreModule.forFeature('feature_reports', reducers),
    EffectsModule.forFeature([
      ReportViewEffects
    ]),
    CommonModule,

    // Payfactors
    PfCommonUIModule
  ],
  exports: importsAndExports,
  declarations: importsAndExports
})
export class PfReportsModule { }
