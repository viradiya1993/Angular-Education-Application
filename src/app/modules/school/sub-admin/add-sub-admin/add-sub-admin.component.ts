import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SharedService } from 'src/app/shared/services/shared.service';
import { SubAdminService } from '../../../../services';

@Component({
  selector: 'app-add-sub-admin',
  templateUrl: './add-sub-admin.component.html',
  styleUrls: ['./add-sub-admin.component.scss']
})
export class AddSubAdminComponent implements OnInit {
  @Input() schoolData: any;
  @Input() schoolSubAdmin: any
  isLoading: boolean = false;
  editable = false;
  formGroup: FormGroup;
  show_button: Boolean = false;
  show_eye: Boolean = false;
  constructor(private fb: FormBuilder, public shared: SharedService, public modal: NgbActiveModal, public subAdmin: SubAdminService) { }

  ngOnInit(): void {
    this.setFormData();
  }

  //Set Form Data
  setFormData() {
    if (!this.schoolSubAdmin) {
      this.editable = false;
      this.loadForm();
    } else {
      this.editable = true;
      this.loadForm();
      this.formGroup.controls['firstName'].setValue(this.schoolSubAdmin.firstName)
      this.formGroup.controls['lastName'].setValue(this.schoolSubAdmin.lastName)
      this.formGroup.controls['countryCode'].setValue(this.schoolSubAdmin.countryCode)
      this.formGroup.controls['phoneNumber'].setValue(this.schoolSubAdmin.phoneNumber)
    }
  }

  //Load Form 
  loadForm() {
    this.formGroup = this.fb.group({
      firstName: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(50)])],
      lastName: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(50)])],
      phoneNumber: ['', Validators.compose([Validators.required, Validators.min(1000000000), Validators.max(999999999999)])],
      countryCode: ['+1'],
      email: ['', Validators.compose([Validators.required, Validators.maxLength(30)])],
      password: ['', Validators.compose([Validators.required, Validators.minLength(8), Validators.maxLength(50)])],
    });

  }

  //Create sub admin
  create() {
    if (this.formGroup.invalid) {
      return
    }
    const formData = this.formGroup.value;
    formData['phoneNumber'] = String(this.formGroup.controls.phoneNumber.value)
    formData['schoolId'] = this.schoolData?._id;
   
    if (!this.isLoading) {
      this.isLoading = true;
      this.subAdmin.addSubAdmin(formData).subscribe((res: any) => {
        if (res) {
          this.isLoading = false;
          this.modal.close();
          this.shared.swalSuccess('School-Sub-Admin created successfully Please check your email.');
          //this.shared.loggerSuccess(res.message)
        }
      }, err => {
        this.isLoading = false;
        this.shared.swalError(err)
      })
    }
  }

  //Edit Sub admin
  edit() {
    const formData = {};
    formData['firstName'] = this.formGroup.controls.firstName.value;
    formData['lastName'] = this.formGroup.controls.lastName.value;
    formData['countryCode'] = this.formGroup.controls.countryCode.value;
    formData['phoneNumber'] = String(this.formGroup.controls.phoneNumber.value);
    if (!this.isLoading) {
      this.isLoading = true;
      this.subAdmin.updateSubAdmin(formData, this.schoolSubAdmin._id).subscribe((res: any) => {
        if (res) {
          this.isLoading = false;
          this.modal.close();
          this.shared.swalSuccess(res.message)
        }
      }, err => {
        this.isLoading = false;
        this.shared.swalError(err)
      })
    }

  }

  //Final Save
  save(type) {
    if (type == 'save') {
      this.create();
    } else {
      this.edit();
    }
  }

  //Close model
	cancel() {
		this.modal.close();
	}

  showPassword() {
    this.show_button = !this.show_button;
    this.show_eye = !this.show_eye;
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
