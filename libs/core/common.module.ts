import { NgModule } from '@angular/core';

import { HighlightTextPipe, HumanizeNumberPipe, TruncateAfterPipe } from './pipes';
import { EffectsModule } from '@ngrx/effects';
import { ClientSettingsEffects} from './effects';


const declarations = [
  // Pipes
  HumanizeNumberPipe, TruncateAfterPipe, HighlightTextPipe
];

@NgModule({
  imports: [
    EffectsModule.forFeature([ ClientSettingsEffects ]),
  ],
  declarations: declarations,
  exports: declarations
})
export class PfCommonModule { }
