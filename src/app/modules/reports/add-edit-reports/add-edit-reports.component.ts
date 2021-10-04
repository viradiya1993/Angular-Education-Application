import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from 'src/app/auth/_service/auth.service';
import { DistrictService, SchoolsService, StatesService } from 'src/app/services';
import { QuestionnaireService } from 'src/app/services/questionnaire.service';
import { ReportsService } from 'src/app/services/reports.service';
import { StudentsService } from 'src/app/services/students.service';
import { TeacherService } from 'src/app/services/teacher.service';
import { SharedService } from 'src/app/shared/services/shared.service';

@Component({
	selector: 'app-add-edit-reports',
	templateUrl: './add-edit-reports.component.html',
	styleUrls: ['./add-edit-reports.component.css']
})
export class AddEditReportsComponent implements OnInit {
	@Input() reports: any;
	isLoading: boolean = false;
	showDistrict = false;
	showSchool = false;
	showTeachers = false;
	showStudents = false;
	showAnswer = false;
	formGroup: FormGroup;
	sDate: any;
	eDate: any;
	schoolList = [];
	teacherList = [];
	questionsList = [];
	studentList = [];
	answerList = [];
	stateList = [];
	districtList = [];
	disableSchoolSelection = false;
	defaultSchoolId = null;
	constructor(
		public reportservice: ReportsService,
		public shcoolservice: SchoolsService,
		public questionService: QuestionnaireService,
		public teachers: TeacherService,
		public studentservice: StudentsService,
		public stateservice: StatesService,
		public districtservice: DistrictService,
		public authService: AuthService,
		public modal: NgbActiveModal,
		public sharedservice: SharedService,
		private fb: FormBuilder,
		private cd: ChangeDetectorRef,
		public datepipe: DatePipe) { }

	ngOnInit(): void {
		this.getDistrict();
		this.getQuestions();
		this.loadForm();
		this.setDefaultSchool();
	}

	//Load Form
	loadForm() {
		if (!this.reports) {
			this.setFormGroup();
		} else {
			this.setFormGroup();
			this.formGroup.patchValue(this.reports);
			//this.getTeacher(this.reports?.schoolId);
		}
	}

