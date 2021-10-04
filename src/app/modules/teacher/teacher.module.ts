import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { TeacherComponent } from './list/teacher.component';
import { AddEditTeacherComponent } from './add-edit-teacher/add-edit-teacher.component';
import { DeleteTeacherComponent } from './delete-teacher/delete-teacher.component';
import { InlineSVGModule } from 'ng-inline-svg';
import {DpDatePickerModule} from 'ng2-date-picker';
import { NgSelectModule } from '@ng-select/ng-select';
const routes: Routes = [
  { path: '', component: TeacherComponent }
];

@NgModule({
  declarations: [
    TeacherComponent,
    AddEditTeacherComponent,
    DeleteTeacherComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
    InlineSVGModule,
    DpDatePickerModule,
    NgSelectModule
  ],
 
})
export class TeacherModule { }
