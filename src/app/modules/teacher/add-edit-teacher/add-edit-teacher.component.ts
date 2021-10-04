import { DatePipe } from '@angular/common';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { TeacherService } from 'src/app/services/teacher.service';
import { SharedService } from 'src/app/shared/services/shared.service';
import { DistrictService, SchoolsService, StatesService } from 'src/app/services';
import { EndorsmentsService } from 'src/app/services/endorsments.service';
import Swal from 'sweetalert2';
import { AuthService } from 'src/app/auth/_service/auth.service';
import { GradesService } from 'src/app/services/grades.service';

@Component({
  selector: 'app-add-edit-teacher',
  templateUrl: './add-edit-teacher.component.html',
  styleUrls: ['./add-edit-teacher.component.css']
})

export class AddEditTeacherComponent implements OnInit {
  @Input() teacher: any;
  @Input() viewData: any;
  isLoading: boolean = false;
  editable = false;
  viewble = false;
  formGroup: FormGroup;
  stateList = [];
  districtList = [];
  endorsementList = [];
  schoolList = [];
  gradeList = [];
  setDob: any;
  disableSchoolSelection = false;
  defaultSchoolId = '';
  showDistrict = false;
  validPattern = /^[a-zA-Z0-9]{6}$/;
  alphaNumericPattern = /^[A-Za-z]{3}[0-9]{3}$/;
  show_button: Boolean = false;
  show_eye: Boolean = false;
  constructor(
    private fb: FormBuilder,
    public modal: NgbActiveModal,
    public teachers: TeacherService,
    public stateservice: StatesService,
    public districtservice: DistrictService,
    public shcoolservice: SchoolsService,
    public endorsmentsService: EndorsmentsService,
    public datepipe: DatePipe,
    public sharedservice: SharedService,
    public gradeservice: GradesService,
    public authService: AuthService
  ) { }

  ngOnInit(): void {
    this.sharedservice.showLoader();
    this.loadForm();
    this.getSchool();
    this.getState();
    this.getAllGrade();
    this.getEndorsement();
    this.viewDetails();
    // this.sharedservice.hideLoader();
  }

  setDefaultSchool() {
    let role = this.sharedservice.getRole();
    if (role === "Super-Admin") {
      this.disableSchoolSelection = false;
    } else if (role === "School-Admin" || role === "School-Sub-Admin") {
      this.disableSchoolSelection = true;
      this.authService.currentUserSubject.subscribe((res: any) => {
        if (res?.data?.schoolId) {
          this.defaultSchoolId = res?.data?.schoolId;
          // Set Default School in teacher add form control
          this.formGroup.controls.schoolId.setValue(this.defaultSchoolId);
          this.formGroup.controls.schoolId.updateValueAndValidity();
          this.formGroup.controls.schoolId.disable();
        }
      });
    }
  }
  //Load Form
  loadForm() {
    if (!this.teacher) {
      this.editable = false;
      this.setFormGroup();
      this.formGroup.controls['countryCode'].setValue('+1');
      this.formGroup.controls['country'].setValue('United State');
      this.sharedservice.hideLoader();

    } else {
      this.editable = true;
      //this.viewble = false;
      this.setFormGroup();
      this.formGroup.controls['countryCode'].setValue('+1');
      this.formGroup.controls['country'].setValue('United State');
      this.formGroup.controls['firstName'].setValue(this.teacher?.firstName);
      this.formGroup.controls['lastName'].setValue(this.teacher?.lastName);
      this.formGroup.controls['phoneNumber'].setValue(this.teacher?.users[0].phoneNumber);
      //this.formGroup.controls['addressLine1'].setValue(this.teacher?.addressLine1);
      //this.formGroup.controls['addressLine2'].setValue(this.teacher?.addressLine2);
      this.formGroup.controls['stateId'].setValue(this.teacher?.stateId);
      this.formGroup.controls['gradeIds'].setValue(this.teacher?.gradeIds);
      // Set District on State change
      this.getDistrict(this.teacher?.stateId);
      this.formGroup.controls['dateOfBirth'].setValue(this.datepipe.transform(this.teacher?.dateOfBirth, 'yyyy-MM-dd'))

    }
  }

