import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { element } from 'protractor';
import { AuthService } from 'src/app/auth/_service/auth.service';
import { QuestionnaireService } from 'src/app/services/questionnaire.service';
import { StudentsService } from 'src/app/services/students.service';
import { SharedService } from 'src/app/shared/services/shared.service';

@Component({
  selector: 'app-dokform',
  templateUrl: './dokform.component.html',
  styleUrls: ['./dokform.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class DokformComponent implements OnInit {
  formDokedStudent: FormGroup;
  studentList = [];
  questionArray = [];
  defaultSchoolId = '';
	defaultDistrictId = '';
  showQuestions = false;
  showComment = false;
  showCheckbox = false;
  showForm = false;
  showDefaultQuestion = false;
  defaultQuestionArray = [];
  selectedQuestionArray = [];
  initialQuestionArray = [];
  requiredQuestionArray = [];
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private studentService: StudentsService,
    private questionService: QuestionnaireService,
    private sharedService: SharedService
  ) {
    this.sharedService.showLoader();
    this.authService.currentUserSchoolId.subscribe(res => {
      if (res) {
        this.defaultSchoolId = res;
      } else {
        if (this.sharedService.checkIfUserLoggedIn()) {
          let errMsg = "No School Has been assigned to You! Please ask admin to assign you a School"
          this.sharedService.swalError(errMsg);
        }
      }
    });
		this.authService.currentUserDistructId.subscribe((res: any) => {
			this.defaultDistrictId = res;
		});
  }

  ngOnInit(): void {
    this.getStudentList();
    this.loadForm();
  }
  //Load Form Data
  loadForm() {
    this.formDokedStudent = this.fb.group({
      studentId: [null, Validators.compose([Validators.required])],
			districtId:[null],
      queAns: [],
      comment: ['']
    });
  }
  getStudentList() {
    this.studentService.getActiveStudents(this.defaultSchoolId).subscribe((res: any) => {
      if (res) {
        this.studentList = res.data;
        this.sharedService.hideLoader();
      }
    })
  }

  getQuestionList() {
    this.questionService.getQuestionBySchoolId(this.defaultSchoolId).subscribe((res: any) => {
      if (res) {
        this.initialQuestionArray = res.data;
        this.defaultQuestionArray = this.initialQuestionArray.filter(x => x.default === true);
        this.questionArray = this.initialQuestionArray.filter(x => x.default === false);
        this.requiredQuestionArray = this.initialQuestionArray.filter(x => x.isRequired === true);
        this.sharedService.hideLoader();
      }
    })
  }

  onStudentChange(e) {
    this.sharedService.showLoader();
    this.selectedQuestionArray = [];
    this.showDefaultQuestion = false;
    this.showComment = false;
    this.showForm = false;
    if (e) {
      this.showDefaultQuestion = true;
      this.getQuestionList();
    } else {
      this.sharedService.hideLoader();
      // Set Validation for comment
      this.formDokedStudent.controls.comment.setValidators(null);
      this.formDokedStudent.controls.comment.updateValueAndValidity();
    }
  }


  // For Defalut Check 
  onChangeDropdownDefault(value, question) {
  }
  onChangeRadioBoxDefault(value, question) {
  }
  onChangeCheckBoxDeafult(value, question) {
    if (value === question.otherAnsRequiredValue && question.otherAnsRequired) {
      this.showComment = true;
      this.showForm = false;
      // Set Validation for comment
      this.formDokedStudent.controls.comment.setValidators([Validators.required]);
      this.formDokedStudent.controls.comment.updateValueAndValidity();
    } else {
      this.selectedQuestionArray = [];
      this.showComment = false;
      this.showForm = true;
      // Set Validation for comment
      this.formDokedStudent.controls.comment.setValidators(null);
      this.formDokedStudent.controls.comment.updateValueAndValidity();
    }
    // find index to set value on double checked
    let index = this.selectedQuestionArray.findIndex(x => x.questionId === question._id);
    // Check if index is available
    if (index > -1) {
      this.selectedQuestionArray[index]["answer"] = value;
    } else {
      this.selectedQuestionArray.push(
        {
          "questionId": question._id,
          "answer": value
        }
      );
    }
  }

  onChangeTextboxDeafault(value, question) {
  }

  // comment 
  onChangeComment(value, question) {
    // find index to set value on double checked
    let index = this.selectedQuestionArray.findIndex(x => x.questionId === question._id);
    // Check if index is available
    if (index > -1) {
      this.selectedQuestionArray[index]["otherAns"] = value;
    }
  }

  // For Not deafault Questions
  onChangeCheckBoxSingle(value, isChecked, question_id) {
    // find index to set value on double checked
    let index = this.selectedQuestionArray.findIndex(x => x.questionId === question_id);
    // Check if index is available
    if (isChecked) {
      if (index > -1) {
        this.selectedQuestionArray[index]["answer"] = value;
      } else {
        this.selectedQuestionArray.push(
          {
            "questionId": question_id,
            "answer": value
          }
        );
      }
    } else {
      this.selectedQuestionArray.splice(index, 1);
    }
  }

  onChangeCheckBoxMultiple(value, isChecked, question_id) {
    // find index to set value on double checked
    let index = this.selectedQuestionArray.findIndex(x => x.questionId === question_id);
    // Check if index is available
    if (isChecked) {
      if (index > -1) {
        this.selectedQuestionArray[index].answer.push(value);
      } else {
        this.selectedQuestionArray.push(
          {
            "questionId": question_id,
            "answer": [value]
          }
        );
      }
    } else {
      if (index > -1) {
        this.selectedQuestionArray[index].answer.pop(value);
      } else {
        this.selectedQuestionArray.splice(index, 1);
      }
    }
  }

  onChangeRadioBox(value, question_id) {
    // find index to set value on double checked
    let index = this.selectedQuestionArray.findIndex(x => x.questionId === question_id);
    // Check if index is available
    if (index > -1) {
      this.selectedQuestionArray[index]["answer"] = value;
    } else {
      this.selectedQuestionArray.push(
        {
          "questionId": question_id,
          "answer": value
        }
      );
    }
  }

  onChangeDropdown(value, question_id, answerType) {
    let answerTypeOnSubmit = answerType === 'number' ? Number : String;
    // find index to set value on double checked
    let index = this.selectedQuestionArray.findIndex(x => x.questionId === question_id);
    // Check if index is available
    if (index > -1) {
      if (value) {
        this.selectedQuestionArray[index]["answer"] = answerTypeOnSubmit(value);
      } else {
        this.selectedQuestionArray.splice(index, 1);
      }
    } else {
      this.selectedQuestionArray.push(
        {
          "questionId": question_id,
          "answer": answerTypeOnSubmit(value)
        }
      );
    }
  }


  onChangeTextbox(value, question_id) {
    // find index to set value on double checked
    let index = this.selectedQuestionArray.findIndex(x => x.questionId === question_id);
    // Check if index is available
    if (index > -1) {
      this.selectedQuestionArray[index]["answer"] = value;
    } else {
      this.selectedQuestionArray.push(
        {
          "questionId": question_id,
          "answer": value
        }
      );
    }
  }


  submit() {
    if (this.formDokedStudent.invalid) {
      return
    }

    this.sharedService.showLoader();
    if (this.showForm) {
      let err = "Please Complete All Required questions to Submit Today's Data";
      if (this.selectedQuestionArray.length) {

        let isQuestionSelected = [];
        for (let index = 0; index < this.requiredQuestionArray.length; index++) {
          const element = this.requiredQuestionArray[index];
          for (let index = 0; index < this.selectedQuestionArray.length; index++) {
            const el = this.selectedQuestionArray[index];
            if (element._id === el.questionId) {
              isQuestionSelected.push(el);
            }
          }
        }

        if (isQuestionSelected.length < this.requiredQuestionArray.length) {
          this.sharedService.swalError(err);
          this.sharedService.hideLoader();
          return
        }
      }
    } else {
      let defaultErrMsg = "Please Complete Default Question to Submit Today's Data"
      if (this.selectedQuestionArray.length < this.defaultQuestionArray.length) {
        this.sharedService.swalError(defaultErrMsg);
        this.sharedService.hideLoader();
        return
      }
    }
    // Set Form to Submit
    let formData = {};
    formData["studentId"] = this.formDokedStudent.controls.studentId.value;
    formData["queAns"] = this.selectedQuestionArray;
		formData["districtId"] = this.defaultDistrictId;
		
    this.studentService.craeteQuestionStudent(formData).subscribe((res: any) => {
      if (res) {
        this.sharedService.hideLoader();
        this.sharedService.swalSuccess(res.message);
        this.formDokedStudent.reset();
        this.onStudentChange(null);
      }
    }, err => {
      this.sharedService.hideLoader();
      this.sharedService.swalError(err);
      this.formDokedStudent.reset();
      this.onStudentChange(null);

    })
  }

  // helpers for View
  isControlValid(controlName: string): boolean {
    const control = this.formDokedStudent.controls[controlName];
    return control.valid && (control.dirty || control.touched);
  }

  isControlInvalid(controlName: string): boolean {
    const control = this.formDokedStudent.controls[controlName];
    return control.invalid && (control.dirty || control.touched);
  }

  controlHasError(validation, controlName): boolean {
    const control = this.formDokedStudent.controls[controlName];
    return control.hasError(validation) && (control.dirty || control.touched);
  }

  isControlTouched(controlName): boolean {
    const control = this.formDokedStudent.controls[controlName];
    return control.dirty || control.touched;
  }
}
