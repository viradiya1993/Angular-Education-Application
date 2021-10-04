import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListComponent } from './list/list.component';
import { EditComponent } from './edit/edit.component';
import { DeleteComponent } from './delete/delete.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { InlineSVGModule } from 'ng-inline-svg';
import { SharedModule } from 'src/app/shared/shared.module';
import { QuestionnaireRoutingModule } from './questionnaire-routing.module';
import { NgSelectModule } from '@ng-select/ng-select';



@NgModule({
  declarations: [
    ListComponent,
    EditComponent,
    DeleteComponent
  ],
  exports: [RouterModule],
  imports: [
    CommonModule,
    InlineSVGModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModalModule,
    SharedModule,
    QuestionnaireRoutingModule,
    NgSelectModule
  ]
})
export class QuestionnaireModule { }