  //View Details
  viewDetails() {
    if (this.viewData) {
      this.viewble = true;
      this.editable = false;
      this.setFormGroup();
      this.formGroup.controls['firstName'].setValue(this.viewData?.firstName);
      this.formGroup.controls['lastName'].setValue(this.viewData?.lastName);
      this.formGroup.controls['countryCode'].setValue('+1');
      this.formGroup.controls['phoneNumber'].setValue(this.viewData?.users[0].phoneNumber);
      this.formGroup.controls['email'].setValue(this.viewData?.users[0].email);
      this.formGroup.controls['endorsementId'].setValue(this.viewData?.endorsementId);
      // this.formGroup.controls['teacherId'].setValue(this.viewData?.teacherId);
      this.formGroup.controls['edId'].setValue(this.viewData?.edId);
      this.formGroup.controls['schoolId'].setValue(this.viewData?.schoolId);
      this.formGroup.controls['stateId'].setValue(this.viewData?.stateId);
      this.formGroup.controls['gradeIds'].setValue(this.viewData?.gradeIds);
      // this.formGroup.controls['addressLine1'].setValue(this.viewData?.addressLine1);
      // this.formGroup.controls['addressLine2'].setValue(this.viewData?.addressLine2);
      this.formGroup.controls['dateOfBirth'].setValue(this.datepipe.transform(this.viewData?.dateOfBirth, 'yyyy-MM-dd'))
      this.getDistrict(this.viewData?.stateId);
      this.formGroup.disable();
      this.sharedservice.hideLoader();
    } else {
      this.sharedservice.hideLoader();
      this.viewble = false;
    }

  }

