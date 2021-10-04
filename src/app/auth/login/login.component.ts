import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription, Observable } from 'rxjs';
import { first } from 'rxjs/operators';
// import { UserModel } from '../_models/user.model';
import { AuthService } from '../_service/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedService } from 'src/app/shared/services/shared.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit, OnDestroy {
  // KeenThemes mock, change it to:
  // defaultAuth = {
  //   email: '',
  //   password: '',
  // };
  defaultAuth: any = {
    email: 'test2@gamil.com',
    password: 'abc@123',
  };
  loginForm: FormGroup;
  hasError: boolean;
  returnUrl: string;
  isLoading$: Observable<boolean>;
  isLoading: boolean = false;
  show_button: Boolean = false;
  show_eye: Boolean = false;

  // private fields
  private unsubscribe: Subscription[] = []; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    public sharedservice: SharedService
  ) {
    this.isLoading$ = this.authService.isLoading$;
    // redirect to home if already logged in
    if (this.authService.currentUserValue) {
      this.router.navigate(['/dashboard']);
    }
  }

  ngOnInit(): void {
    this.initForm();
    // get return url from route parameters or default to '/'
    this.returnUrl =
      this.route.snapshot.queryParams['returnUrl'.toString()] || '/';
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.loginForm.controls;
  }

  initForm() {
    this.loginForm = this.fb.group({
      email: [
        '',
        Validators.compose([
          Validators.required,
          Validators.email,
          Validators.minLength(3),
          Validators.maxLength(50), // https://stackoverflow.com/questions/386294/what-is-the-maximum-length-of-a-valid-email-address
        ]),
      ],
      password: [
        '',
        Validators.compose([
          Validators.required
        ]),
      ],
    });
  }

  submit() {
    this.hasError = false;
    this.sharedservice.showLoader();
    if (!this.isLoading) {
      this.isLoading = true;
      this.authService
        .login(this.f.email.value, this.f.password.value)
        .subscribe((user: any) => {
          this.sharedservice.hideLoader();
          if (user) {
            this.isLoading = false;
            this.router.navigate(['/dashboard']);
          } else {
            this.loginForm.reset();
            this.isLoading = false;
            this.hasError = true;
          }
        }, err => {
          this.loginForm.reset();
          this.isLoading = false;
          this.hasError = false;
          this.sharedservice.loggerError(err);
        });

    }
  }

  showPassword() {
    this.show_button = !this.show_button;
    this.show_eye = !this.show_eye;
  }
  
  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }

  // helpers for View
	isControlValid(controlName: string): boolean {
		const control = this.loginForm.controls[controlName];
		return control.valid && (control.dirty || control.touched);
	}

	isControlInvalid(controlName: string): boolean {
		const control = this.loginForm.controls[controlName];
		return control.invalid && (control.dirty || control.touched);
	}

	controlHasError(validation, controlName): boolean {
		const control = this.loginForm.controls[controlName];
		return control.hasError(validation) && (control.dirty || control.touched);
	}

	isControlTouched(controlName): boolean {
		const control = this.loginForm.controls[controlName];
		return control.dirty || control.touched;
	}
}
