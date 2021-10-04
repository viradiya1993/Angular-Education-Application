import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListComponent } from './list/list.component';
import { RouterModule, Routes } from '@angular/router';
import { QuestionBoxComponent } from './question-box/question-box.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { SharedModule } from 'src/app/shared/shared.module';
import { DokedReportComponent } from './doked-report/doked-report.component';
import { ChartModule } from 'angular-highcharts';

const routes: Routes = [
  { path: '', component: ListComponent },
  { path: 'reports', component: DokedReportComponent },
  { path: 'reports/:id', component: DokedReportComponent }

];

@NgModule({
  declarations: [
    ListComponent,
    QuestionBoxComponent,
    DokedReportComponent
  ],
  imports: [
    CommonModule,
    NgbModule,
    NgSelectModule,
    SharedModule,
    RouterModule.forChild(routes),
    ChartModule
  ]
})
export class DokedListModule { }
