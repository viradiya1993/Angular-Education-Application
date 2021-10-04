import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbDateStruct, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DokedListService } from 'src/app/services/doked-service.service';
import { AppConst } from 'src/app/shared/constant/app.constant';
import { SharedService } from 'src/app/shared/services/shared.service';
import { QuestionBoxComponent } from '../question-box/question-box.component';
import { CsvBuilder } from 'filefy';
import { ExportType } from 'src/app/models/enum.model';
import { MatTableDataSource } from '@angular/material/table';
import { animate, state, style, transition, trigger } from '@angular/animations';



@Component({
  selector: 'app-list-doked',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ]
})

export class ListComponent implements OnInit {
  periodList = AppConst.periodList;
  listArray = [];
  searchForm: FormGroup;
  length = 0;
  showSearchButton = false;
  isTableExpanded = false;

  exportTypes = ExportType;
  finalset: any;
  dataSchoolList = new MatTableDataSource();
  displayedSchoolList: string[] = ['school_name', 'phone_number', 'address', 'actions'];
  displayedTeacherList: string[] = ['teacher_name', 'phone_number', 'email', 'actions'];
  displayedStudentList: string[] = ['student_name', 'email', 'actions'];

  finalSchoolArray = [];
  constructor(
    private modalService: NgbModal,
    private dokedService: DokedListService,
    private sharedService: SharedService,
    private fb: FormBuilder,
  ) {


  }


  ngOnInit(): void {
    this.sharedService.showLoader();
    this.setForm();
    this.onPeriodChange();
    // this.search();
    this.getQuestionsList();
  }

  // Toggel Rows
  toggleTableRows() {
    this.isTableExpanded = !this.isTableExpanded;
    this.dataSchoolList.data.forEach((row: any) => {
      row.isExpanded = this.isTableExpanded;
    })
  }

  setForm() {
    this.searchForm = this.fb.group({
      period: ["4"],
      created_from: [""],
      created_to: [""],
    });
  }

  getQuestionsList(callback?) {
    let startDate = this.searchForm.value["created_from"];
    let endDate = this.searchForm.value["created_to"];
    this.dokedService.getQNAList(startDate, endDate).subscribe((res: any) => {
      if (res) {
        this.sharedService.hideLoader();
        if (callback) {
          callback(this.listArray = res.data)
        } else {
          this.listArray = res.data;
          this.length = res.count;
        }
        this.setSchoolTeacherArray();
      }
    }, err => {
      this.sharedService.hideLoader();
    });
  }

  setSchoolTeacherArray() {
    this.finalSchoolArray = [];
    let array = this.listArray;
    // debugger
    array.forEach(element => {
      console.log(element);

      let schoolArray = array.filter(x => x.schoolId === element.schoolId);
      this.finalSchoolArray.push(schoolArray[0]);
    });
    // console.log(this.finalSchoolArray);
    this.dataSchoolList.data = this.finalSchoolArray;

  }

 

  exportCSV(exportdata: any) {
    const file = exportdata;
    let csvBuilder: CsvBuilder;
    let date = new Date();
    let fileName = date.toISOString() + "-Question";
    if (file !== undefined) {
      csvBuilder = new CsvBuilder(fileName + ".csv");
      this.listArray.forEach((result) => {
        csvBuilder.setColumns(["School Name", "Teacher Name", "Student Name", "Assessement Id", "Sas Id", "Questions", "Answer", "Comment"])
        // csvBuilder.addRow([i + 1, result?.schoolName, result?.teacherName, result?.studentName, result?.assessementId, result?.sasId,])
        result.queAns.forEach((ele) => {
          csvBuilder.addRow([result?.schoolName, result?.teacherName, result?.studentName, result?.assessementId, result?.sasId, ele?.question, ele?.answer, ele?.otherAns ? ele?.otherAns : '---'])
        });
      });
      csvBuilder.exportFile();
    }
  }

