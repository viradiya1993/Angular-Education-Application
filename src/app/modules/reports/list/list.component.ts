import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ReportsService } from 'src/app/services/reports.service';
import { AppConst } from 'src/app/shared/constant/app.constant';
import { SharedService } from 'src/app/shared/services/shared.service';
import { AddEditReportsComponent } from '../add-edit-reports/add-edit-reports.component';
import { DeleteReportsComponent } from '../delete-reports/delete-reports.component';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {
  array: any = AppConst.periodList;
  length: any;
  modelFunctionality = AppConst.modelOpenFunctionality;
  reportArray = [];

  constructor(
    public reportService: ReportsService,
    public sharedService: SharedService,
    private modalService: NgbModal,
    private router: Router
  ) {
    this.sharedService.showLoader();
  }

  ngOnInit(): void {
    this.getList();
  }

  getList() {
    this.reportService.getReportList().subscribe((res: any) => {
      if (res) {
        this.sharedService.hideLoader();
        this.reportArray = res.data;
        this.length = res.count;
      }
    }, err => {
      this.sharedService.hideLoader();
    })
  }

  //Create
  create() {
    this.edit(undefined);
  }

  //Edit
  edit(data: any) {
    const modalRef = this.modalService.open(AddEditReportsComponent, this.modelFunctionality);
    modalRef.componentInstance.reports = data;
    modalRef.result.then((result) => {
      this.getList();
    })
  }


  //Delete
  delete(id: any) {
    const modalRef = this.modalService.open(DeleteReportsComponent, this.modelFunctionality);
    modalRef.componentInstance.id = id;
    modalRef.result.then((result) => {
      this.getList();
    })
  }

  //Active InActive Teacher
  activeInactivestatus(id: any, status: any) {
    if (status === true) {
      Swal.fire({
        icon: 'question',
        text: 'Do you want to Activate this report?',
        showDenyButton: true,
        confirmButtonText: `Yes`,
        denyButtonText: `No`,
      }).then((result) => {
        if (result.isConfirmed) {
          this.sharedService.showLoader();
          this.reportService.activeInactivestatus(id).subscribe((res: any) => {
            if (res) {
              this.sharedService.hideLoader();
              this.sharedService.swalSuccess(res.message);
              this.getList();
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
        text: 'Do you want to Deactivate this report?',
        showDenyButton: true,
        confirmButtonText: `Yes`,
        denyButtonText: `No`,
      }).then((result) => {
        if (result.isConfirmed) {
          this.sharedService.showLoader();
          this.reportService.activeInactivestatus(id).subscribe((res: any) => {
            if (res) {
              this.sharedService.hideLoader();
              this.sharedService.swalSuccess(res.message);
              this.getList();
            }
          }, err => {
            this.sharedService.hideLoader();
            this.sharedService.swalError(err);
          })
        }
      })
    }
  }

  routeToReport(value) {
    this.sharedService.showLoader();
    let reportId = value._id;
    this.router.navigate([`/doked-list/reports/${reportId}`]);
  }
}
