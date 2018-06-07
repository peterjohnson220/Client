import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { MarketingImageRoutingModule } from './marketing-image-routing.module';
import { MarketingImageComponent} from './containers';

import { reducers } from './reducers';
import { MarketingImageEffects } from './effects';
import { UploadModule } from '@progress/kendo-angular-upload';



@NgModule({
  imports: [
    // Angular
    CommonModule,
    FormsModule,
    ReactiveFormsModule,

    // 3rd Party
    StoreModule.forFeature('marketingMain', reducers),
    EffectsModule.forFeature([MarketingImageEffects]),
    UploadModule,

    // Routing
    MarketingImageRoutingModule    
  ],
  declarations: [
    // Components
    MarketingImageComponent
  ]
})
export class MarketingImageModule { }
