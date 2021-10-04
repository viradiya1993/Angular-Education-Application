import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GradesService } from 'src/app/services/grades.service';
import { AppConst } from 'src/app/shared/constant/app.constant';
import { SharedService } from 'src/app/shared/services/shared.service';
import { AddEditGradesComponent } from '../add-edit-grades/add-edit-grades.component';
import { DeleteGradesComponent } from '../delete-grades/delete-grades.component';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {
  searchKey: any = null;
  activeInactive: any;
  length: any;
  page: any = 1;
  modelFunctionality = AppConst.modelOpenFunctionality;
  statusList = AppConst.statusList;
  index: number;
  gredeList = [];
  constructor(private modalService: NgbModal, public gradeservice: GradesService, public sharedservice: SharedService) { this.sharedservice.showLoader(); }

  ngOnInit(): void {
    this.getAllGrades();
  }

  //Fetch Grades
  getAllGrades() {
    this.sharedservice.showLoader();
    this.gradeservice.getGrades(this.searchKey, this.activeInactive).subscribe((res: any) => {
      this.sharedservice.hideLoader();
      this.gredeList = res.data;
      this.length = res.count;
    }, err => {
      this.sharedservice.hideLoader();
      this.sharedservice.swalError(err);
    })
  }

  //Create
  create() {
    const modalRef = this.modalService.open(AddEditGradesComponent, this.modelFunctionality);
    modalRef.result.then((result) => {
      this.getAllGrades();
    })
  }

  //Delete
  delete(id: any) {
    const modalRef = this.modalService.open(DeleteGradesComponent, this.modelFunctionality);
    modalRef.componentInstance.id = id;
    modalRef.result.then((result) => {
      this.getAllGrades();
    })
  }

  //Search
  search(searchData: any) {
    if (this.searchKey !== searchData) {
      this.searchKey = searchData
      this.getAllGrades();
    }
  }

  //Filter by grade status
  gradeStatus(data: any) {
    this.activeInactive = data?.value;
    this.getAllGrades();
  }

  //Active Deactive status
  activeDeacticveGrade(id: any, status: any) {
    if (status === true) {
      Swal.fire({
        icon: 'question',
        text: 'Do you want to Activate this grade?',
        showDenyButton: true,
        confirmButtonText: `Yes`,
        denyButtonText: `No`,
      }).then((result) => {
        if (result.isConfirmed) {
          this.sharedservice.showLoader();
          this.gradeservice.activeDeacticveGrades(id).subscribe((res: any) => {
            if (res) {
              this.sharedservice.hideLoader();
              this.sharedservice.swalSuccess(res.message);
              this.getAllGrades();
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
        text: 'Do you want to Deactive this grade?',
        showDenyButton: true,
        confirmButtonText: `Yes`,
        denyButtonText: `No`,
      }).then((result) => {
        if (result.isConfirmed) {
          this.sharedservice.showLoader();
          this.gradeservice.activeDeacticveGrades(id).subscribe((res: any) => {
            if (res) {
              this.sharedservice.hideLoader();
              this.sharedservice.swalSuccess(res.message);
              this.getAllGrades();
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