  /**
   * Determines whether period change on
   */
  onPeriodChange() {
    this.sharedService.showLoader();
    let dte = new Date();
    // debugger
    if (Number(this.searchForm.value.period) === 1) {
      this.showSearchButton = false;

      // Today
      this.searchForm.controls.created_from.setValue({
        year: dte.getFullYear(),
        month: dte.getMonth() + 1,
        day: dte.getDate()
      });
      this.searchForm.controls.created_to.setValue({
        year: dte.getFullYear(),
        month: dte.getMonth() + 1,
        day: dte.getDate()
      });
    } else if (Number(this.searchForm.value.period) === 2) {
      this.showSearchButton = false;

      // Yesterday
      dte.setDate(dte.getDate() - 1);
      this.searchForm.controls.created_from.setValue({
        year: dte.getFullYear(),
        month: dte.getMonth() + 1,
        day: dte.getDate()
      });
      this.searchForm.controls.created_to.setValue({
        year: dte.getFullYear(),
        month: dte.getMonth() + 1,
        day: dte.getDate()
      });
    } else if (Number(this.searchForm.value.period) === 3) {
      this.showSearchButton = false;

      // This Week
      const current = new Date();
      const weekstart = current.getDate() - current.getDay() + 1;
      const weekend = weekstart + 6;
      const monday = new Date(current.setDate(weekstart));
      const sunday = new Date(current.setDate(weekend));

      this.searchForm.controls.created_from.setValue({
        year: monday.getFullYear(),
        month: monday.getMonth() + 1,
        day: monday.getDate()
      });
      this.searchForm.controls.created_to.setValue({
        year: sunday.getFullYear(),
        month: sunday.getMonth() + 1,
        day: sunday.getDate()
      });
    } else if (Number(this.searchForm.value.period) === 4) {
      this.showSearchButton = false;
      // This Month
      // dte.setDate(dte.getDate() - 1);
      dte = new Date(dte.getFullYear(), dte.getMonth() + 1, 0);

      this.searchForm.controls.created_from.setValue({
        year: dte.getFullYear(),
        month: dte.getMonth() + 1,
        day: 1
      });
      this.searchForm.controls.created_to.setValue({
        year: dte.getFullYear(),
        month: dte.getMonth() + 1,
        day: dte.getDate()
      });
    } else if (Number(this.searchForm.value.period) === 5) {
      this.showSearchButton = true;
    }
    this.search();
  }

  dateChange() {
    // console.log(this.searchForm.value.period);
    if (Number(this.searchForm.value.period) == 1 ||
      Number(this.searchForm.value.period) == 2 ||
      Number(this.searchForm.value.period) == 3 ||
      Number(this.searchForm.value.period) == 4) {
      return true;
    }
    return false;
  }

  search() {
    this.searchForm.value["created_from"] =
      typeof this.searchForm.value["created_from"] === "object"
        ? this.format(this.searchForm.value["created_from"])
        : this.searchForm.value["created_from"];
    this.searchForm.value["created_to"] =
      typeof this.searchForm.value["created_to"] === "object"
        ? this.format(this.searchForm.value["created_to"])
        : this.searchForm.value["created_to"];

    this.getQuestionsList();
  }

  format(date: NgbDateStruct): string {
    return date
      ? `${date.year}-${date.month ? date.month : ""}-${date.day ? date.day : ""}`
      : "";
  }

  getDataWithDate() {
    this.sharedService.showLoader();
    this.search();
    // this.getQuestionsList();
  }
  //Edit 
  view(questionArrayData) {
    const modalRef = this.modalService.open(QuestionBoxComponent, { size: 'lg', backdrop: 'static', keyboard: false });
    modalRef.componentInstance.questionArray = questionArrayData;
    modalRef.componentInstance.viewMode = true;
    modalRef.result.then((result) => {
      // this.getQuestionsList();
      this.onPeriodChange();
    })
  }

  // helpers for View
  isControlValid(controlName: string): boolean {
    const control = this.searchForm.controls[controlName];
    return control.valid && (control.dirty || control.touched);
  }

  isControlInvalid(controlName: string): boolean {
    const control = this.searchForm.controls[controlName];
    return control.invalid && (control.dirty || control.touched);
  }

  controlHasError(validation, controlName): boolean {
    const control = this.searchForm.controls[controlName];
    return control.hasError(validation) && (control.dirty || control.touched);
  }

  isControlTouched(controlName): boolean {
    const control = this.searchForm.controls[controlName];
    return control.dirty || control.touched;
  }
  /* Get all key from object */
  getKeys(obj: any) {
    return Object.keys(obj);
  }
}
