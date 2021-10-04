import { Component, Input, OnInit } from '@angular/core';
import * as Highcharts from 'angular-highcharts';

@Component({
	selector: 'app-bar-chart',
	templateUrl: './bar-chart.component.html',
	styleUrls: ['./bar-chart.component.css']
})
export class BarChartComponent implements OnInit {
	@Input() barChartData: any;
	barChartoptions: any;
	barChart: any;
	constructor() { }

	ngOnInit(): void {
		if (this.barChartData) {
			this.initBarChart();
		}
	}

	//Init Bar Chart
	initBarChart() {
		this.barChartoptions = {
			chart: {
				type: "column",
				width: 500
			},
			title: {
				text: `${this.barChartData.value} for Selected Date`
			},
			subtitle: {
				text: this.barChartData.value
			},
			xAxis: {
				categories: this.barChartData["categories"]
			},
			yAxis: {
				title: {
					text: `Numbers of ${this.barChartData.value}`
				}
			},
			tooltip: {
				valueSuffix: " "
			},
			credits: { enabled: false },
			series: this.barChartData["data"]
		};

		let Barchart = new Highcharts.Chart(this.barChartoptions);
		Barchart.addSeries(this.barChartData["data"], true, true);
		this.barChart = Barchart;
	}
}
