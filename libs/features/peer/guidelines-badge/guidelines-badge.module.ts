import { NgModule } from '@angular/core';
import {FaIconLibrary, FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {NgbPopoverModule} from '@ng-bootstrap/ng-bootstrap';
import {CommonModule} from '@angular/common';
import {StoreModule} from '@ngrx/store';
import {EffectsModule} from '@ngrx/effects';

import {reducers} from './reducers';
import {GuidelinesBadgeComponent} from './components/guidelines-badge';
import {DojGuidelinesService} from './services/doj-guidelines.service';
import {ExchangeExplorerContextService} from '../exchange-explorer/services';
import {SearchFilterMappingDataObj} from '../../search/models';
import {PayfactorsSearchApiHelper, PayfactorsSearchApiModelMapper} from '../../search/helpers';
import * as fromFaIcons from './fa-icons';
import {DataCutValidationEffects} from './effects/data-cut-validation.effects';

@NgModule({

  imports: [
    FontAwesomeModule,
    NgbPopoverModule,
    CommonModule,
    StoreModule.forFeature('dataCutValidation', reducers),
    EffectsModule.forFeature([
      DataCutValidationEffects
    ])
  ],
  declarations: [GuidelinesBadgeComponent],
  exports: [GuidelinesBadgeComponent],
  providers: [DojGuidelinesService, ExchangeExplorerContextService, PayfactorsSearchApiHelper, PayfactorsSearchApiModelMapper]
})
export class GuidelinesBadgeModule {
  constructor(library: FaIconLibrary) {
    library.addIcons(...fromFaIcons.faIcons);
  }
}
