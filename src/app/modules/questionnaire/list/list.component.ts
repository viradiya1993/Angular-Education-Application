import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SchoolsService } from 'src/app/services';
import { CommonService } from 'src/app/services/common.service';
import { QuestionnaireService } from 'src/app/services/questionnaire.service';
import { AppConst } from 'src/app/shared/constant/app.constant';
import { SharedService } from 'src/app/shared/services/shared.service';
import { DeleteComponent } from '../delete';
import { EditComponent } from '../edit';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-list-question',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {
  searchKey: any = null;
  activeInactive: any;
  page: any = 1;
  limit: number = AppConst.pageSize;
  modelFunctionality = AppConst.modelOpenFunctionality;
  statusList = AppConst.statusList;
  length: any;
  schoolId = '';
  questionList = [];
  schoolList = [];
  constructor(
    private questionService: QuestionnaireService,
    private modalService: NgbModal,
    public sharedservice: SharedService,
    public commonservice: CommonService,
    private schoolService: SchoolsService
  ) { }

  ngOnInit(): void {
    this.getSchool();
    this.getQuestionsList();
  }

  getQuestionsList() {
    this.sharedservice.showLoader();
    this.questionService.getQuestion(this.schoolId, this.searchKey, this.activeInactive, this.page, this.limit).subscribe((res: any) => {
      if (res) {
        this.sharedservice.hideLoader();
        this.questionList = res.data;
        this.length = res.count;
      }
    }, err => {
      this.sharedservice.hideLoader();
      this.sharedservice.swalError(err);
    })
  }

  //Fetch School
  getSchool() {
    this.schoolService.getAllSchool('', '', '', 'false', '', '').subscribe((res: any) => {
      if (res) {
        this.sharedservice.hideLoader();
        this.schoolList = res.data;
      }
    })
  }

  //Filter by School
  filterSchool(data: any) {
    this.schoolId = data?._id;
    this.getQuestionsList();
  }
 
  //Questions Status
  questionsStatus(data: any) {
    this.activeInactive = data?.value;
    this.getQuestionsList();
  }

  // form actions
  create() {
    this.edit(undefined);
  }

  //Form edit actions
  edit(question: any) {
    const modalRef = this.modalService.open(EditComponent, this.modelFunctionality);
    modalRef.componentInstance.question = question;
    modalRef.result.then((result) => {
      this.getQuestionsList();
    })

  }

  //Delete
  delete(id: any) {
    const modalRef = this.modalService.open(DeleteComponent, this.modelFunctionality);
    modalRef.componentInstance.id = id;
    modalRef.result.then((result) => {
      this.getQuestionsList();
    })
  }
 
  //Active Inactive Status
  activeDeacticveQuestion(id: any, status: any) {
    if (status === true) {
      Swal.fire({
        icon: 'question',
        text: 'Do you want to Activate this question?',
        showDenyButton: true,
        confirmButtonText: `Yes`,
        denyButtonText: `No`,
      }).then((result) => {
        if (result.isConfirmed) {
          this.sharedservice.showLoader();
          this.questionService.activeInactiveQuestion(id).subscribe((res: any) => {
            if (res) {
              this.sharedservice.hideLoader();
              this.sharedservice.swalSuccess(res.message);
              this.getQuestionsList();
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
        text: 'Do you want to Deactive this question?',
        showDenyButton: true,
        confirmButtonText: `Yes`,
        denyButtonText: `No`,
      }).then((result) => {
        if (result.isConfirmed) {
          this.sharedservice.showLoader();
          this.questionService.activeInactiveQuestion(id).subscribe((res: any) => {
            if (res) {
              this.sharedservice.hideLoader();
              this.sharedservice.swalSuccess(res.message);
              this.getQuestionsList();
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
