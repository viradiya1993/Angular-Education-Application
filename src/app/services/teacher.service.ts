import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';


const BACKEND_URL = environment.apiUrl + '';
@Injectable({
  providedIn: 'root'
})
export class TeacherService {

  constructor(private http: HttpClient) { }

  //Fetch Teacher
  // getTeacher(search: any, schoolId: any, subjectId: any, status: any, countryId: any, stateId: any, cityId: any, page: any, limit: any) {
  //   let params = new HttpParams()
  //     .set('search', search ? search : '')
  //     .set('schoolId', schoolId ? schoolId : '')
  //     .set('subjectId', subjectId ? subjectId : '')
  //     .set('isDeleted', status ? status : '')
  //     .set('countryId', countryId ? countryId : '')
  //     .set('stateId', stateId ? stateId : '')
  //     .set('cityId', cityId ? cityId : '')
  //     .set('pageNumber', page)
  //     .set('pageSize', limit)
  //   return this.http.get(BACKEND_URL + '/teachers', { params })
  // }
  getTeacher(data: any) {
    return this.http.post(BACKEND_URL + '/teachers/get', data)
  }

  //Add Teacher
  addTeacher(data: any) {
    return this.http.post(BACKEND_URL + '/teachers', data);
  }

  //Update Teacher
  updateTeacher(data: any, id: any) {
    return this.http.put(BACKEND_URL + '/teachers/update/' + id, data);
  }

  //Delete Teacher
  deleteTeacher(id: any) {
    return this.http.put(BACKEND_URL + '/teachers/delete/' + id, '')
  }

  //Active Inactive Teacher
  activeInactivestatus(id: any) {
    return this.http.put(BACKEND_URL + '/teachers/change_status/' + id, '')
  }

  

}
