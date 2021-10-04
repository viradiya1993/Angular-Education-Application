import { ThrowStmt } from '@angular/compiler';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbDateAdapter, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';

import { SchooladminService } from 'src/app/services';
import { SharedService } from 'src/app/shared/services/shared.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-edit-schooladmin',
  templateUrl: './edit-schooladmin.component.html',
  styleUrls: ['./edit-schooladmin.component.scss']
})

export class EditSchooladminComponent implements OnInit {
  @Input() data: any;
  isLoading: boolean = false;
  formGroupData: FormGroup;
  editable = false;
  show_button: Boolean = false;
  show_eye: Boolean = false;

  constructor(
    public schoolAdmin: SchooladminService,
    private fb: FormBuilder,
    public modal: NgbActiveModal,
    public sharedService: SharedService) { }

  ngOnInit(): void {
    this.loadCustomer();
  }

  loadCustomer() {
    if (!this.data) {
      this.editable = false;
      this.loadForm();
    } else {
      this.editable = true;
      this.loadForm();
      this.formGroupData.controls['firstName'].setValue(this.data.firstName)
      this.formGroupData.controls['lastName'].setValue(this.data.lastName)
      this.formGroupData.controls['countryCode'].setValue(this.data.countryCode)
      this.formGroupData.controls['phoneNumber'].setValue(this.data.phoneNumber)
    }
  }



  loadForm() {
    this.formGroupData = this.fb.group({
      firstName: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
      lastName: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
      countryCode: ['+1'],
      phoneNumber: ['', Validators.compose([Validators.required, Validators.min(1000000000), Validators.max(999999999999)])],
      email: ['', Validators.compose([Validators.required])],
      password: ['', Validators.compose([Validators.required, Validators.minLength(8), Validators.maxLength(50)])],
    });
  }

  save() {
    if (this.editable) {
      this.edit();
    } else {
      this.create();
    }
  }

  create() {
    const formData = {};
    formData['firstName'] = this.formGroupData.controls.firstName.value;
    formData['lastName'] = this.formGroupData.controls.lastName.value;
    formData['countryCode'] = this.formGroupData.controls.countryCode.value;
    formData['phoneNumber'] = this.formGroupData.controls.phoneNumber.value;
    formData['email'] = this.formGroupData.controls.email.value;
    formData['password'] = this.formGroupData.controls.password.value;

    if (!this.isLoading) {
      this.isLoading = true;
      this.schoolAdmin.createSchoolAdmin(formData).subscribe((res: any) => {
        if (res) {
          this.isLoading = false;
          this.modal.close();
          this.sharedService.swalSuccess(res.message);
          //this.sharedService.loggerSuccess(res.message);
        }
      }, err => {
        this.isLoading = false;
        this.sharedService.swalError(err);
        //this.sharedService.loggerError(err);
      });
    }
  }

  edit() {
    const formData = {};
    formData['firstName'] = this.formGroupData.controls.firstName.value;
    formData['lastName'] = this.formGroupData.controls.lastName.value;
    formData['countryCode'] = this.formGroupData.controls.countryCode.value;
    formData['phoneNumber'] = this.formGroupData.controls.phoneNumber.value;
    if (!this.isLoading) {
      this.isLoading = true;
      this.schoolAdmin.updateSchoolAdmin(formData, this.data._id).subscribe((res: any) => {
        if (res) {
          this.isLoading = false;
          this.modal.close();
          this.sharedService.swalSuccess(res.message);
        }
      }, err => {
        this.isLoading = false;
        this.sharedService.swalError(err);
      })
    }
  }

  //cancel
  cancel() {
    this.modal.close();
  }
  ngOnDestroy(): void {

  }

  showPassword() {
    this.show_button = !this.show_button;
    this.show_eye = !this.show_eye;
  }

  // helpers for View
  isControlValid(controlName: string): boolean {
    const control = this.formGroupData.controls[controlName];
    return control.valid && (control.dirty || control.touched);
  }

  isControlInvalid(controlName: string): boolean {
    const control = this.formGroupData.controls[controlName];
    return control.invalid && (control.dirty || control.touched);
  }

  controlHasError(validation, controlName): boolean {
    const control = this.formGroupData.controls[controlName];
    return control.hasError(validation) && (control.dirty || control.touched);
  }

  isControlTouched(controlName): boolean {
    const control = this.formGroupData.controls[controlName];
    return control.dirty || control.touched;
  }

}