  //Set Form Group
  setFormGroup() {
    this.formGroup = this.fb.group({
      firstName: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(50)])],
      lastName: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(50)])],
      countryCode: [''],
      phoneNumber: ['', Validators.compose([Validators.required, Validators.min(1000000000), Validators.max(999999999999)])],
      email: ['', Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(50), Validators.email])],
      password: ['', Validators.compose([Validators.required, Validators.minLength(8), Validators.maxLength(50)])],
      endorsementId: [null, Validators.compose([Validators.required])],
      // teacherId: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(6)])],
      edId: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(6)])],
      schoolId: [null, Validators.compose([Validators.required])],
      gradeIds: [null, Validators.compose([Validators.required])],
      country: [''],
      stateId: [null, Validators.compose([Validators.required])],
      districtId: [null, Validators.compose([Validators.required])],
      //addressLine1: ['', Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(50)])],
      //addressLine2: [''],
      dateOfBirth: [new Date()],
      setDob: [this.datepipe.transform(new Date(), 'yyyy-MM-dd')]
    });
  }

  //Final Save
  save(type) {
    if (type == 'save') {
      this.create();
    } else {
      this.edit();
    }
  }

  //Add Create
  create() {
    if (this.formGroup.invalid) {
      return
    }
    const formData = {};
    formData['firstName'] = this.formGroup.controls.firstName.value;
    formData['lastName'] = this.formGroup.controls.lastName.value;
    formData['countryCode'] = this.formGroup.controls.countryCode.value;
    formData['phoneNumber'] = String(this.formGroup.controls.phoneNumber.value);
    formData['email'] = this.formGroup.controls.email.value;
    formData['password'] = this.formGroup.controls.password.value;
    formData['endorsementId'] = this.formGroup.controls.endorsementId.value;
    // formData['teacherId'] = this.formGroup.controls.teacherId.value;
    formData['edId'] = this.formGroup.controls.edId.value;
    formData['schoolId'] = this.formGroup.controls.schoolId.value;
    formData['gradeIds'] = this.formGroup.controls.gradeIds.value;
    formData['country'] = this.formGroup.controls.country.value;
    formData['stateId'] = this.formGroup.controls.stateId.value;
    formData['districtId'] = this.formGroup.controls.districtId.value;
    formData['dateOfBirth'] = this.formGroup.controls.setDob.value;
    // formData['addressLine1'] = this.formGroup.controls.addressLine1.value;
    // formData['addressLine2'] = this.formGroup.controls.addressLine2.value;
   
    if (!this.isLoading) {
      this.isLoading = true;
      this.teachers.addTeacher(formData).subscribe((res: any) => {
        if (res) {
          this.isLoading = false;
          this.modal.close();
          this.sharedservice.swalSuccess(res.message);
        }
      }, err => {
        this.isLoading = false;
        this.sharedservice.swalError(err);
      })
    }

  }

  //Edit Update
  edit() {
    const formData = {};
    formData['firstName'] = this.formGroup.controls.firstName.value;
    formData['lastName'] = this.formGroup.controls.lastName.value;
    formData['countryCode'] = this.formGroup.controls.countryCode.value;
    formData['phoneNumber'] = String(this.formGroup.controls.phoneNumber.value);
    formData['country'] = this.formGroup.controls.country.value;
    formData['stateId'] = this.formGroup.controls.stateId.value;
    formData['districtId'] = this.formGroup.controls.districtId.value;
    formData['dateOfBirth'] = this.formGroup.controls.setDob.value;
    formData['gradeIds'] = this.formGroup.controls.gradeIds.value;
    // formData['addressLine1'] = this.formGroup.controls.addressLine1.value;
    // formData['addressLine2'] = this.formGroup.controls.addressLine2.value;
   
    if (!this.isLoading) {
      this.isLoading = true;
      this.teachers.updateTeacher(formData, this.teacher._id).subscribe((res: any) => {
        if (res) {
          this.isLoading = false;
          this.modal.close();
          this.sharedservice.swalSuccess(res.message);
        }
      }, err => {
        this.isLoading = false;
        this.sharedservice.swalError(err);
      })
    }
  }

  //Fetch State
  getState() {
    this.stateservice.getState('', 'false', '', '').subscribe((res: any) => {
      if (res) {
        this.stateList = res.data;
      }
    })
  }


  //Fetch District
  getDistrict(data: any) {
    this.districtList = []
    this.f.districtId.setValue('');
    let stateId = data?._id;
    this.districtservice.getDistrict('', stateId, 'false', '', '').subscribe((res: any) => {
      this.showDistrict = true;
      this.districtList = res.data;
      if (this.editable) {
        this.formGroup.controls['districtId'].setValue(this.teacher?.districtId);
      }
      if (this.viewData) {
        this.formGroup.controls['districtId'].setValue(this.viewData?.districtId);
        this.formGroup.disable();
      }
    })
  }

  //Fetch Endorsement
  getEndorsement() {
    this.endorsmentsService.getEndorsments('', 'false', '', '').subscribe((res: any) => {
      if (res) {
        this.endorsementList = res.data;
      }
    })
  }

  //Fetch School
  getSchool() {
    this.shcoolservice.getAllSchool('', '', '', 'false', '', '').subscribe((res: any) => {
      this.schoolList = res.data;
    })
    this.setDefaultSchool();
  }

  //Get Grade
  getAllGrade() {
    this.gradeservice.getGrades('', 'false').subscribe((res: any) => {
      if (res) {
        this.gradeList = res.data;
      }
    })
  }

  // Date of Birth
  dateofBirth(type: string, event: MatDatepickerInputEvent<Date>) {
    this.formGroup.controls['setDob'].setValue(this.datepipe.transform(event.value, 'yyyy-MM-dd'))
  }

  //Close model
  cancel() {
    this.modal.close();
  }

  get f() {
    return this.formGroup.controls;
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








