import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AppConst } from 'src/app/shared/constant/app.constant';
import { SharedService } from 'src/app/shared/services/shared.service';

import { SchoolsService, SubAdminService } from '../../../../services';
import { AddSubAdminComponent } from '../add-sub-admin';
import { DeleteSubAdminComponent } from '../delete-sub-admin';
import Swal from 'sweetalert2';
import { AuthService } from 'src/app/auth/_service/auth.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-sub-admin',
  templateUrl: './sub-admin.component.html',
  styleUrls: ['./sub-admin.component.css']
})
export class SubAdminComponent implements OnInit {
  searchKey: any = null;
  activeInactive: any;
  schoolId: any;
  schoolSubAdmin: [];
  schoolList = [];
  status: any;
  length: any;
  page: any = 1;
  limit: number = AppConst.pageSize;
  modelFunctionality = AppConst.modelOpenFunctionality;
  statusList = AppConst.statusList;
  index: number;
  disableSchoolSelection: boolean = false;
  defaultSchoolId = '';
  formGroup: FormGroup;
  constructor(
    public subAdmin: SubAdminService,
    private modalService: NgbModal,
    public sharedService: SharedService,
    public schoolservice: SchoolsService,
    public authService: AuthService,
    private router: Router,
    private fb: FormBuilder
  ) { this.sharedService.showLoader(); }

  ngOnInit(): void {
    this.sharedService.showLoader();
    this.formGroup = this.fb.group({
			search: [''],
			defaultSchoolId: [null],
			status: [null]
		});
    this.setSchoolId();
    this.getAllSchool();
    this.getSchoolAllAdmin();
  }

  // Check if user has assigned school or not if not redirect to dashboard with error msg
  setSchoolId() {
    let role = this.sharedService.getRole();
    if (role === "School-Admin") {
      this.authService.currentUserSubject.subscribe((res: any) => {
        // console.log(res);
        if (res?.data?.schoolId) {
          this.disableSchoolSelection = true;
          this.formGroup.controls['defaultSchoolId'].disable();
          this.schoolId = res?.data?.schoolId;
          this.formGroup.controls['defaultSchoolId'].setValue(res?.data?.schoolId);
          this.defaultSchoolId = this.schoolId;
        } else {
          if (res) {
            this.sharedService.hideLoader();
            let msg = "You have not been assigned any school";
            this.sharedService.swalError(msg);
            this.router.navigate(['/dashboard']);
          }
        }
      })
    }
  }

  //Get List
  getSchoolAllAdmin() {
    this.sharedService.showLoader();
    this.subAdmin.getSchoolAdmin(this.searchKey, this.schoolId, this.status, this.page, this.limit).subscribe((res: any) => {
      if (res) {
        this.sharedService.hideLoader()
        this.schoolSubAdmin = res.data;
        this.length = res.count
      }
    })
  }

  //Create
  create() {
    this.edit(undefined)
  }

  //open edit model
  edit(data: any) {
    const modalRef = this.modalService.open(AddSubAdminComponent, this.modelFunctionality);
    modalRef.componentInstance.schoolSubAdmin = data;
    modalRef.result.then((result) => {
      this.getSchoolAllAdmin();
    })
  }

  //Delete Record
  delete(id: any) {
    const modalRef = this.modalService.open(DeleteSubAdminComponent, this.modelFunctionality);
    modalRef.componentInstance.id = id;
    modalRef.result.then((result) => {
      this.getSchoolAllAdmin();
    })
  }

  //Fetch School
  getAllSchool() {
    this.sharedService.showLoader();
    this.schoolservice.getAllSchool('', '', '', 'false', '', '').subscribe((res: any) => {
      if (res) {
        this.sharedService.hideLoader();
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
    this.getSchoolAllAdmin();
  }

  //Chnage status
  AdminStatus(data: any) {
    this.status = data?.value;
    this.getSchoolAllAdmin();
  }

  //Search
  search(searchData: any) {
    if (this.searchKey !== searchData) {
      this.searchKey = searchData
      this.limit = AppConst.pageSize;
      this.page = 1;
      this.getSchoolAllAdmin();
    }
  }

  //Get page index
  receiveMessage(event: any) {
    this.limit = event.pageSize;
    this.page = event.pageIndex + 1;
    this.getSchoolAllAdmin();
  }


  //Active Deactive status
  activeDeacticveEndorsments(id: any, status: any) {
    if (status === true) {
      Swal.fire({
        icon: 'question',
        text: 'Do you want to Activate this sub admin?',
        showDenyButton: true,
        confirmButtonText: `Yes`,
        denyButtonText: `No`,
      }).then((result) => {
        if (result.isConfirmed) {
          this.sharedService.showLoader();
          this.subAdmin.activeDeacticveSubAdmin(id).subscribe((res: any) => {
            if (res) {
              this.sharedService.hideLoader();
              this.sharedService.swalSuccess(res.message);
              this.getSchoolAllAdmin();
            }
          }, err => {
            this.sharedService.hideLoader();
            this.sharedService.swalError(err);
          })
        }
      })
    } else {
      Swal.fire({
        icon: 'question',
        text: 'Do you want to Deactive this sub admin?',
        showDenyButton: true,
        confirmButtonText: `Yes`,
        denyButtonText: `No`,
      }).then((result) => {
        if (result.isConfirmed) {
          this.sharedService.showLoader();
          this.subAdmin.activeDeacticveSubAdmin(id).subscribe((res: any) => {
            if (res) {
              this.sharedService.hideLoader();
              this.sharedService.swalSuccess(res.message);
              this.getSchoolAllAdmin();
            }
          }, err => {
            this.sharedService.hideLoader();
            this.sharedService.swalError(err);
          })
        }
      })
    }
  }
}
