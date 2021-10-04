import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from 'src/app/services/common.service';
import { EndorsmentsService } from 'src/app/services/endorsments.service';
import { TeacherService } from 'src/app/services/teacher.service';
import { AppConst } from 'src/app/shared/constant/app.constant';
import { SharedService } from 'src/app/shared/services/shared.service';
import { AddEditTeacherComponent } from '../add-edit-teacher/add-edit-teacher.component';
import { DeleteTeacherComponent } from '../delete-teacher/delete-teacher.component';
import Swal from 'sweetalert2';
import { AuthService } from 'src/app/auth/_service/auth.service';
import { Router } from '@angular/router';
import { SchoolsService } from 'src/app/services/schools.service';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
	selector: 'app-teacher',
	templateUrl: './teacher.component.html',
	styleUrls: ['./teacher.component.css']
})
export class TeacherComponent implements OnInit {
	searchKey: any = null;
	activeInactive: any;
	schoolId: any;
	length: any;
	page: any = 1;
	limit: number = AppConst.pageSize;
	modelFunctionality = AppConst.modelOpenFunctionality;
	statusList = AppConst.statusList;
	index: number;
	teachersList = [];
	subjectList = [];
	schoolList = [];
	endorsementList = [];
	endorsementId = [];
	disableSchoolSelection: boolean = false;
	defaultSchoolId = '';
	formGroup: FormGroup;
	constructor(
		private modalService: NgbModal,
		public teachers: TeacherService,
		public shcoolservice: SchoolsService,
		public endorsmentsService: EndorsmentsService,
		public sharedservice: SharedService,
		private router: Router,
		public authService: AuthService,
		private fb: FormBuilder) {
		this.sharedservice.showLoader();
	}

	ngOnInit(): void {
		this.formGroup = this.fb.group({
			search: [''],
			defaultSchoolId: [null],
			status: [null],
			endorsement: [null]
		});
		this.getAllSchool();
		this.getEndorsement();
		this.setDefaultSchoolId();
	}

	setDefaultSchoolId() {
		let role = this.sharedservice.getRole();
		if (role === "Super-Admin") {
			this.disableSchoolSelection = false;
		} else if (role === "School-Admin" || role === "School-Sub-Admin") {
			this.disableSchoolSelection = true;
			this.formGroup.controls['defaultSchoolId'].disable();
			this.authService.currentUserSubject.subscribe((res: any) => {
				if (res?.data?.schoolId) {
					this.defaultSchoolId = res?.data?.schoolId;
					this.formGroup.controls['defaultSchoolId'].setValue(res?.data?.schoolId);
					// Set School for getting default school teaher
					this.schoolId = this.defaultSchoolId;
				} else {
					if (res) {
						this.sharedservice.hideLoader();
						let msg = "You have not been assigned any school";
						this.sharedservice.swalError(msg);
						this.router.navigate(['/dashboard']);
					}
				}
			});
		}
		// get teacher Data
		this.getAllTeacher();
	}
	//Fetch Teachers
	getAllTeacher() {
		this.sharedservice.showLoader();
		let bodyData = {
			search: this.searchKey ? this.searchKey : '',
			schoolId: this.schoolId ? this.schoolId : '',
			status: this.activeInactive ? this.activeInactive : '',
			endorsementId: this.endorsementId.length > 0 ? this.endorsementId : '',
			pageNumber: this.page,
			pageSize: this.limit
		}
		this.teachers.getTeacher(bodyData).subscribe((res: any) => {
			if (res) {
				this.sharedservice.hideLoader();
				for (let index = 0; index < res.data.length; index++) {
					let endorsement = [];
					const endroObj = res.data[index].endorsement;
					for (let i = 0; i < endroObj.length; i++) {
						const element = endroObj[i];
						endorsement.push(element?.name)
					}
					res.data[index].endorsement = endorsement.join(',');
				}
				this.teachersList = res.data;
				this.length = res.count;
			}
		}, err => {
			console.log(err);
		})
	}

	//Create
	create() {
		this.edit(undefined)
	}

