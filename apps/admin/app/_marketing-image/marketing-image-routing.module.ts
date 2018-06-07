import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MarketingImageComponent } from './containers';

const routes: Routes = [
  { path: '', component: MarketingImageComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MarketingImageRoutingModule { }
