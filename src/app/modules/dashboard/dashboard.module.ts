import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule, Routes } from "@angular/router";
import { DashboardComponent } from "./dashboard.component";
import { NgxDaterangepickerMd } from "ngx-daterangepicker-material";
import { SharedModule } from "src/app/shared/shared.module";
import { NgSelectModule } from "@ng-select/ng-select";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";



const routes: Routes = [
  { path: '', component: DashboardComponent }
];

@NgModule({
  declarations: [DashboardComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    NgxDaterangepickerMd.forRoot(),
    SharedModule,
    NgSelectModule,
    NgbModule
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA
  ]
})
export class DashboardModule { }