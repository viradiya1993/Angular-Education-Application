import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from 'src/app/auth/_service/auth.service';
import { Students } from 'src/app/models/students.model';
import { SchoolsService } from 'src/app/services';
import { GradesService } from 'src/app/services/grades.service';
import { StudentsService } from 'src/app/services/students.service';
import { SharedService } from 'src/app/shared/services/shared.service';

@Component({
  selector: 'app-add-edit-student',
  templateUrl: './add-edit-student.component.html',
  styleUrls: ['./add-edit-student.component.css']
})
export class AddEditStudentComponent implements OnInit {
  @Input() students: any;
  @Input() viewMode: any;
  isLoading: boolean = false;
  school: Students;
  formGroup: FormGroup;

  schoolList = [];
  gradeList = [];
  editMode = false;

  disableSchoolSelection = false;
  defaultSchoolId = null;

  trueFalseArray = [
    {
      value: true,
      name: 'True'
    },
    {
      value: false,
      name: 'False'
    }
  ]
  constructor(
    private schoolService: SchoolsService,
    private fb: FormBuilder,
    public modal: NgbActiveModal,
    public sharedService: SharedService,
    public studentService: StudentsService,
    public gradeservice: GradesService,
    public authService: AuthService
  ) {
  }

  ngOnInit(): void {
    this.sharedService.showLoader();
    this.loadCustomer();
    this.setDefaultSchool();
    this.getAllGrade();
  }


  //Get School
  setSchoolDropdown(schoolId) {
    this.schoolList = [];
    if (schoolId) {
      this.schoolService.getSchoolDataWithID(schoolId).subscribe((res: any) => {
        this.schoolList = res.data;
      })
    } else {
      // Set State Array
      this.schoolService.getSchoolWithoutFilter().subscribe((res: any) => {
        this.schoolList = res.data;
      });
    }
  }

  //Get Grade
  getAllGrade() {
    this.gradeservice.getGrades('','false').subscribe((res: any) => {
      if (res) {
        this.gradeList = res.data;
      }
    })
  }
  setDefaultSchool() {
    let role = this.sharedService.getRole();
    if (role === "Super-Admin") {
      this.disableSchoolSelection = false;
    } else if (role === "School-Admin" || role === "School-Sub-Admin" || role === "Teacher") {
      this.disableSchoolSelection = true;
      this.defaultSchoolId = this.authService.currentUserSchoolIdValue;
      this.formGroup.controls.schoolId.setValue(this.defaultSchoolId);
      this.formGroup.controls.schoolId.disable();
    }
    // Set School Dropdown After setting school Id
    this.setSchoolDropdown(this.defaultSchoolId);
  }

  loadCustomer() {
    if (!this.students) {
      this.editMode = false;
      this.loadForm();
      this.sharedService.hideLoader();
    } else {
      this.editMode = true;
      this.loadForm();
      this.setValueOnEdit();
    }
  }

  //Set Data on View 
  setValueOnEdit() {
    this.formGroup.patchValue(this.students);
    this.formGroup.controls['email'].disable();
    this.formGroup.controls['schoolId'].disable();
    // this.students.missingAnrolmentNo === true ?
    //   this.formGroup.controls.missingAnrolmentNo.setValue('true') : this.formGroup.controls.missingAnrolmentNo.setValue('false');
    this.students.lastYearImprovedFlag === true ?
      this.formGroup.controls.lastYearImprovedFlag.setValue('true') : this.formGroup.controls.lastYearImprovedFlag.setValue('false')
    this.sharedService.hideLoader();
    if (this.viewMode) {
      this.formGroup.disable();
    }
  }

  get f() {
    return this.formGroup.controls;
  }

  //Load Form Data
  loadForm() {
    this.formGroup = this.fb.group({
      studentName: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(20)])],
      email: ['', Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(50), Validators.email])],
      schoolId: [null, Validators.compose([Validators.required])],
      gradeId: [null, Validators.compose([Validators.required])],
      sasId: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(10)])],
      assessementId: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(10)])],
      primaryLanguage: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(20)])],
      programType: [''],
      screeningType: [''],
      screeningScore: [''],
      serviceMinutes: [''],
      comment: [''],
      //missingAnrolmentNo: [''],
      lastYearImprovedFlag: [''],
      yearsOfForeignEducation: [''],
    });
  }

  //Final Save
  save() {
    let formData = {};
    // Check if edit then set formdata
    if (this.editMode) {
      //formData["schoolId"] = this.formGroup.controls.schoolId.value;
      formData["gradeId"] = this.formGroup.controls.gradeId.value;
      formData["studentName"] = this.formGroup.controls.studentName.value;
      formData['email'] = this.formGroup.controls.email.value;
      formData["primaryLanguage"] = this.formGroup.controls.primaryLanguage.value;
      formData["serviceMinutes"] = this.formGroup.controls.serviceMinutes.value;
      formData["programType"] = this.formGroup.controls.programType.value;
      formData["yearsOfForeignEducation"] = Number(this.formGroup.controls.yearsOfForeignEducation.value);
      formData["screeningType"] = this.formGroup.controls.screeningType.value;
      formData["screeningScore"] = this.formGroup.controls.screeningScore.value;
      formData["comment"] = this.formGroup.controls.comment.value;
    } else {
      // Set Formdata for create
      formData = this.formGroup.value;
      if (this.disableSchoolSelection) {
        formData["schoolId"] = this.defaultSchoolId;
      }
      formData["sasId"] = Number(this.formGroup.controls.sasId.value);
      formData["assessementId"] = Number(this.formGroup.controls.assessementId.value);
      formData["yearsOfForeignEducation"] = Number(this.formGroup.controls.yearsOfForeignEducation.value);
    }
    // Set formdata for Last Year
    if (this.formGroup.controls.lastYearImprovedFlag.value === 'true') {
      formData["lastYearImprovedFlag"] = true;
    } else {
      formData["lastYearImprovedFlag"] = false;
    }
    // Set formdata for missingAnrolmentNo
    // if (this.formGroup.controls.missingAnrolmentNo.value === 'true') {
    //   formData["missingAnrolmentNo"] = true;
    // } else {
    //   formData["missingAnrolmentNo"] = false;
    // }

    // Call API endpoints
    if (this.editMode) {
      this.edit(formData);
    } else {
      this.create(formData);
    }
  }

  //Create
  create(value) {
    if (this.formGroup.invalid) {
      return
    }
    this.sharedService.showLoader();
    if (!this.isLoading) {
      this.isLoading = true;
      this.studentService.craeteStudent(value).subscribe((res: any) => {
        if (res) {
          this.sharedService.hideLoader();
          this.isLoading = false;
          this.modal.close();
          this.sharedService.swalSuccess(res.message);
        }
      }, err => {
        this.sharedService.hideLoader();
        this.isLoading = false;
        this.sharedService.swalError(err);
      })
    }
  }

  //Edit
  edit(value) {
    if (this.formGroup.invalid) {
      return
    }
    this.sharedService.showLoader();
    if (!this.isLoading) {
      this.isLoading = true;
      this.studentService.updateStudent(value, this.students._id).subscribe((res: any) => {
        if (res) {
          this.sharedService.hideLoader();
          this.isLoading = false;
          this.modal.close();
          this.sharedService.swalSuccess(res.message);
        }
      }, err => {
        this.sharedService.hideLoader();
        this.isLoading = false;
        this.sharedService.swalError(err);
      })
    }

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
