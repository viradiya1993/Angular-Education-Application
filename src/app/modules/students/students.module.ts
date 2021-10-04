import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListComponent } from './list/list.component';
import { DeleteStudentComponent } from './delete-student/delete-student.component';
import { AddEditStudentComponent } from './add-edit-student/add-edit-student.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { DokformComponent } from './dokform/dokform.component';
import { NgSelectModule } from '@ng-select/ng-select';

const routes: Routes = [
  { path: 'list', component: ListComponent },
  { path: 'dokDataForm', component: DokformComponent },
  { path: 'dokDataList', component: DokformComponent },
  { path: '**', redirectTo: 'list', pathMatch: 'full' }
];

@NgModule({
  declarations: [
    ListComponent,
    DeleteStudentComponent,
    AddEditStudentComponent,
    DokformComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
    NgSelectModule
  ],
  exports: [RouterModule]
})
export class StudentsModule { }
