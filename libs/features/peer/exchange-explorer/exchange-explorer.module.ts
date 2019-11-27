import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { SwitchModule } from '@progress/kendo-angular-inputs';
import { NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxMapboxGLModule } from 'ngx-mapbox-gl';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';

import { environment } from 'environments/environment';
import { PfCommonUIModule } from 'libs/ui/common/common-ui-module';
import { PfFormsModule } from 'libs/forms';

import { PfSearchModule } from '../../search';
import { SearchFilterMappingDataObj } from '../../search/models';
import { UserFilterTypeData } from '../../user-filter/models';
import { PfPeerMapModule } from '../map';

import { ExchangeExplorerComponent, ExchangeScopeSelectorComponent, ExchangeExplorerMapComponent } from './containers';
import { reducers } from './reducers';
import {
  ExchangeExplorerEffects,
  ExchangeFilterContextEffects, ExchangeFilterEffects,
  ExchangeScopeEffects,
  ExchangeSearchEffects,
  SingledFilterEffects
} from './effects';
import { ExchangeExplorerContextService } from './services';
import * as fromFaIcons from './fa-icons';

const declarations = [
  ExchangeExplorerMapComponent,
  ExchangeScopeSelectorComponent,
  ExchangeExplorerComponent
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    // 3rd Party
    StoreModule.forFeature('feature_peer_exchangeExplorer', reducers),
    EffectsModule.forFeature([
      ExchangeScopeEffects, ExchangeFilterContextEffects, ExchangeFilterEffects,
      ExchangeSearchEffects, SingledFilterEffects, ExchangeExplorerEffects
    ]),
    SwitchModule,
    NgxMapboxGLModule.withConfig({accessToken: environment.mapboxAccessToken}),
    NgbPopoverModule,
    FontAwesomeModule,

    // PF Modules
    PfCommonUIModule,
    PfPeerMapModule,
    PfSearchModule,
    PfFormsModule
  ],
  providers: [
    ExchangeExplorerContextService,
    { provide: SearchFilterMappingDataObj, useValue: {} },
    { provide: UserFilterTypeData, useValue: '' }
  ],
  declarations: declarations,
  exports: declarations
})
export class PfExchangeExplorerModule {
  constructor() {
    library.add(...fromFaIcons.faIcons);
  }
}
