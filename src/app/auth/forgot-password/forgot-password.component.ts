import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SharedService } from 'src/app/shared/services/shared.service';
import { AuthHTTPService } from '../_service/auth-http.service';




@Component({
	selector: 'app-forgot-password',
	templateUrl: './forgot-password.component.html',
	styleUrls: ['./forgot-password.component.scss'],
})
export class ForgotPasswordComponent implements OnInit {
	formGroup: FormGroup;
	isLoading: boolean = false;

	constructor(
		private fb: FormBuilder,
		private router: Router,
		private authHTTPService: AuthHTTPService,
		public sharedService: SharedService
	) {

	}

	ngOnInit(): void {
		this.initForm();
	}

	// convenience getter for easy access to form fields
	get f() {
		return this.formGroup.controls;
	}

 //Form init
	initForm() {
		this.formGroup = this.fb.group({
			email: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(30), Validators.email])],
		});
	}
  //Final submit
	submit() {
		this.sharedService.showLoader();
		if (!this.isLoading) {
			this.isLoading = true;
			const formData = {}
			formData['email'] = this.formGroup.controls.email.value;
			this.authHTTPService.userForgotPassword(formData).subscribe((res: any) => {
				this.sharedService.hideLoader();
				if (res) {
					this.isLoading = false;
					this.sharedService.swalSuccess(res.message);
					this.router.navigate(['/auth/login']);
				}
			}, err => {
				this.isLoading = false;
				this.sharedService.swalError(err);
			})
		}
	}

	// helpers for View
	isControlValid(controlName: string): boolean {
		const control = this.formGroup.controls[controlName];
		return control.valid && (control.dirty || control.touched);
	}

	isControlInvalid(controlName: string): boolean {
		const control = this.formGroup.controls[controlName];
		return control.invalid && (control.dirty || control.touched);
	}

	controlHasError(validation, controlName): boolean {
		const control = this.formGroup.controls[controlName];
		return control.hasError(validation) && (control.dirty || control.touched);
	}

	isControlTouched(controlName): boolean {
		const control = this.formGroup.controls[controlName];
		return control.dirty || control.touched;
	}
}
