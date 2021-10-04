import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserProfileComponent } from './user-profile.component';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';

const routes: Routes = [
  { path: '', component: UserProfileComponent },
  { path: '**', redirectTo: 'user-profile', pathMatch: 'full' }
];

@NgModule({
  declarations: [
    UserProfileComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
  ]
})
export class UserProfileModule { }
