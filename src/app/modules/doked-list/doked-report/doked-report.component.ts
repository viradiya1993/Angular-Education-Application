import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { DokedListService } from 'src/app/services/doked-service.service';
import { AppConst } from 'src/app/shared/constant/app.constant';
import { SharedService } from 'src/app/shared/services/shared.service';
import * as Highcharts from 'angular-highcharts';
import { ActivatedRoute } from '@angular/router';
import { ReportsService } from 'src/app/services/reports.service';
import { DistrictService, SchoolsService, StatesService } from 'src/app/services';
import { TeacherService } from 'src/app/services/teacher.service';
import { StudentsService } from 'src/app/services/students.service';
import { DashboardService } from 'src/app/services/dashboard.service';
import { Subject } from 'rxjs';


@Component({
  selector: 'app-doked-report',
  templateUrl: './doked-report.component.html',
  styleUrls: ['./doked-report.component.css']
})
export class DokedReportComponent implements OnInit {
  periodList = AppConst.periodList;
  searchForm: FormGroup;
  showSearchButton = false;
  barPushInOut: any;
  barInstruction: any;
  barChartPushInOut: any = {
    chart: {
      type: 'bar'
    },
    title: {
      text: 'Push In Push Out'
    },
    credits: { enabled: false },
    xAxis: {
      categories: ['Push In', 'Pull Out', 'Co-teaching', 'Remote']
    },
    yAxis: {
      min: 0,
      title: {
        text: 'Total Push In Push Out'
      },
    },
    legend: {
      reversed: true
    },
    // plotOptions: {
    //   series: {
    //     stacking: 'normal'
    //   }
    // },
    series: [
      {
        type: 'bar',
        name: 'John',
        data: [5, 3, 4, 7]
      },
      // {
      //   type: 'bar',
      //   name: 'Jane',
      //   data: [2, 2, 3, 2, 1]
      // },
      // {
      //   type: 'bar',
      //   name: 'Joe',
      //   data: [3, 4, 4, 2, 5]
      // }
    ]
  };
  barChartInstruction: any = {
    chart: {
      type: 'bar'
    },
    title: {
      text: 'Instructions'
    },
    credits: { enabled: false },
    xAxis: {
      categories: ['Phoemic Awareness', 'Reading', 'Writing', 'Cultural Lesson', 'Classroom Assignment Scaffolding', 'Assessment', 'High Frequency Words']
    },
    yAxis: {
      min: 0,
      title: {
        text: 'Total Instructions'
      },
    },
    legend: {
      reversed: true
    },
    // plotOptions: {
    //   series: {
    //     stacking: 'normal'
    //   }
    // },
    series: [
      {
        type: 'bar',
        name: 'John',
        data: [5, 3, 4, 7, 2, 8, 1, 6]
      },
      // {
      //   type: 'bar',
      //   name: 'Jane',
      //   data: [2, 2, 3, 2, 1]
      // },
      // {
      //   type: 'bar',
      //   name: 'Joe',
      //   data: [3, 4, 4, 2, 5]
      // }
    ]
  };
  pieChartData: Subject<any> = new Subject();
  pieChart: any = [];
  showOtherFilters = false;
  districtList = [];
  schoolList = [];
  teacherList = [];
  studentList = [];
  defaultDataAfterRedirecting;
  pieDurationData: Subject<any> = new Subject();
  pieDuration: any = [];

  constructor(
    private dokedService: DokedListService,
    private sharedService: SharedService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    public reportService: ReportsService,
    public districtservice: DistrictService,
    public schoolService: SchoolsService,
    public teacherService: TeacherService,
    public studentService: StudentsService,
    public dashboardService: DashboardService
  ) {
    this.setForm();
    this.route.params.subscribe(params => {
      // console.log(params)
      if (params) {
        if (params.id) {
          this.sharedService.showLoader();
          this.reportService.getReportList().subscribe((res: any) => {
            if (res) {
              let array = res.data;
              let selectedReport = array.filter(x => x._id == params.id);
              // console.log(selectedReport);
              this.defaultDataAfterRedirecting = selectedReport[0];
              this.showOtherFilters = true;
              this.callAPIsForFilter();
            }
          }, err => {
            this.sharedService.hideLoader();
          })
        }
      }
    });
  }

  ngOnInit(): void {
    this.sharedService.showLoader();
    // this.setForm();
    this.onPeriodChange();
    // this.search();
    // this.getReportsList();
  }

  callAPIsForFilter() {
    this.getDistrict();
    this.getSchool();
    this.getTeacher();
    this.getStudent();
  }

