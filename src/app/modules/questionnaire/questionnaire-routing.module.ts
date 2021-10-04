import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ListComponent } from './list/list.component';



const routes: Routes = [
  { path: '', component: ListComponent },
  { path: '**', redirectTo: 'list', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class QuestionnaireRoutingModule { }
