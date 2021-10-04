import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () =>
      import('./auth/auth.module').then((m) => m.AuthModule),
  },
  {
    path: 'error',
    loadChildren: () =>
      import('./error/errors.module').then((m) => m.ErrorsModule),
  },
  {
    path: '',
    loadChildren: () =>
      import('./layouts/admin-layout/admin-layout.module').then((m) => m.AdminLayoutModule),
  },
  { path: '**', redirectTo: 'error/404' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule],
})
export class AppRoutingModule { }