	//Edit
	edit(teacher: any) {
		const modalRef = this.modalService.open(AddEditTeacherComponent, { size: 'lg', backdrop: 'static', keyboard: false });
		modalRef.componentInstance.teacher = teacher;
		modalRef.result.then(() => () => { });
		modalRef.result.then((result) => {
			this.getAllTeacher();
		})
	}

	//View
	view(teacher: any) {
		const modalRef = this.modalService.open(AddEditTeacherComponent, { size: 'lg', backdrop: 'static', keyboard: false });
		modalRef.componentInstance.viewData = teacher;
		modalRef.result.then(() => () => { });
		modalRef.result.then((result) => {
			this.getAllTeacher();
		})
	}

	//Delete
	delete(id: any) {
		const modalRef = this.modalService.open(DeleteTeacherComponent, this.modelFunctionality);
		modalRef.componentInstance.id = id;
		modalRef.result.then((result) => {
			this.getAllTeacher();
		})
	}

	//Search
	search(searchData: any) {
		if (this.searchKey !== searchData) {
			this.searchKey = searchData
			this.limit = AppConst.pageSize;
			this.page = 1;
			this.getAllTeacher();
		}
	}

	//Get page index
	receiveMessage(event: any) {
		this.limit = event.pageSize;
		this.page = event.pageIndex + 1;
		this.getAllTeacher();
	}

	//Filter by teacher status
	teacherStatus(data: any) {
		this.activeInactive = data?.value;
		this.getAllTeacher();
	}

	//Fetch School
	getAllSchool() {
		this.shcoolservice.getAllSchool('', '', '', 'false', '', '').subscribe((res: any) => {
			if (res) {
				this.sharedservice.hideLoader();
				this.schoolList = res.data;
				if (this.disableSchoolSelection) {
					this.schoolList = this.schoolList.filter(x => x._id === this.defaultSchoolId);
				}
			}
		})
	}

	//Filter by School
	filterSchool(data: any) {
		this.schoolId = data?._id;
		this.getAllTeacher();
	}

	//Fetch Endorsement
	getEndorsement() {
		this.endorsmentsService.getEndorsments('', 'false', '', '').subscribe((res: any) => {
			if (res) {
				this.endorsementList = res.data;
			}
		})
	}

	//Filter by Endorsement
	statusChange(data: any) {
		this.endorsementId = [];
		data.forEach(element => {
			this.endorsementId.push(element?._id)
		});
		this.getAllTeacher();
	}

	//Active InActive Teacher
	activeInactivestatus(id: any, status: any) {
		if (status === true) {
			Swal.fire({
				icon: 'question',
				text: 'Do you want to Activate this teacher?',
				showDenyButton: true,
				confirmButtonText: `Yes`,
				denyButtonText: `No`,
			}).then((result) => {
				if (result.isConfirmed) {
					this.sharedservice.showLoader();
					this.teachers.activeInactivestatus(id).subscribe((res: any) => {
						if (res) {
							this.sharedservice.hideLoader();
							this.sharedservice.swalSuccess(res.message);
							this.getAllTeacher();
							//this.sharedservice.loggerSuccess(res.message);
						}
					}, err => {
						this.sharedservice.hideLoader();
						this.sharedservice.swalError(err);
						//this.sharedservice.loggerError(err);
					})
				}
			})
		} else {
			Swal.fire({
				icon: 'question',
				text: 'Do you want to Deactivate this teacher?',
				showDenyButton: true,
				confirmButtonText: `Yes`,
				denyButtonText: `No`,
			}).then((result) => {
				if (result.isConfirmed) {
					this.sharedservice.showLoader();
					this.teachers.activeInactivestatus(id).subscribe((res: any) => {
						if (res) {
							this.sharedservice.hideLoader();
							this.sharedservice.swalSuccess(res.message);
							this.getAllTeacher();
							//this.sharedservice.loggerSuccess(res.message);
						}
					}, err => {
						this.sharedservice.hideLoader();
						this.sharedservice.swalError(err);
						//this.sharedservice.loggerError(err);
					})
				}
			})
		}
	}
}
