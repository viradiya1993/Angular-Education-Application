import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SchoolsService } from 'src/app/services';
import { QuestionnaireService } from 'src/app/services/questionnaire.service';
import { AppConst } from 'src/app/shared/constant/app.constant';
import { SharedService } from 'src/app/shared/services/shared.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {
  @Input() question: any;

  isLoading: boolean = false;
  editable = false;
  viewble = false;
  viewData = false;
  formGroup: FormGroup;
  questionTypeList = AppConst.questionTypeArray;
  answerTypeList = AppConst.answerTypeArray;
  blankArray = [];
  optionArray = [];
  otherOptionArray = [];
  selectedPersons;
  showAnswerOption = false;

  schoolList = [];
  showSchool = false;
  showIsAssigned = false;
  showDefaultOption = false;
  showRequiredValue = false;
  isCommentSelected = false;
  showIsMultiple = false;
  constructor(
    public modal: NgbActiveModal,
    private fb: FormBuilder,
    private questionService: QuestionnaireService,
    private sharedService: SharedService,
    private schoolService: SchoolsService,
  ) { }
  ngOnInit(): void {
    this.loadForm();
    this.isDefaultSelected();
  }

  isDefaultSelected() {
    this.questionService.deafultSelected().subscribe((res: any) => {
      if (!res.message) {
        this.showDefaultOption = true
        // this.formGroup.controls.default.setValue(true);
      } else {
        if (this.question) {
          if (this.question.default) {
            this.formGroup.controls.default.setValue('true');
            this.showDefaultOption = true;
          } else {
            this.formGroup.controls.default.setValue('false')
            this.showDefaultOption = false;
          }
          this.showIsAssigned = true;
        } else {
          this.formGroup.controls.default.setValue(false);
          this.showDefaultOption = false;
          this.showIsAssigned = true;
        }
      }
    })
  }
  //Set Form Group
  setFormGroup() {
    this.formGroup = this.fb.group({
      questionType: [null, Validators.compose([Validators.required])],
      answerType: [null, Validators.compose([Validators.required])],
      question: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(50)])],
      option: [null],
      isSelectMultiple: [''],
      isRequired: [''],
      default: [''],
      otherAnsRequired: [''],
      otherAnsRequiredValue: [null],
      isAssignAllSchool: [''],
      assignedSchool: [null]
    });
  }

  //Load Form
  loadForm() {
    if (!this.question) {
      this.editable = false;
      this.setFormGroup();
    } else {
      this.editable = true;
      this.setFormGroup();
      this.setOnEdit();
    }
  }

  setOnEdit() {
    this.formGroup.patchValue(this.question);
    this.getValues(this.question.questionType);
    this.blankArray = this.question.option;
    this.setSchoolList();

    // Set checkbox for isRequired
    this.question.isRequired === true ?
      this.formGroup.controls.isRequired.setValue('true') :
      this.formGroup.controls.isRequired.setValue('false');

    // Set checkbox for isSelectMultiple
    this.question.isSelectMultiple === true ?
      this.formGroup.controls.isSelectMultiple.setValue('true') :
      this.formGroup.controls.isSelectMultiple.setValue('false');
    // Set checkbox and API call for school listing
    if (this.question.isAssignAllSchool === true) {
      this.formGroup.controls.isAssignAllSchool.setValue('true');
      this.formGroup.controls.assignedSchool.setValue(this.question.assignedSchool);
    } else {
      this.formGroup.controls.isAssignAllSchool.setValue('false');
      this.showSchool = true;
    }
    // Set checkbox and API call for school listing
    if (this.question.otherAnsRequired === true) {
      this.formGroup.controls.otherAnsRequired.setValue('true');
      this.otherOptionArray = this.question.option;
      this.showRequiredValue = true;
      this.formGroup.controls.otherAnsRequiredValue.setValue(this.question.otherAnsRequiredValue);
    } else {
      this.formGroup.controls.otherAnsRequired.setValue('false');
      this.showRequiredValue = false;
    }
  }

  setSchoolList() {
    // Set State Array
    this.schoolService.getSchoolWithoutFilter().subscribe((res: any) => {
      this.schoolList = res.data;
    });
  }

  isCommentTrue(e) {
    if (e.target.value) {
      this.otherOptionArray.length > 0 ? this.showRequiredValue = true : this.showRequiredValue = false;
      this.isCommentSelected = true;
      this.formGroup.controls.otherAnsRequiredValue.setValidators([Validators.required]);
      this.formGroup.controls.otherAnsRequiredValue.updateValueAndValidity();
    }
  }

  isCommentFalse(e) {
    if (e.target.value) {
      this.showRequiredValue = false;
      this.formGroup.controls.otherAnsRequiredValue.setValidators(null);
      this.formGroup.controls.otherAnsRequiredValue.updateValueAndValidity();
    }
  }

  defalutChangeTrue(e) {
    if (e.target.value) {
      this.showIsAssigned = false;
      this.formGroup.controls.default.setValue('true');
      this.formGroup.controls.isAssignAllSchool.setValue('true');
      this.formGroup.controls.isAssignAllSchool.setValidators(null);
      this.formGroup.controls.isAssignAllSchool.updateValueAndValidity();
    }
  }

  defalutChangeFalse(e) {
    if (e.target.value) {
      this.showIsAssigned = true;
      this.formGroup.controls.default.setValue('false');
      this.formGroup.controls.isAssignAllSchool.setValue('');
      this.formGroup.controls.isAssignAllSchool.setValidators([Validators.required]);
      this.formGroup.controls.isAssignAllSchool.updateValueAndValidity();
    }
  }

  isAssignedChangeTrue(e) {
    if (e.target.value) {
      this.showSchool = false;
      this.formGroup.controls.assignedSchool.setValidators(null);
      this.formGroup.controls.assignedSchool.updateValueAndValidity();
    }
  }

  isAssignedChangeFalse(e) {
    if (e.target.value) {
      this.showSchool = true;
      this.setSchoolList();
      this.formGroup.controls.assignedSchool.setValidators([Validators.required]);
      this.formGroup.controls.assignedSchool.updateValueAndValidity();
    }
  }

  setArrayForOther(event) {
    if (event) {
      this.isCommentSelected ? this.showRequiredValue = true : this.showRequiredValue = false;
      this.otherOptionArray = event;
    } else {
      this.otherOptionArray = [];
      this.showRequiredValue = false;
    }
  }
  
  getValues(event) {
    if (event) {
      this.editable ? event = event : event = event.value;
      if (event !== "textbox") {
        this.showAnswerOption = true;
        this.showIsMultiple = true;
        this.formGroup.controls.option.setValidators([Validators.required]);
        this.formGroup.controls.option.updateValueAndValidity();
      } else {
        this.showAnswerOption = false;
        this.showIsMultiple = false;
        this.formGroup.controls.option.setValidators(null);
        this.formGroup.controls.option.updateValueAndValidity();
      }
    } else {
      this.showAnswerOption = false;
    }
  }

  //Final Save
  save(type) {
    let formData = {};
    formData = this.formGroup.value;
    // Set form data for submit of default
    this.formGroup.controls.default.value === 'true' ?
      formData["default"] = true : formData["default"] = false;

    // Set form data for submit of otherAnsRequired
    this.formGroup.controls.otherAnsRequired.value === 'true' ?
      formData["otherAnsRequired"] = true : formData["otherAnsRequired"] = false;

    // Set form data for submit of isAssignAllSchool
    this.formGroup.controls.isAssignAllSchool.value === 'true' ?
      formData["isAssignAllSchool"] = true : formData["isAssignAllSchool"] = false;

    // Set form data for submit of isRequired
    this.formGroup.controls.isRequired.value === 'true' ?
      formData["isRequired"] = true : formData["isRequired"] = false;

    // Set form data for submit of isSelectMultiple
    this.formGroup.controls.isSelectMultiple.value === 'true' ?
      formData["isSelectMultiple"] = true : formData["isSelectMultiple"] = false;

    // Set form data for submit of assignedSchool array
    this.formGroup.controls.isAssignAllSchool.value === 'false' ?
      formData["assignedSchool"] = this.formGroup.controls.assignedSchool.value : formData["assignedSchool"] = [];

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
    const formData = this.formGroup.value;
    if (!this.isLoading) {
      this.sharedService.showLoader();
      this.isLoading = true;
      this.questionService.addQuestion(formData).subscribe((res: any) => {
        if (res) {
          this.sharedService.hideLoader();
          this.isLoading = false;
          this.modal.close();
          this.sharedService.swalSuccess(res.message)
        }
      }, err => {
        this.sharedService.hideLoader();
        this.isLoading = false;
        this.sharedService.swalError(err);
      })
    }

  }

  //Edit Update
  edit() {
    const formData = this.formGroup.value;
    if (!this.isLoading) {
      this.isLoading = true;
      this.sharedService.showLoader();
      this.questionService.updateQuestion(formData, this.question._id).subscribe((res: any) => {
        if (res) {
          this.sharedService.hideLoader();
          this.isLoading = false;
          this.modal.close();
          this.sharedService.swalSuccess(res.message)
        }
      }, err => {
        this.sharedService.hideLoader();
        this.isLoading = false;
        this.sharedService.swalError(err);
      })
    }
  }

  //Close model
  cancel() {
    this.modal.close();
  }

  get f() {
    return this.formGroup.controls;
  }

  CreateNew(city) {
    // this.optionArray.push(city)
    this.formGroup.controls.option.setValue(city);
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