	//Set Form Group
	setFormGroup() {
		this.formGroup = this.fb.group({
			name: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(50)])],
			startDate: [new Date()],
			endDate: [new Date()],
			sDate: [this.datepipe.transform(new Date(), 'yyyy-MM-dd')],
			eDate: [this.datepipe.transform(new Date(), 'yyyy-MM-dd')],
			schoolId: [null],
			teacherId: [null],
			studentId: [null],
			//stateId: [null, Validators.compose([Validators.required])],
			districtId: [null],
			questionId: [null, Validators.compose([Validators.required])],
			answer: [null],
		});
	}

	//Default School Id when School admin or sub admin login
	setDefaultSchool() {
		let role = this.sharedservice.getRole();
		if (role === "Super-Admin") {
			this.showDistrict = true;
			this.disableSchoolSelection = false;
		} else if (role === "School-Admin" || role === "School-Sub-Admin") {
			this.disableSchoolSelection = true;
			this.showDistrict = false;
			this.showTeachers = true;
			this.showStudents = true;
			this.defaultSchoolId = this.authService.currentUserSchoolIdValue;
			this.getSchoolDataWithSchoolId(this.defaultSchoolId);
			//this.getTeacherWithId(this.defaultSchoolId);
			this.formGroup.controls.schoolId.setValue(this.defaultSchoolId);
			this.formGroup.controls.schoolId.disable();
		} else if (role === "Teacher") {
			this.disableSchoolSelection = true;
			this.showDistrict = false;
			this.showTeachers = false;
			this.showStudents = true;
			this.defaultSchoolId = this.authService.currentUserSchoolIdValue;
			this.getSchoolDataWithSchoolId(this.defaultSchoolId);
			//this.getStudentWithId(this.defaultSchoolId);
			this.formGroup.controls.schoolId.setValue(this.defaultSchoolId);
			this.formGroup.controls.schoolId.disable();
		}

	}

	//Final save
	save() {
		if (this.reports) {
			this.edit();
		} else {
			this.create();
		}
	}

	//Add Create
	create() {
		let bodyData = {
			name: this.f.name.value,
			startDate: this.f.sDate.value,
			endDate: this.f.eDate.value,
			answer: this.f.answer.value
		}
		if (this.f.schoolId.value) {
			bodyData['schoolId'] = this.f.schoolId.value;
		}
		if (this.f.teacherId.value) {
			bodyData['teacherId'] = this.f.teacherId.value;
		}
		if (this.f.studentId.value) {
			bodyData['studentId'] = this.f.studentId.value;
		}
		if (this.f.questionId.value) {
			bodyData['questionId'] = this.f.questionId.value;
		}
		if (this.disableSchoolSelection) {
			bodyData["schoolId"] = this.defaultSchoolId;
		}
		if (!this.isLoading) {
			this.isLoading = true
			this.reportservice.addReports(bodyData).subscribe((res: any) => {
				if (res) {
					this.isLoading = false;
					this.modal.close();
					this.sharedservice.swalSuccess(res.message)
				}
			}, err => {
				this.isLoading = false;
				this.sharedservice.swalError(err)
			})
		}
	}

	//Edit Update
	edit() {
		let bodyData = {
			name: this.f.name.value,
			startDate: this.f.sDate.value,
			endDate: this.f.eDate.value,
			answer: this.f.answer.value
		}
		if (this.f.schoolId.value) {
			bodyData['schoolId'] = this.f.schoolId.value;
		}
		if (this.disableSchoolSelection) {
			bodyData["schoolId"] = this.defaultSchoolId;
		}
		if (this.f.teacherId.value) {
			bodyData['teacherId'] = this.f.teacherId.value;
		}
		if (this.f.studentId.value) {
			bodyData['studentId'] = this.f.studentId.value;
		}
		if (this.f.questionId.value) {
			bodyData['questionId'] = this.f.questionId.value;
		}
		if (!this.isLoading) {
			this.isLoading = true;
			this.reportservice.updateReports(bodyData, this.reports._id).subscribe((res: any) => {
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

	//Set Start date
	startDate(type: string, event: MatDatepickerInputEvent<Date>) {
		this.formGroup.controls['sDate'].setValue(this.datepipe.transform(event.value, 'yyyy-MM-dd'));
	}

	//Set End date
	endDate(type: string, event: MatDatepickerInputEvent<Date>) {
		this.formGroup.controls['eDate'].setValue(this.datepipe.transform(event.value, 'yyyy-MM-dd'));
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
	getDistrict() {
		this.districtList = []
		this.districtservice.getDistrict('', '', 'false', '', '').subscribe((res: any) => {
			//this.showDistrict = true;
			this.districtList = res.data;
			if (this.reports) {
				this.formGroup.controls['districtId'].setValue(this.reports?.districtId);
				this.formGroup.disable();
			}
		})
	}


	//Fetch School
	getSchool(data: any) {
		this.schoolList = [];
		this.f.schoolId.setValue(null);
		this.teacherList = []
		this.f.teacherId.setValue(null);
		this.studentList = [];
		this.f.studentId.setValue(null);
		let districtId = data?._id ? data?._id : this.reports.districtId;
		this.shcoolservice.getAllSchool('', '', districtId, 'false', '', '').subscribe((res: any) => {
			this.showSchool = true;
			this.schoolList = res.data;
		})
		if (this.reports) {
			this.formGroup.controls['schoolId'].setValue(this.reports?.schoolId);
		}
	}

	// Get School Data with predefined SchoolId
	getSchoolDataWithSchoolId(schoolId) {
		this.schoolList = [];
		this.f.schoolId.setValue(null);
		this.teacherList = []
		this.f.teacherId.setValue(null);
		this.studentList = [];
		this.f.studentId.setValue(null);
		this.shcoolservice.getSchoolDataWithID(schoolId).subscribe((res: any) => {
			this.showSchool = true;
			this.schoolList = res.data;
			this.cd.markForCheck();
		})
	}

	//Fetch Teacher
	getTeacher(data: any) {
		if (!this.defaultSchoolId) {
			this.teacherList = []
			this.f.teacherId.setValue(null);
			let schoolofId = data?._id ? data?._id : this.reports?.schoolId;
			let bodyData = {
				schoolId: schoolofId,
				status: false
			}
			this.teachers.getTeacher(bodyData).subscribe((res: any) => {
				this.showTeachers = true;
				this.teacherList = res.data
				this.teacherList.map((i) => { i.fullName = i.firstName + ' ' + i.lastName; return i })
				if (this.reports) {
					this.formGroup.controls['teacherId'].setValue(this.reports?.teacherId);
				}
			})
			this.getStudent(schoolofId);
		}
	}

	//Get Teacher with only selected Deafault school id
	getTeacherWithId(schoolId: any) {
		let bodyData = {
			schoolId: schoolId ? schoolId : this.reports?.schoolId,
			status: false
		}
		this.teachers.getTeacher(bodyData).subscribe((res: any) => {
			this.showTeachers = true;
			this.teacherList = res.data
			this.teacherList.map((i) => { i.fullName = i.firstName + ' ' + i.lastName; return i })
			if (this.reports) {
				this.formGroup.controls['teacherId'].setValue(this.reports?.teacherId);
			}
		})
	}

	//Fetch Student
	getStudent(schoolId: any) {
		this.studentList = [];
		this.f.studentId.setValue(null);
		this.studentservice.getAllStudent('', schoolId, '', '', '').subscribe((res: any) => {
			this.showStudents = true;
			this.studentList = res.data
			if (this.reports) {
				this.formGroup.controls['studentId'].setValue(this.reports?.studentId);
			}
		})
	}

	//Get Student With only selected Deafault school id
	getStudentWithId(schoolId: any) {
		this.studentservice.getStudentWithId(schoolId).subscribe((res: any) => {
			this.showStudents = true;
			this.studentList = res.data
			if (this.reports) {
				this.formGroup.controls['studentId'].setValue(this.reports?.studentId);
			}
			this.cd.markForCheck();
		});
	}


	//Fetch Question
	getQuestions() {
		this.questionService.getQuestion('', '', '', '', '').subscribe((res: any) => {
			let questionArray = res.data;
			this.questionsList = questionArray.filter(x => x.questionType !== "textbox");
			if (this.reports) {
				let selectedQuestions = this.questionsList.filter(x => x.question === this.reports?.questionTitle);
				this.formGroup.controls['questionId'].setValue(selectedQuestions[0]?._id);
				this.getAnswer(selectedQuestions[0]?._id);
			}
		})
	}

	//Fetch Answer
	getAnswer(questionId: any) {
		this.answerList = [];
		this.f.answer.setValue(null);
		this.showAnswer = true;
		this.answerList = this.questionsList.filter(x => x._id === questionId?._id)[0]?.option;
		if (this.reports) {
			this.answerList = this.questionsList.filter(x => x._id === questionId)[0]?.option;
			this.formGroup.controls['answer'].setValue(this.reports?.answer);
		}
	}

	get f() { return this.formGroup.controls; }

	//Close model
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
