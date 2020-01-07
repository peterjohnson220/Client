import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { OrgDataEmailRecipientsEffects } from './state/effects/email-recipients.effects';
import { EmailRecipientsComponent } from './email-recipients/email-recipients.component';
import { PfFormsModule } from '../../forms';
import { PfCommonUIModule } from '../../ui/common';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import * as fromFaIcons from './fa-icons';

@NgModule({
  imports: [
    EffectsModule.forFeature([
      OrgDataEmailRecipientsEffects
    ]),
    FormsModule,
    CommonModule,
    FontAwesomeModule,
    PfFormsModule,
    PfCommonUIModule
  ],
  declarations: [
    EmailRecipientsComponent
  ],
  exports: [EmailRecipientsComponent]
})

export class PfEmailRecipientsModule {
  constructor() {
    library.add(...fromFaIcons.faIcons);
  }
}
