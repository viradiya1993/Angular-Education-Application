import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SchooladminService } from 'src/app/services';
import { AppConst } from 'src/app/shared/constant/app.constant';
import { SharedService } from 'src/app/shared/services/shared.service';
import { DeleteSchooladminComponent } from '../delete-schooladmin';
import { EditSchooladminComponent } from '../edit-schooladmin';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  searchKey: any = null;
  activeInactive: any;
  page: any = 1;
  limit: number = AppConst.pageSize;
  statusList = AppConst.statusList;
  length: any;
  schoolAdminList = [];

  constructor(
    private schoolAdmin: SchooladminService,
    public sharedService: SharedService,
    private modalService: NgbModal
  ) { }

  ngOnInit(): void {
    this.sharedService.showLoader();
    this.getSchoolAdminList();
  }

  // form actions
  create() {
    this.edit(undefined);
  }

  // edit form actions
  edit(data: any) {
    const modalRef = this.modalService.open(EditSchooladminComponent, { size: 'lg', backdrop: 'static', keyboard: false },);
    modalRef.componentInstance.data = data;
    modalRef.result.then((result) => {
      this.getSchoolAdminList();
    })
  }

  //Delete single
  delete(id: any) {
    const modalRef = this.modalService.open(DeleteSchooladminComponent);
    modalRef.componentInstance.id = id;
    modalRef.result.then((result) => {
      this.getSchoolAdminList();
    })
  }

  getSchoolAdminList() {
    this.sharedService.showLoader();
    this.schoolAdmin.getSchoolAdmin(this.searchKey, this.activeInactive, this.page, this.limit).subscribe((res: any) => {
      if (res) {
        this.sharedService.hideLoader()
        this.schoolAdminList = res.data;
        this.length = res.count;
      }
    })
  }

  //Search
  search(searchData: any) {
    if (this.searchKey !== searchData) {
      this.searchKey = searchData
      this.limit = AppConst.pageSize;
      this.page = 1;
      this.getSchoolAdminList();
    }
  }

  //Filter admin status
  adminStatus(data: any) {
    this.activeInactive = data?.value;
    this.getSchoolAdminList();
  }

  //Set Pagination Index
  receiveMessage(event: any) {
    this.limit = event.pageSize;
    this.page = event.pageIndex + 1;
    this.getSchoolAdminList();
  }

  //Active Deactive status
  activeDeacticveAdmin(id: any, status: any) {
    if (status === true) {
      Swal.fire({
        icon: 'question',
        text: 'Do you want to Activate this admin?',
        showDenyButton: true,
        confirmButtonText: `Yes`,
        denyButtonText: `No`,
      }).then((result) => {
        if (result.isConfirmed) {
          this.sharedService.showLoader();
          this.schoolAdmin.activeDeacticveAdmin(id).subscribe((res: any) => {
            if (res) {
              this.sharedService.hideLoader();
              this.sharedService.swalSuccess(res.message);
              this.getSchoolAdminList();
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
        text: 'Do you want to Deactive this admin?',
        showDenyButton: true,
        confirmButtonText: `Yes`,
        denyButtonText: `No`,
      }).then((result) => {
        if (result.isConfirmed) {
          this.sharedService.showLoader();
          this.schoolAdmin.activeDeacticveAdmin(id).subscribe((res: any) => {
            if (res) {
              this.sharedService.hideLoader();
              this.sharedService.swalSuccess(res.message);
              this.getSchoolAdminList();
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
