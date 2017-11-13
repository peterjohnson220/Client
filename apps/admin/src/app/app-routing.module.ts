import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'peer-admin', pathMatch: 'full'},
  { path: 'peer-admin', loadChildren: 'apps/admin/src/app/_peer/admin-peer.module#AdminPeerModule' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
