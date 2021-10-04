import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddEditGradesComponent } from './add-edit-grades/add-edit-grades.component';
import { DeleteGradesComponent } from './delete-grades/delete-grades.component';
import { ListComponent } from './list/list.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgSelectModule } from '@ng-select/ng-select';


const routes: Routes = [
	{ path: '', component: ListComponent },
	{ path: '**', redirectTo: 'gredes', pathMatch: 'full' }
];



@NgModule({
	declarations: [
		ListComponent,
		AddEditGradesComponent,
		DeleteGradesComponent,
	],
	imports: [
		CommonModule,
		RouterModule.forChild(routes),
		SharedModule,
		NgSelectModule
	]
})
export class GradesModule { }
