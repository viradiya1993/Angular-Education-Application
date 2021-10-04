import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CountryListsComponent } from './country-lists/country-lists.component';
import { DistrictsListsComponent } from './districts-lists/districts-lists.component';
import { StateListsComponent } from './state-lists/state-lists.component';

const routes: Routes = [
  { path: 'country', component: CountryListsComponent },
  { path: 'states', component: StateListsComponent },
  { path: 'district', component: DistrictsListsComponent },
  { path: '**', redirectTo: 'country', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListsRoutingModule { }
