import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListComponent } from './list/list.component';
import { DeleteReportsComponent } from './delete-reports/delete-reports.component';
import { AddEditReportsComponent } from './add-edit-reports/add-edit-reports.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { DpDatePickerModule } from 'ng2-date-picker';
import { NgSelectModule } from '@ng-select/ng-select';


const routes: Routes = [
  { path: '', component: ListComponent }
];
@NgModule({
  declarations: [
    ListComponent,
    DeleteReportsComponent,
    AddEditReportsComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
    DpDatePickerModule,
    NgSelectModule
  ]
})
export class ReportsModule { }
