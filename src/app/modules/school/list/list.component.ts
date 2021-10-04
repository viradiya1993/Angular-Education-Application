import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DeleteSchoolComponent } from '../delete-school';
import { EditSchoolModalComponent } from '../edit-school';
import { SchoolAssingComponent } from '../school-assing';
import { SharedService } from 'src/app/shared/services/shared.service';
import { AddSubAdminComponent } from '../sub-admin';
import { SchoolsService } from 'src/app/services/schools.service';
import { AppConst } from 'src/app/shared/constant/app.constant';
import { CommonService } from 'src/app/services/common.service';
import { AuthService } from 'src/app/auth/_service/auth.service';
import { Router } from '@angular/router';
import { DistrictService, SchooladminService, StatesService } from 'src/app/services';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-list-school',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {
  schoolList = [];
  countryList = [];
  stateList = [];
  districtList = [];

  searchGroup: FormGroup;
  activeInactive: any;

  stateId = '';
  districtId = '';
  length: any;
  page: any = 1;
  limit: number = AppConst.pageSize;
  statusList = AppConst.statusList;
  index: number;
  searchKey: any = null;
  showFilterAndPagination = false;
  defaultSchoolId = '';

  constructor(
    private fb: FormBuilder,
    private modalService: NgbModal,
    public schoolService: SchoolsService,
    public districtservice: DistrictService,
    public stateservice: StatesService,
    public authService: AuthService,
    private cd: ChangeDetectorRef,
    public sharedService: SharedService,
    private router: Router,
    public schoolAdmin: SchooladminService
  ) {
    this.getState();
    this.getDistrict();
  }

  ngOnInit(): void {
    this.sharedService.showLoader();
    this.setSchoolId();
    this.searchForm();

  }

  // search
  searchForm() {
    this.searchGroup = this.fb.group({
      searchText: [''],
      countryId: [''],
      stateId: [''],
      districtId: ['']
    });
  }
  // Check if user has assigned school or not if not redirect to dashboard with error msg
  setSchoolId() {
    let role = this.sharedService.getRole();
    if (role === "Super-Admin") {
      this.showFilterAndPagination = true;
      this.getSchoolData();
    } else if (role === "School-Admin" || role === "School-Sub-Admin") {
      this.authService.currentUserSubject.subscribe((res: any) => {
        // console.log(res);
        if (res?.data?.schoolId) {
          this.defaultSchoolId = res?.data?.schoolId;
          this.showFilterAndPagination = false;
          this.getSchoolDataWithSchoolId(res?.data?.schoolId);
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

  // Get School Data
  getSchoolData() {
    this.schoolService.getAllSchool(
      this.searchKey,
      this.stateId,
      this.districtId,
      this.activeInactive,
      this.page,
      this.limit
    ).subscribe((res: any) => {
      this.sharedService.hideLoader()
      this.schoolList = res.data;
      this.length = res.count;
      this.cd.markForCheck();
    });
  }

  // Get School Data with predefined SchoolId
  getSchoolDataWithSchoolId(schoolId) {
    this.schoolService.getSchoolDataWithID(
      schoolId
    ).subscribe((res: any) => {
      this.sharedService.hideLoader();
      this.schoolList = res.data;
      this.length = res.count;
      this.cd.markForCheck();
    });
  }


  callSchoolDataAPI() {
    let role = this.sharedService.getRole();
    if (role === "Super-Admin") {
      this.getSchoolData()
    } else {
      this.getSchoolDataWithSchoolId(this.defaultSchoolId);
    }
  }


  // form actions
  create() {
    this.edit(undefined);
  }

  //Assing school to user
  AssignSchool(data: any) {
    const modalRef = this.modalService.open(SchoolAssingComponent, { size: 'md', backdrop: 'static', keyboard: false });
    modalRef.componentInstance.data = data;
    modalRef.result.then((result) => {
      this.callSchoolDataAPI();
    })
  }

  //Assing school to user
  unAssignSchool(data: any) {
    console.log(data);
    // return;
    Swal.fire({
      icon: 'question',
      text: 'Do you want to UnAssign Admin from this School?',
      showDenyButton: true,
      confirmButtonText: `Yes`,
      denyButtonText: `No`,
    }).then((result) => {
      if (result.isConfirmed) {
        this.sharedService.showLoader();
        let formData = {};
        formData["schoolId"] = data._id;
        formData["userId"] = data.users[0]?._id;
        this.schoolAdmin.UnAssignSchoolAdmin(formData).subscribe((res: any) => {
          if (res) {
            this.sharedService.hideLoader();
            this.sharedService.swalSuccess(res.message);
            this.callSchoolDataAPI();
          }
        }, err => {
          this.sharedService.hideLoader();
          this.sharedService.swalError(err);
        })
      }
    })
  }


  //Edit 
  view(schoolData) {
    const modalRef = this.modalService.open(EditSchoolModalComponent, { size: 'lg', backdrop: 'static', keyboard: false });
    modalRef.componentInstance.data = schoolData;
    modalRef.componentInstance.viewMode = true;
    modalRef.result.then((result) => {
      this.callSchoolDataAPI();
    })
  }

  //Edit 
  edit(schoolData) {
    const modalRef = this.modalService.open(EditSchoolModalComponent, { size: 'lg', backdrop: 'static', keyboard: false });
    modalRef.componentInstance.data = schoolData;
    modalRef.result.then((result) => {
      this.callSchoolDataAPI();
    })
  }

  //Delete
  delete(id: any) {
    const modalRef = this.modalService.open(DeleteSchoolComponent, { size: 'sm', backdrop: 'static', keyboard: false });
    modalRef.componentInstance.id = id;
    modalRef.result.then((result) => {
      this.callSchoolDataAPI();
    })
  }

  //Create Sub Admin
  createSubAdmin(schoolData: any) {
    const modalRef = this.modalService.open(AddSubAdminComponent, { size: 'lg', backdrop: 'static', keyboard: false });
    modalRef.componentInstance.schoolData = schoolData;
  }

  // Fetch State
  getState() {
    this.stateservice.getState('', 'false', '', '').subscribe((res: any) => {
      if (res) {
        this.sharedService.hideLoader();
        this.stateList = res.data;
      }
    });
  }

  // Fetch District
  getDistrict() {
    this.districtservice.getDistrict('', '', 'false', '', '').subscribe((res: any) => {
      if (res) {
        this.sharedService.hideLoader();
        this.districtList = res.data;
      }
    })
  }


  //Filter by state
  stateChange(data: any) {
    this.stateId = data?._id;
    this.getSchoolData();
  }

  //Filter by city
  districtChange(data: any) {
    this.districtId = data?._id;
    this.getSchoolData();
  }

  //Search
  search(searchData: any) {
    if (this.searchKey !== searchData) {
      this.searchKey = searchData
      this.limit = AppConst.pageSize;
      this.page = 1;
      this.getSchoolData();
    }
  }

  //Get page index
  receiveMessage(event: any) {
    this.limit = event.pageSize;
    this.page = event.pageIndex + 1;
    this.getSchoolData();
  }
}
