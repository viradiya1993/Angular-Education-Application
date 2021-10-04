import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import * as Highcharts from 'angular-highcharts';
import { Subject } from 'rxjs';
import { SharedService } from '../services/shared.service';

@Component({
  selector: 'app-duration-pie',
  templateUrl: './duration-pie.component.html',
  styleUrls: ['./duration-pie.component.css']
})
export class DurationPieComponent implements OnInit {
  @Input() pieChartDuration: Subject<any>;
  durationChart: any;
  pieData: any = [];
  pieChartData: any = [];
  constructor(private cdr: ChangeDetectorRef, private shared: SharedService) { }

  ngOnInit(): void {
    this.shared.showLoader();
    this.pieChartDuration.subscribe((res: any) => {
      if (res) {
        this.shared.hideLoader();
        this.pieChartData = res;
        for(var i = 0; i < this.pieChartData.length; i++) {
          this.pieData.push({
            name: this.pieChartData[i].durationPeriod,
            y: +this.pieChartData[i].totalCount,
          });
        }
        this.durationPieChart();
        this.cdr.detectChanges();
      }
    });
  }

  //Init Student Pie Chart
  durationPieChart() {
    const chart = new Highcharts.Chart({
      chart: {
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
      },
      title: {
        text: 'Duration Pie Chart Report'
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
    this.durationChart = chart;
  }
}
