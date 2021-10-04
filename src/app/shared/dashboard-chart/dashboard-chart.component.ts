import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';

// import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
// import { Label } from 'ng2-charts';
@Component({
  selector: 'app-dashboard-chart',
  templateUrl: './dashboard-chart.component.html',
  styleUrls: ['./dashboard-chart.component.css']
})
export class DashboardChartComponent implements OnInit, OnChanges {
  @Input() dashboardData: any;
  counterStart: any;
  barChart: any = [];
 
  constructor() { }

  ngOnChanges(): void {
  }


  ngOnInit(): void {
    this.barChart = [];
    this.barChart = this.dashboardData;
  }


}
