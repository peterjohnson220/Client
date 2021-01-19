import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DashboardPreferencesComponent, MyProfileComponent, PersonalProjectSettingsComponent } from './containers';
import { UserSettingsPageComponent } from './user-settings.page';
import { CommunicationPreferencesComponent } from './containers/communication-preferences/communication-preferences.component';

const routes: Routes = [
  {
    path: '',
    component: UserSettingsPageComponent,
    children: [
      { path: '', redirectTo: 'my-profile', pathMatch: 'full' },
      { path: 'my-profile', component: MyProfileComponent },
      { path: 'dashboard-preferences', component: DashboardPreferencesComponent },
      { path: 'personal-project-settings', component: PersonalProjectSettingsComponent },
      { path: 'communication-preferences', component: CommunicationPreferencesComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserSettingsRoutingModule { }
