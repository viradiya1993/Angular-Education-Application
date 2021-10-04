import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { EndorsmentsComponent } from './list/endorsments.component';
import { AddEditEndorsmentsComponent } from './add-edit-endorsments/add-edit-endorsments.component';
import { DeleteEndorsmentsComponent } from './delete-endorsments/delete-endorsments.component';
import { NgSelectModule } from '@ng-select/ng-select';

const routes: Routes = [
  { path: '', component: EndorsmentsComponent },
  { path: '**', redirectTo: 'endorsments', pathMatch: 'full' }
];


@NgModule({
  declarations: [
    EndorsmentsComponent,
    AddEditEndorsmentsComponent,
    DeleteEndorsmentsComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
    NgSelectModule,
  ],
  exports: [RouterModule],
})
export class EndorsmentsModule { }
