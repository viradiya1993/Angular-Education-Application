import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin';
import { ListComponent } from './list';
import { SubAdminComponent } from './sub-admin/list/sub-admin.component';

const routes: Routes = [
    { path: 'list', component: ListComponent },
    { path: 'admin', component: AdminComponent },
    { path: 'sub-admin', component: SubAdminComponent },
    { path: '**', redirectTo: 'list', pathMatch: 'full' }
  ];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class ListsRoutingModule { }