  setFilterFormAfterAPICall() {
    let districtId = this.defaultDataAfterRedirecting.districtId;
    let schoolId = this.defaultDataAfterRedirecting.schoolId;
    let teacherId = this.defaultDataAfterRedirecting.teacherId;
    let studentId = this.defaultDataAfterRedirecting.studentId;

    let sDate = this.defaultDataAfterRedirecting.startDate;
    let eDate = this.defaultDataAfterRedirecting.endDate;
    this.setFilterDropdown(districtId, schoolId, teacherId, studentId);
    this.setDateDropdown(sDate, eDate);
  }

  setFilterDropdown(DId, SchId, TId, StuId) {
    this.searchForm.controls.districtId.setValue(DId);
    this.searchForm.controls.schoolId.setValue(SchId);
    this.searchForm.controls.teacherId.setValue(TId);
    this.searchForm.controls.studentId.setValue(StuId);
    // console.log(this.searchForm.value);
   
  }

  setDateDropdown(startDate, endDate) {
    this.searchForm.controls.period.setValue('5');
    this.onPeriodChange();
    let startDateArray = this.formatWithString(startDate);
    let endDateArray = this.formatWithString(endDate);
    
    // Set start and end Date for given value
    this.searchForm.controls.created_from.setValue({
      year: Number(startDateArray[0]),
      month: Number(startDateArray[1]),
      day: Number(startDateArray[2])
    });
    this.searchForm.controls.created_to.setValue({
      year: Number(endDateArray[0]),
      month: Number(endDateArray[1]),
      day: Number(endDateArray[2])
    });
  

    this.getAllChartData();
    // Disable FOrm COntrol afte setvalue
    this.disabledFormControl();

  }
  setForm() {
    this.searchForm = this.fb.group({
      period: ["4"],
      created_from: [""],
      created_to: [""],
      districtId: [null],
      schoolId: [null],
      teacherId: [null],
      studentId: [null]
    });
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
      // Call API on Change dropdown
      this.search();
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
      // Call API on Change dropdown
      this.search();
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
      // Call API on Change dropdown
      this.search();
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
      // Call API on Change dropdown
      this.search();
    } else if (Number(this.searchForm.value.period) === 5) {
      this.sharedService.hideLoader();
      this.showSearchButton = true;
    }

  }

  dateChange() {
    // console.log(this.searchForm.value.period);
    if (Number(this.searchForm.value.period) == 5 && !this.showOtherFilters) {
      return false;
    }
    return true;
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

    this.getReportsList();
  }

  format(date: NgbDateStruct): string {
    return date
      ? `${date.year}-${date.month ? date.month : ""}-${date.day ? date.day : ""}`
      : "";
  }

  formatWithString(date) {
    let dateParts = date.trim().split('-');
    // console.log(dateParts);
    return dateParts;
    // return object
    //   ? `${date.year}-${date.month ? date.month : ""}-${date.day ? date.day : ""}`
    //   : "";
  }

  getDataWithDate() {
    this.sharedService.showLoader();
    this.search();
    // this.getReportsList();
  }

  getReportsList() {
    this.sharedService.hideLoader()
  }

  getAllChartData() {
    this.pieChart = [];
    this.pieDuration = [];
    let barPushInOut = new Highcharts.Chart(this.barChartPushInOut);
    this.barPushInOut = barPushInOut;
    let barInstruction = new Highcharts.Chart(this.barChartInstruction);
    this.barInstruction = barInstruction;

   
    let startDate = this.defaultDataAfterRedirecting.startDate;
    let endDate = this.defaultDataAfterRedirecting.endDate;
   
    this.dashboardService.getReportPieChart('','','','', startDate, endDate).subscribe((res: any) => {
      if (res) {
        this.pieChart = res.data;
        this.pieChartData.next(this.pieChart);
      }
    })

    this.dashboardService.getPiechartDuration('','','','',startDate, endDate).subscribe((res: any) => {
      if (res) {
        this.pieDuration = res.data;
        this.pieDurationData.next(this.pieDuration);
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

  // Fetch School
  getSchool() {
    this.schoolService.getSchoolWithoutFilter().subscribe((res: any) => {
      if (res) {
        this.sharedService.hideLoader();
        this.schoolList = res.data;

      }
    });
  }

  // Fetch Teacher
  getTeacher() {
    this.teacherService.getTeacher('').subscribe((res: any) => {
      if (res) {
        this.sharedService.hideLoader();
        this.teacherList = res.data;

      }
    });
  }

  // Fetch Student
  getStudent() {
    this.studentService.getAllStudentWithoutFilters().subscribe((res: any) => {
      if (res) {
        this.sharedService.hideLoader();
        this.studentList = res.data;
        this.setFilterFormAfterAPICall();
      }
    });
  }

  disabledFormControl() {
    // this.searchForm.controls['districtId'].disable();
    // this.searchForm.controls['schoolId'].disable();
    // this.searchForm.controls['teacherId'].disable();
    // this.searchForm.controls['studentId'].disable();
    this.searchForm.disable();
    // console.log(this.searchForm.value);
    this.sharedService.hideLoader();

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
}
