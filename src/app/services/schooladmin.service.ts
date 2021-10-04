import { HttpClient, HttpParams } from '@angular/common/http';
import { Inject, Injectable, OnDestroy } from '@angular/core';
import { forkJoin, Observable } from 'rxjs';
import { exhaustMap, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class SchooladminService {
  API_URL = `${environment.apiUrl}`;
  constructor(public http: HttpClient) {
  }

  //Fetch school admin
  getSchoolAdmin(search: any, status: any, page: any, limit: any) {
    let params = new HttpParams()
      .set('search', search ? search : '')
      .set('status', status ? status : '')
      .set('pageNumber', page)
      .set('pageSize', limit)
    return this.http.get(this.API_URL + '/users/school_admin', { params });
  }

  //Assign School
  AssognSchool(item: any): Observable<any> {
    return this.http.post(this.API_URL + '/schools/assign_to_user', item);
  }

  //UnAssign School
  UnAssignSchoolAdmin(item: any): Observable<any> {
    return this.http.put(this.API_URL + '/schools/unassign_to_user', item);
  }
  //Create School Admin
  createSchoolAdmin(item: any): Observable<any> {
    return this.http.post(this.API_URL + '/users/school_admin', item);
  }

  //Update School Admin
  updateSchoolAdmin(data: any, id: any): Observable<any> {
    return this.http.put(this.API_URL + '/users/school_admin/' + id, data);
  }

  //Delete School Admin
  deleteSchoolAdmin(id: any): Observable<any> {
    return this.http.delete(this.API_URL + '/users/school_admin/' + id)
  }

  //Active Deacticve Admin
  activeDeacticveAdmin(id: any) {
    return this.http.put(this.API_URL + '/users/school_admin/change_status/' + id, '')
  }
}
