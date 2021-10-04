import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedService } from 'src/app/shared/services/shared.service';
import { AuthHTTPService } from '../_service/auth-http.service';
import { AuthService } from '../_service/auth.service';

import { MustMatch } from '../_service/confirm-password.validator';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
  resetForm: FormGroup;
  isLoading: boolean = false;
  token: any;
  show_newbutton: Boolean = false;
  show_neweye: Boolean = false;
  show_confirmbutton: Boolean = false;
  show_confirmeye: Boolean = false;
  constructor(
    private fb: FormBuilder,
    private authHTTPService: AuthHTTPService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    public sharedService: SharedService

  ) { }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((res: any) => {
      this.token = res.token;
    })
    this.initForm();
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.resetForm.controls;
  }

  initForm() {
    this.resetForm = this.fb.group({
      password: [
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(50),
        ]),
      ],
      confirmPassword: [
        '',
        Validators.compose([
          Validators.required
        ]),
      ],
    }, {
      validator: MustMatch('password', 'confirmPassword')
    });
  }

  submit() {
    this.sharedService.showLoader();
    const formData = {}
			formData['token'] = this.token;
			formData['password'] =  this.resetForm.controls.password.value;
      this.authHTTPService.ResetPassword(formData).subscribe((res: any) => {
        this.sharedService.hideLoader();
        if (res) {
          this.sharedService.swalSuccess(res.message);
					this.router.navigate(['/auth/login']);
        }
      }, err => {
        this.sharedService.swalError(err);
      })
      
  }

  showNewPassword() {
    this.show_newbutton = !this.show_newbutton;
    this.show_neweye = !this.show_neweye;
  }
  showConfirmPassword() {
    this.show_confirmbutton = !this.show_confirmbutton;
    this.show_confirmeye = !this.show_confirmeye;
  }
  // helpers for View
	isControlValid(controlName: string): boolean {
		const control = this.resetForm.controls[controlName];
		return control.valid && (control.dirty || control.touched);
	}

	isControlInvalid(controlName: string): boolean {
		const control = this.resetForm.controls[controlName];
		return control.invalid && (control.dirty || control.touched);
	}

	controlHasError(validation, controlName): boolean {
		const control = this.resetForm.controls[controlName];
		return control.hasError(validation) && (control.dirty || control.touched);
	}

	isControlTouched(controlName): boolean {
		const control = this.resetForm.controls[controlName];
		return control.dirty || control.touched;
	}
}
