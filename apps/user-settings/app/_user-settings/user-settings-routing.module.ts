import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DashboardPreferencesComponent, MyProfileComponent, PersonalProjectSettingsComponent } from './containers';
import { UserSettingsPageComponent } from './user-settings.page';

const routes: Routes = [
  {
    path: '',
    component: UserSettingsPageComponent,
    children: [
      { path: '', redirectTo: 'my-profile', pathMatch: 'full' },
      { path: 'my-profile', component: MyProfileComponent },
      { path: 'dashboard-preferences', component: DashboardPreferencesComponent },
      { path: 'personal-project-settings', component: PersonalProjectSettingsComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserSettingsRoutingModule { }
