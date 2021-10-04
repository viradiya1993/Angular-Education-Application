import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthHTTPService } from 'src/app/auth/_service/auth-http.service';
import { AuthService } from 'src/app/auth/_service/auth.service';
import { MustMatch } from 'src/app/auth/_service/confirm-password.validator';
import { SharedService } from 'src/app/shared/services/shared.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  formGroup: FormGroup;
  formChangePassword: FormGroup;
  isLoading: boolean = false;
  userId: any;
  headerValue = '';
  show_button: Boolean = false;
  show_eye: Boolean = false;
  show_newbutton: Boolean = false;
  show_confirmbutton: Boolean = false;
  show_neweye: Boolean = false;
  show_confirmeye: Boolean = false;
  constructor(private router: Router, public fb: FormBuilder, public auth: AuthService, public authHttp: AuthHTTPService, public shared: SharedService) {
    this.shared.showLoader();
  }


  ngOnInit(): void {
    this.loadForm();
    this.loadChangePasswordForm();
    this.auth.currentUserSubject.subscribe((res: any) => {
      if (res) {
        this.shared.hideLoader();
        this.userId = res.data._id;
        this.formGroup.patchValue(res.data)
      }
    });
    this.headerValue = localStorage.getItem('role');
  }


  //Load Form Data
  loadForm() {
    this.formGroup = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      countryCode: ['', Validators.required],
      phoneNumber: ['', Validators.required],
    });
  }

  loadChangePasswordForm() {
    this.formChangePassword = this.fb.group({
      oldPassword: [
        '',
        Validators.compose([
          Validators.required,
        ]),
      ],
      newPassword: [
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(50),
        ]),
      ],
      confirmPassword: ['', Validators.required]
    }, {
      validator: MustMatch('newPassword', 'confirmPassword')
    })
  }

  //Final Save
  save() {
    if (this.formGroup.invalid) {
      return
    }
    this.shared.showLoader();
    const formData = this.formGroup.value;
    this.authHttp.updateUserProfile(formData, this.userId).subscribe((res: any) => {
      if (res) {
        this.shared.hideLoader();
        this.auth.currentUserSubject.next(res);
        this.shared.swalSuccess(res.message);
      }
    }, err => {
      this.shared.hideLoader();
      this.shared.swalError(err)
    })
  }

  updatePassword() {
    if (this.formChangePassword.invalid) {
      return
    }
    this.shared.showLoader();
    const formData = {}
    formData['userId'] = this.userId;
    formData['oldPassword'] = this.formChangePassword.controls.oldPassword.value;
    formData['newPassword'] = this.formChangePassword.controls.newPassword.value;

    this.authHttp.chnagedPasswprd(formData).subscribe((res: any) => {
      if (res) {
        this.shared.hideLoader();
        this.formChangePassword.reset();
        this.shared.swalSuccess(res.message);
      }
    }, err => {
      this.shared.hideLoader();
      this.formChangePassword.reset();
      this.shared.swalError(err)
    })

  }
  //Cancel
  cancel() {
    this.router.navigate(['/dashboard'])
  }
  get f() { return this.formChangePassword.controls; }

  showPassword() {
    this.show_button = !this.show_button;
    this.show_eye = !this.show_eye;
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

  // helpers for View
  isControlPasswordValid(controlName: string): boolean {
    const control = this.formChangePassword.controls[controlName];
    return control.valid && (control.dirty || control.touched);
  }

  isControlPasswordInvalid(controlName: string): boolean {
    const control = this.formChangePassword.controls[controlName];
    return control.invalid && (control.dirty || control.touched);
  }

  controlPasswordHasError(validation, controlName): boolean {
    const control = this.formChangePassword.controls[controlName];
    return control.hasError(validation) && (control.dirty || control.touched);
  }

  isControlPasswordTouched(controlName): boolean {
    const control = this.formChangePassword.controls[controlName];
    return control.dirty || control.touched;
  }
}
