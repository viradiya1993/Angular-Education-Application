import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import * as Highcharts from 'angular-highcharts';
import { Subject } from 'rxjs';
import { SharedService } from '../services/shared.service';


@Component({
  selector: 'app-student-pie',
  templateUrl: './student-pie.component.html',
  styleUrls: ['./student-pie.component.css']
})
export class StudentPieComponent implements OnInit {
  @Input() pieStudentData: Subject<any>;
  studentChart: any;
  pieData: any = [];
  pieChartData: any = [];

  constructor(private cdr: ChangeDetectorRef, private shared: SharedService) { this.shared.showLoader();}
  
  ngOnInit(): void {
    this.pieStudentData.subscribe((res: any) => {
      if (res) {
        this.shared.hideLoader();
        this.pieChartData = res;
        for(var i = 0; i < this.pieChartData.length; i++) {
          this.pieData.push({
            name: this.pieChartData[i].studentName,
            y: +this.pieChartData[i].studentAttendanceAvg.toFixed(2),
          });
        }
        this.studentPieChart();
        this.cdr.detectChanges();
      }
    });
  }

  //Init Student Pie Chart
  studentPieChart() {
    const chart = new Highcharts.Chart({
      chart: {
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
      },
      title: {
        text: 'Student Pie Chart Report'
      },
      credits: { enabled: false },
      tooltip: {
        pointFormat: '{series.name}: <b>{point.y}</b>'
      },
      accessibility: {
        point: {
          valueSuffix: '%'
        }
      },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: 'pointer',
          dataLabels: {
            enabled: true,
            format: '<b>{point.name}</b>: {point.percentage:.1f} %'
          }
        }
      },
      legend: {
        align: 'right',
        verticalAlign: 'middle',
        shadow: true
      },
      series: [
        {
          type: 'pie',
          colorByPoint: true,
          data: this.pieData,
          showInLegend: true,
          dataLabels: {
            enabled: true
          },
        }
      ],
    })
    this.studentChart = chart;
  }
}
