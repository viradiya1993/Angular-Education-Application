import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Schools } from 'src/app/models/schools.model';
import { SchooladminService } from 'src/app/services/schooladmin.service';
import { SharedService } from 'src/app/shared/services/shared.service';


@Component({
  selector: 'app-school-assing',
  templateUrl: './school-assing.component.html',
  styleUrls: ['./school-assing.component.scss']
})
export class SchoolAssingComponent implements OnInit {
  @Input() data: any;
  isLoading;
  school: Schools;
  formGroup: FormGroup;
  User = [];

  constructor(
    public schoolAdmin: SchooladminService,
    private fb: FormBuilder,
    public modal: NgbActiveModal,
    public sharedservice: SharedService) { }

  ngOnInit(): void {
    this.setSchooladmin();
    this.loadAdmin();
    this.sharedservice.hideLoader();
  }

  // Load Admin Data
  loadAdmin() {
    if (this.data) {
      this.loadForm();
    }
  }

  //Set School Admin
  setSchooladmin() {
    this.schoolAdmin.getSchoolAdmin('', 'false', '', '').subscribe((res: any) => {
      this.User = res.data
    })
  }

  //Load Form data
  loadForm() {
    this.formGroup = this.fb.group({
      userId: [null, Validators.compose([Validators.required])],
    })
  }

  //Final Save
  save() {
    const formData = this.formGroup.value;
    formData['schoolId'] = this.data._id;
    this.schoolAdmin.AssognSchool(formData).subscribe((res: any) => {
      if (res) {
        this.modal.close();
        this.sharedservice.swalSuccess(res.message)
      }
    }, err => {
      this.modal.close();
      this.sharedservice.swalError(err)
    })
  }

  //cancel
  cancel() {
    this.modal.close();
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
