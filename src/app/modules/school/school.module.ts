import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { InlineSVGModule } from 'ng-inline-svg';
import { AddSubAdminComponent } from './sub-admin/add-sub-admin';
import { DeleteSchoolComponent } from './delete-school';
import { EditSchoolModalComponent } from './edit-school';
import { ListComponent } from './list';
import { SchoolAssingComponent } from './school-assing';
import { ListsRoutingModule } from './school-routing.module';
import { SubAdminComponent } from './sub-admin/list';
import { DeleteSubAdminComponent } from './sub-admin';
import { AdminComponent, DeleteSchooladminComponent, EditSchooladminComponent } from './admin';

import { SharedModule } from 'src/app/shared/shared.module';
import { NgSelectModule } from '@ng-select/ng-select';


@NgModule({
  declarations: [
    ListComponent,
    DeleteSchoolComponent,
    EditSchoolModalComponent,
    SubAdminComponent,
    AddSubAdminComponent,
    DeleteSubAdminComponent,
    SchoolAssingComponent,
    AdminComponent,
    EditSchooladminComponent,
    DeleteSchooladminComponent
  ],
  exports: [RouterModule],
  imports: [
    CommonModule,
    // material module
    InlineSVGModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModalModule,
    ListsRoutingModule,
    SharedModule,
    NgSelectModule
  ],
  entryComponents: [
    SchoolAssingComponent,
    EditSchoolModalComponent,
    EditSchooladminComponent,
    DeleteSchooladminComponent,
    DeleteSchoolComponent,
  ],
})
export class SchoolModule { }
