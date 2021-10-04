import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { InlineSVGModule } from 'ng-inline-svg';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthInterceptor } from './auth/_service/auth.interceptor';
import { AuthService } from './auth/_service/auth.service';
import { ErrorInterceptor } from './auth/_service/error.interceptor';
import { ComponentsModule } from './components/components.module';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { HomeComponent } from './modules/home/home.component';

import { SplashScreenModule } from './shared/splash-screen/splash-screen.module';

import { ToastrModule } from 'ngx-toastr';
import { NgxSpinnerModule } from 'ngx-spinner';
import { NgSelectModule } from '@ng-select/ng-select';
import { SharedModule } from './shared/shared.module';






function appInitializer(authService: AuthService) {
  return () => {
    return new Promise((resolve) => {
      authService.getUserByToken().subscribe().add(resolve);
    });
  };
}


@NgModule({
  declarations: [
    AppComponent,
    AdminLayoutComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    SplashScreenModule,
    // TranslateModule.forRoot(),
    HttpClientModule,
    AppRoutingModule,
    InlineSVGModule.forRoot(),
    NgbModule,
    ComponentsModule,
    ToastrModule.forRoot({
      // timeOut: 10000,
      positionClass: 'toast-top-right',
      preventDuplicates: true,
    }),
    NgxSpinnerModule,
    NgSelectModule,
    SharedModule
  ],

  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: appInitializer,
      multi: true,
      deps: [AuthService],
    },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
