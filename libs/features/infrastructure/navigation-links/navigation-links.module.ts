import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { EffectsModule } from '@ngrx/effects';

import { OrgDataNavigationLinkEffects } from './effects/org-data-navigation-link.effects';
import { NavigationLinksComponent } from './containers';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    EffectsModule.forFeature([
      OrgDataNavigationLinkEffects
    ]),
    RouterModule
  ],
  declarations: [
    NavigationLinksComponent
  ],
  exports: [
    NavigationLinksComponent
  ]
})

export class PfNavigationLinksModule {
  constructor() {}
}
