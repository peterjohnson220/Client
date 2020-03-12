import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StoreModule } from '@ngrx/store';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

import { reducers } from './reducers';

import { InfiniteScrollComponent } from './containers/infinite-scroll';
import { PfCommonUIModule } from '../../ui/common';
import { InfiniteScrollEffectsService } from './services';


@NgModule({
  imports: [
    // Angular
    CommonModule,

    // PF
    PfCommonUIModule,

    // 3rd Party
    StoreModule.forFeature('feature_infiniteScrolls', reducers),
    InfiniteScrollModule
  ],
  declarations: [
    // Containers
    InfiniteScrollComponent
  ],
  providers: [InfiniteScrollEffectsService],
  exports: [InfiniteScrollComponent]
})
export class PfInfiniteScrollModule {}
