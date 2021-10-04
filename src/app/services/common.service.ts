import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';


const BACKEND_URL = environment.apiUrl + '';
@Injectable({
  providedIn: 'root'
})
export class CommonService {

  constructor(private http: HttpClient) { }

  //Fetch Subject
  getSubject() {
    let params = new HttpParams()
      .set('isDeleted', 'false')
    return this.http.get(BACKEND_URL + '/subjects', { params })
  }

  //Fetch School
  getSchool() {
    let params = new HttpParams()
      .set('isDeleted', 'false')
    return this.http.get(BACKEND_URL + '/schools', { params })
  }

  //Fetch Contry
  getCountry() {
    let params = new HttpParams()
      .set('isDeleted', 'false')
    return this.http.get(BACKEND_URL + '/get/country', { params })
  }

  //Fetch State
  getState() {
    let params = new HttpParams()
      .set('isDeleted', 'false')
    return this.http.get(BACKEND_URL + '/get/state', { params })
  }

  //Fetch City
  getCity(stateId) {
    let params = new HttpParams()
      .set('isDeleted', 'false')
      .set('stateId', stateId)
    return this.http.get(BACKEND_URL + '/get/city', { params })
  }

  //Fetch City
  getDistrict(stateId) {
    let params = new HttpParams()
      .set('isDeleted', 'false')
      .set('stateId', stateId)
    return this.http.get(BACKEND_URL + '/get/district', { params })
  }

}
