import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ResourcesComponent } from './components/resources/resources.component';
import { CompanyResourcesPageComponent } from './company-resources.page/company-resources.page';


const routes: Routes = [
  { path: '', component: ResourcesComponent },
  { path: 'company-resources', component: CompanyResourcesPageComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainRoutingModule { }
