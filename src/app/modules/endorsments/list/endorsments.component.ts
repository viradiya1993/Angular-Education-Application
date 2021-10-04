import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from 'src/app/services/common.service';
import { EndorsmentsService } from 'src/app/services/endorsments.service';
import { AppConst } from 'src/app/shared/constant/app.constant';
import { SharedService } from 'src/app/shared/services/shared.service';
import { AddEditEndorsmentsComponent } from '../add-edit-endorsments/add-edit-endorsments.component';
import { DeleteEndorsmentsComponent } from '../delete-endorsments/delete-endorsments.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-endorsments',
  templateUrl: './endorsments.component.html',
  styleUrls: ['./endorsments.component.css']
})
export class EndorsmentsComponent implements OnInit {
  searchKey: any = null;
  activeInactive: any;
  length: any;
  page: any = 1;
  limit: number = AppConst.pageSize;
  modelFunctionality = AppConst.modelOpenFunctionality;
  statusList = AppConst.statusList;
  index: number;
  endorsmentsList = [];

  constructor(private modalService: NgbModal, public endorsmentsService: EndorsmentsService, public sharedservice: SharedService, public commonService: CommonService) {
    this.sharedservice.showLoader();
  }

  ngOnInit(): void {
    this.getAllEndorsments();
  }

  //Fetch Endorsments
  getAllEndorsments() {
    this.sharedservice.showLoader();
    this.endorsmentsService.getEndorsments(this.searchKey, this.activeInactive, this.page, this.limit).subscribe((res: any) => {
      this.sharedservice.hideLoader();
      this.endorsmentsList = res.data;
      this.length = res.count;
    })
  }


  //Create
  create() {
    this.edit(undefined)
  }

  //Edit
  edit(endorsments: any) {
    const modalRef = this.modalService.open(AddEditEndorsmentsComponent, this.modelFunctionality);
    modalRef.componentInstance.endorsments = endorsments;
    modalRef.result.then((result) => {
      this.getAllEndorsments();
    })
  }

  //Delete
  delete(id: any) {
    const modalRef = this.modalService.open(DeleteEndorsmentsComponent, this.modelFunctionality);
    modalRef.componentInstance.id = id;
    modalRef.result.then((result) => {
      this.getAllEndorsments();
    })
  }

  //Search
  search(searchData: any) {
    if (this.searchKey !== searchData) {
      this.searchKey = searchData
      this.limit = AppConst.pageSize;
      this.page = 1;
      this.getAllEndorsments();
    }
  }

  //Filter by endrosment status
  endrosmentStatus(data: any) {
    this.activeInactive = data?.value;
    this.getAllEndorsments();
  }

  //Get page index
  receiveMessage(event: any) {
    this.limit = event.pageSize;
    this.page = event.pageIndex + 1;
    this.getAllEndorsments();
  }

  //Active Deactive status
  activeDeacticveEndorsments(id: any, status: any) {
    if (status === true) {
      Swal.fire({
        icon: 'question',
        text: 'Do you want to Activate this endorsments?',
        showDenyButton: true,
        confirmButtonText: `Yes`,
        denyButtonText: `No`,
      }).then((result) => {
        if (result.isConfirmed) {
          this.sharedservice.showLoader();
          this.endorsmentsService.activeDeacticveEndorsments(id).subscribe((res: any) => {
            if (res) {
              this.sharedservice.hideLoader();
              this.sharedservice.swalSuccess(res.message);
              this.getAllEndorsments();
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
        text: 'Do you want to Deactive this endorsments?',
        showDenyButton: true,
        confirmButtonText: `Yes`,
        denyButtonText: `No`,
      }).then((result) => {
        if (result.isConfirmed) {
          this.sharedservice.showLoader();
          this.endorsmentsService.activeDeacticveEndorsments(id).subscribe((res: any) => {
            if (res) {
              this.sharedservice.hideLoader();
              this.sharedservice.swalSuccess(res.message);
              this.getAllEndorsments();
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
