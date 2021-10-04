import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

const BACKEND_URL = environment.apiUrl + '';
@Injectable({
  providedIn: 'root'
})
export class ReportsService {

  constructor(public http: HttpClient) { }

  //Fetch Endorsments
  // search: any, status: any, page: any, limit: any
  getReportList() {
    let params = new HttpParams()
    // .set('search', search ? search : '')
    // .set('status', status ? status : '')
    // .set('pageNumber', page)
    // .set('pageSize', limit)
    return this.http.get(BACKEND_URL + '/reports', { params })
  }

  //Add Report
  addReports(data: any) {
    return this.http.post(BACKEND_URL + '/reports', data);
  }

  //Update Report
  updateReports(data: any, id: any) {
    return this.http.put(BACKEND_URL + '/reports/' + id, data);
  }

  //Delete Reports
  deleteReports(id: any) {
    return this.http.delete(BACKEND_URL + '/reports/' + id)
  }

  //Active Inactive Reports
  activeInactivestatus(id: any) {
    return this.http.put(BACKEND_URL + '/reports/change_status/' + id, '')
  }
}
