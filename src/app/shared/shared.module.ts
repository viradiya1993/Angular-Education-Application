import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatTableModule } from '@angular/material/table';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';

import { PaginationComponent } from './pagination/pagination.component';
import { DateFormatPipe } from './date-format-pipe.pipe';
import { TruncatePipe } from './string-cut-pipe.pipe';
import { MatSelectModule } from '@angular/material/select';
import { DashboardChartComponent } from './dashboard-chart/dashboard-chart.component';
import { BarChartComponent } from './bar-chart/bar-chart.component';
import { ChartModule, HIGHCHARTS_MODULES } from 'angular-highcharts';
import more from 'highcharts/highcharts-more.src';
import solidGauge from 'highcharts/modules/solid-gauge.src';
import { specialPipe } from './specialPipe';
import { StudentPieComponent } from './student-pie/student-pie.component';
import { DurationPieComponent } from './duration-pie/duration-pie.component';

export function highchartsModules() {
  // apply Highcharts Modules to this array
  return [more, solidGauge];
}

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatPaginatorModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    MatTableModule,
    MatListModule,
    MatButtonModule,
    ChartModule
  ],

  exports: [
    FormsModule,
    ReactiveFormsModule,
    MatPaginatorModule,
    PaginationComponent,
    DashboardChartComponent,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    DateFormatPipe,
    MatTableModule,
    MatListModule,
    MatButtonModule,
    TruncatePipe,
    BarChartComponent,
    StudentPieComponent,
    DurationPieComponent,
    specialPipe,
    ChartModule
   ],
  entryComponents: [],

  declarations: [
    PaginationComponent,
    DashboardChartComponent,
    DateFormatPipe,
    TruncatePipe,
    BarChartComponent,
    specialPipe,
    StudentPieComponent,
    DurationPieComponent
  ],

  providers: [
    MatDatepickerModule,
    DatePipe,
    { provide: HIGHCHARTS_MODULES, useFactory: highchartsModules }
  ],

  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]

})

export class SharedModule { }
