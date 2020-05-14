import { Routes, RouterModule } from '@angular/router';
import {PageComponent} from './page_module.page';
import {NgModule} from '@angular/core';

const routes: Routes = [
  { path: '', component: PageComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PageRoutingModule { }
