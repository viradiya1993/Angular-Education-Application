import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

const BACKEND_URL = environment.apiUrl + '';
@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(private http: HttpClient) { }

  //Get All State Count
  getAllStateCount(startDate: any, endDate: any) {
    let params = new HttpParams()
      .set('startDate', startDate ? startDate : '')
      .set('endDate', endDate ? endDate : '')
    return this.http.get(BACKEND_URL + '/dashbord/state', { params })
  }

  //Get All District Count
  getAllDistrictCount(startDate: any, endDate: any) {
    let params = new HttpParams()
      .set('startDate', startDate ? startDate : '')
      .set('endDate', endDate ? endDate : '')
    return this.http.get(BACKEND_URL + '/dashbord/district', { params })
  }

  //Get All School Count
  getAllSchoolCount(startDate: any, endDate: any) {
    let params = new HttpParams()
      .set('startDate', startDate ? startDate : '')
      .set('endDate', endDate ? endDate : '')
    return this.http.get(BACKEND_URL + '/dashbord/school', { params })
  }

  //Get All Teacher Count
  getAllTeacherCount(startDate: any, endDate: any, schoolId: any) {
    let params = new HttpParams()
      .set('startDate', startDate ? startDate : '')
      .set('endDate', endDate ? endDate : '')
      .set('schoolId', schoolId ? schoolId : '')
    return this.http.get(BACKEND_URL + '/dashbord/teacher', { params })
  }

  //Get All Student Count
  getAllStudentCount(startDate: any, endDate: any, schoolId: any) {
    let params = new HttpParams()
      .set('startDate', startDate ? startDate : '')
      .set('endDate', endDate ? endDate : '')
      .set('schoolId', schoolId ? schoolId : '')
    return this.http.get(BACKEND_URL + '/dashbord/student', { params })
  }

  //Get Report Pie Chart Data
  getReportPieChart(districtId?: any, schoolId?: any, teacherId?: any, studentId?: any, startDate?: any, endDate?: any ) {
    let params = new HttpParams()
    .set('districtId', districtId ? districtId : '')
    .set('schoolId', schoolId ? schoolId : '')
    .set('teacherId', teacherId ? teacherId : '')
    .set('studentId', studentId ? studentId : '')
    .set('startDate', startDate ? startDate : '')
    .set('endDate', endDate ? endDate : '')
    return this.http.get(BACKEND_URL + '/queans_student_dashbord/chart1', { params })
  }

  //Get Pie Chart Duration
  getPiechartDuration(districtId?: any, schoolId?: any, teacherId?: any, studentId?: any, startDate?: any, endDate?: any) {
    let params = new HttpParams()
    .set('districtId', districtId ? districtId : '')
    .set('schoolId', schoolId ? schoolId : '')
    .set('teacherId', teacherId ? teacherId : '')
    .set('studentId', studentId ? studentId : '')
    .set('startDate', startDate ? startDate : '')
    .set('endDate', endDate ? endDate : '')
    return this.http.get(BACKEND_URL + '/queans_student_dashbord/chart2', { params })
  }
}
