import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { AuthService } from 'src/app/auth/_service/auth.service';
import { AppConst } from 'src/app/shared/constant/app.constant';
import { SharedService } from 'src/app/shared/services/shared.service';
import { DashboardService } from '../../services/dashboard.service';

@Component({
	selector: 'app-dashboard',
	templateUrl: './dashboard.component.html',
	styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
	role: any;
	periodList = AppConst.periodList;
	showSearchButton = false;
	selected = { start: moment().subtract(29, 'days'), end: moment() }
	startDate: any;
	endDate: any;
	searchForm: FormGroup;
	dashboradAllCount = [];
	pieChart: any = [];
	piechartOption = [
		{
			name: 'Chrome',
			y: 59.41,
			//sliced: true,
			//selected: true
		},
		{
			name: 'Internet Explorer',
			y: 11.84
		}, {
			name: 'Firefox',
			y: 11.85
		}, {
			name: 'Edge',
			y: 4.67
		}, {
			name: 'Safari',
			y: 5.18
		}, {
			name: 'Sogou Explorer',
			y: 1.64
		}, {
			name: 'Opera',
			y: 1.6
		}, {
			name: 'QQ',
			y: 1.2
		}, {
			name: 'Other',
			y: 2.61
		}
	]
	barChart: any = [];
	// barChartOption = [
	// 	{
	// 		categories: ['Apples', 'Oranges', 'Pears', 'Grapes', 'Bananas'],
	// 		data: [{
	// 			name: 'John',
	// 			data: [5, 3, 4, 7, 2]
	// 		},
	// 		{
	// 			name: 'Jane',
	// 			data: [2, 2, 3, 2, 1]
	// 		},
	// 		{
	// 			name: 'Joe',
	// 			data: [3, 4, 4, 2, 5]
	// 		}]
	// 	}
	// ]
	ranges: any = {
		'Today': [moment(), moment()],
		'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
		'Last 7 Days': [moment().subtract(6, 'days'), moment()],
		'Last 30 Days': [moment().subtract(29, 'days'), moment()],
		'This Month': [moment().startOf('month'), moment().endOf('month')],
		'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')],
	};
	defaultSchoolId = '';
	constructor(
		public sharedService: SharedService,
		public dashboard: DashboardService,
		private fb: FormBuilder,
		public datepipe: DatePipe,
		public authService: AuthService
	) {
		this.sharedService.showLoader();
		this.role = this.sharedService.getRole();
		this.defaultSchoolId = this.authService.currentUserSchoolIdValue;
	}



	ngOnInit() {
		this.searchForm = this.fb.group({
			period: ["4"],
			created_from: [""],
			created_to: [""],
		});
		this.getAllChartData();
		this.onPeriodChange();
		// this.search();

	}

	//Get All Chart Data
	getAllChartData() {
		this.pieChart = [];
		this.barChart = [];
		this.pieChart = this.piechartOption;
		//this.barChart = this.barChartOption;
	}


	onPeriodChange() {
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
			this.search();
		} else if (Number(this.searchForm.value.period) === 5) {
			this.showSearchButton = true;
		}
	}

	dateChange() {
		if (Number(this.searchForm.value.period) == 1 ||
			Number(this.searchForm.value.period) == 2 ||
			Number(this.searchForm.value.period) == 3 ||
			Number(this.searchForm.value.period) == 4) {
			return true;
		}
		return false;
	}

	search() {
		this.sharedService.showLoader();
		this.searchForm.value["created_from"] =
			typeof this.searchForm.value["created_from"] === "object"
				? this.format(this.searchForm.value["created_from"])
				: this.searchForm.value["created_from"];
		this.searchForm.value["created_to"] =
			typeof this.searchForm.value["created_to"] === "object"
				? this.format(this.searchForm.value["created_to"])
				: this.searchForm.value["created_to"];

		this.dashboradAllCount = [];
		if (this.role == "Super-Admin") {
			this.getAllStateCount();
			this.getAllDistrictCount();
			this.getAllSchoolCount();
			this.getAllTeachersCount();
			this.getAllStudentCount();
			this.defaultSchoolId = '';
		} else if (this.role == "School-Admin" || this.role == "School-Sub-Admin") {
			this.getAllTeachersCount();
			this.getAllStudentCount();
		} else {
			this.getAllStudentCount();
		}
	}

	format(date: NgbDateStruct): string {
		return date
			? `${date.year}-${date.month ? date.month : ""}-${date.day ? date.day : ""}`
			: "";
	}

	getDataWithDate() {
		this.sharedService.showLoader();
		this.search();
	}
	//Get All State Count
	getAllStateCount() {
		let startDate = this.searchForm.value["created_from"];
		let endDate = this.searchForm.value["created_to"];
		this.dashboard.getAllStateCount(startDate, endDate).subscribe((res: any) => {
			if (res) {
				this.sharedService.hideLoader();
				let totalCount = 0;
				let xAxisArray = [];
				let yAxisArray = {
					name: 'State',
					data: [],
					color: '#cbd119',
				}
				res.data.forEach(element => {
					yAxisArray["data"].push(element.count);
					xAxisArray.push(element.date);
					totalCount = totalCount + element.count;
				});

				this.dashboradAllCount.push({
					value: 'State Count',
					icon: 'isState',
					color: '#cbd119',
					total: totalCount,
					data: yAxisArray,
					categories: xAxisArray
				});
			}
		}, err => {
			this.sharedService.hideLoader();
			this.sharedService.swalError(err);
		})
	}

	//Get All District Count
	getAllDistrictCount() {
		let startDate = this.searchForm.value["created_from"];
		let endDate = this.searchForm.value["created_to"];
		this.dashboard.getAllDistrictCount(startDate, endDate).subscribe((res: any) => {
			if (res) {
				this.sharedService.hideLoader();
				let totalCount = 0;
				let xAxisArray = [];
				let yAxisArray = {
					name: 'District',
					data: [],
					color: '#3699DD',
				}
				res.data.forEach(element => {
					yAxisArray["data"].push(element.count);
					xAxisArray.push(element.date);
					totalCount = totalCount + element.count;
				});
				this.dashboradAllCount.push({
					value: 'District Count',
					icon: 'isdistrict',
					color: '#cbd119',
					total: totalCount,
					data: yAxisArray,
					categories: xAxisArray
				});
			}
		}, err => {
			this.sharedService.hideLoader();
			this.sharedService.swalError(err);
		})
	}

	//Get All School Count
	getAllSchoolCount() {
		let startDate = this.searchForm.value["created_from"];
		let endDate = this.searchForm.value["created_to"];
		this.dashboard.getAllSchoolCount(startDate, endDate).subscribe((res: any) => {
			if (res) {
				this.sharedService.hideLoader();
				let totalCount = 0;
				let xAxisArray = [];
				let yAxisArray = {
					name: 'School',
					data: [],
					color: '#C69D63',
				}
				res.data.forEach(element => {
					yAxisArray["data"].push(element.count);
					xAxisArray.push(element.date);
					totalCount = totalCount + element.count;
				});
				this.dashboradAllCount.push({
					value: 'School Count',
					icon: 'isSchool',
					color: '#C69D63',
					total: totalCount,
					data: yAxisArray,
					categories: xAxisArray
				});
			}

		}, err => {
			this.sharedService.hideLoader();
			this.sharedService.swalError(err);
		})
	}

	//Get All Teacher Count
	getAllTeachersCount() {
		let startDate = this.searchForm.value["created_from"];
		let endDate = this.searchForm.value["created_to"];
		this.dashboard.getAllTeacherCount(startDate, endDate, this.defaultSchoolId).subscribe((res: any) => {
			if (res) {
				this.sharedService.hideLoader();
				let totalCount = 0;
				let xAxisArray = [];
				let yAxisArray = {
					name: 'Teacher',
					data: [],
					color: '#3dd1d4'
				}
				res.data.forEach(element => {
					yAxisArray["data"].push(element.count);
					xAxisArray.push(element.date);
					totalCount = totalCount + element.count;
				});
				this.dashboradAllCount.push(
					{
						value: 'Teachers Count',
						color: '#3dd1d4',
						icon: 'isTeacher',
						total: totalCount,
						data: yAxisArray,
						categories: xAxisArray
					},
				)
			}
		}, err => {
			this.sharedService.hideLoader();
			this.sharedService.swalError(err);
		})
	}

	//Get All Student Count
	getAllStudentCount() {
		let startDate = this.searchForm.value["created_from"];
		let endDate = this.searchForm.value["created_to"];
		this.dashboard.getAllStudentCount(startDate, endDate, this.defaultSchoolId).subscribe((res: any) => {
			if (res) {
				this.sharedService.hideLoader();
				let totalCount = 0;
				let xAxisArray = [];
				let yAxisArray = {
					name: 'Student',
					data: [],
					color: '#3699FF',
				}
				res.data.forEach(element => {
					yAxisArray["data"].push(element.count);
					xAxisArray.push(element.date);
					totalCount = totalCount + element.count;
				});
				this.dashboradAllCount.push({
					value: 'Student Count',
					icon: 'isStudent',
					color: '#3699FF',
					total: totalCount,
					data: yAxisArray,
					categories: xAxisArray
				});
			}
		}, err => {
			this.sharedService.hideLoader();
			this.sharedService.swalError(err);
		})
	}


}

