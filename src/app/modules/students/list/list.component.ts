import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AppConst } from 'src/app/shared/constant/app.constant';
import { SharedService } from 'src/app/shared/services/shared.service';
import { AddEditStudentComponent } from '../add-edit-student/add-edit-student.component';
import { DeleteStudentComponent } from '../delete-student/delete-student.component';
import Swal from 'sweetalert2';
import { SchoolsService } from 'src/app/services';
import { StudentsService } from 'src/app/services/students.service';
import { AuthService } from 'src/app/auth/_service/auth.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
	selector: 'app-list-student',
	templateUrl: './list.component.html',
	styleUrls: ['./list.component.css']
})

export class ListComponent implements OnInit {
	searchKey: any = null;
	activeInactive: any;
	schoolId: any
	length: any;
	page: any = 1;
	limit: number = AppConst.pageSize;
	modelFunctionality = AppConst.modelOpenFunctionality;
	statusList = AppConst.statusList;
	index: number;
	studentsList = [];
	schoolList = [];
	disableSchoolSelection: boolean = false;
	defaultSchoolId = '';
	formGroup: FormGroup;
	constructor(
		private modalService: NgbModal,
		public students: StudentsService,
		public shcoolservice: SchoolsService,
		public sharedservice: SharedService,
		public authService: AuthService,
		private router: Router,
		private fb: FormBuilder) {
		this.sharedservice.showLoader();
	}

	ngOnInit(): void {
		this.formGroup = this.fb.group({
			search: [''],
			defaultSchoolId: [null],
			status: [null]
		});
		this.getSchool();
		this.setDefaultSchoolId();
	}

	//Set Defult School base on role
	setDefaultSchoolId() {
		let role = this.sharedservice.getRole();
		if (role === "Super-Admin") {
			this.disableSchoolSelection = false;
		} else if (role === "School-Admin" || role === "School-Sub-Admin" || role === "Teacher") {
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
		this.getAllStudent();
	}

	//Fetch students
	getAllStudent() {
		this.students.getAllStudent(this.searchKey, this.schoolId, this.activeInactive, this.page, this.limit).subscribe((res: any) => {
			if (res) {
				this.sharedservice.hideLoader();
				this.studentsList = res.data;
				this.length = res.count;
			}
		})
	}

	//create
	create() {
		this.edit(undefined)
	}

	//Edit
	edit(students: any) {
		const modalRef = this.modalService.open(AddEditStudentComponent, this.modelFunctionality);
		modalRef.componentInstance.students = students;
		modalRef.componentInstance.viewMode = false;
		modalRef.result.then((result) => {
			this.getAllStudent();
		})
	}

	//view
	view(students: any) {
		const modalRef = this.modalService.open(AddEditStudentComponent, this.modelFunctionality);
		modalRef.componentInstance.students = students;
		modalRef.componentInstance.viewMode = true;
		modalRef.result.then((result) => { })
	}

	//Delete
	delete(id: any) {
		const modalRef = this.modalService.open(DeleteStudentComponent, this.modelFunctionality);
		modalRef.componentInstance.id = id;
		modalRef.result.then((result) => {
			this.getAllStudent();
		})
	}

	//Search
	search(searchData: any) {
		if (this.searchKey !== searchData) {
			this.searchKey = searchData
			this.limit = AppConst.pageSize;
			this.page = 1;
			this.getAllStudent();
		}
	}

	//Fetch School
	getSchool() {
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
		this.getAllStudent();
	}


	//Filter by student status
	studentStatus(data: any) {
		this.activeInactive = data?.value;
		this.getAllStudent();
	}

	//Get page index
	receiveMessage(event: any) {
		this.limit = event.pageSize;
		this.page = event.pageIndex + 1;
		this.getAllStudent();
	}

	//Active Deactive status
	activeDeacticveStudents(id: any, status: any) {
		if (status === true) {
			Swal.fire({
				icon: 'question',
				text: 'Do you want to Activate this student?',
				showDenyButton: true,
				confirmButtonText: `Yes`,
				denyButtonText: `No`,
			}).then((result) => {
				if (result.isConfirmed) {
					this.sharedservice.showLoader();
					this.students.activeDeacticveStudent(id).subscribe((res: any) => {
						if (res) {
							this.sharedservice.hideLoader();
							this.sharedservice.swalSuccess(res.message);
							this.getAllStudent();
						}
					}, err => {
						this.sharedservice.hideLoader();
						this.sharedservice.swalError(err);
					})
				}
			})
		} else {
			Swal.fire({
				icon: 'question',
				text: 'Do you want to Deactive this student?',
				showDenyButton: true,
				confirmButtonText: `Yes`,
				denyButtonText: `No`,
			}).then((result) => {
				if (result.isConfirmed) {
					this.sharedservice.showLoader();
					this.students.activeDeacticveStudent(id).subscribe((res: any) => {
						if (res) {
							this.sharedservice.hideLoader();
							this.sharedservice.swalSuccess(res.message);
							this.getAllStudent();
						}
					}, err => {
						this.sharedservice.hideLoader();
						this.sharedservice.swalError(err);
					})
				}
			})
		}
	}
}
