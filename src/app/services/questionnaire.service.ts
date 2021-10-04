import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class QuestionnaireService {
  API_URL = `${environment.apiUrl}`;
  constructor(public http: HttpClient) {
  }

  //Fetch Question
  getQuestion(schoolId: any, search: any, status: any, page: any, limit: any) {
    let params = new HttpParams()
      .set('assignedSchool', schoolId ? schoolId : '')
      .set('search', search ? search : '')
      .set('status', status ? status : '')
      .set('pageNumber', page)
      .set('pageSize', limit)
    return this.http.get(this.API_URL + '/stu_dashbord_que', { params });
  }

  //Fetch Question With SchoolId
  getQuestionBySchoolId(schoolId: string) {
    let params = new HttpParams()
      // .set('isDeleted', 'false')
      .set('assignedSchool', schoolId)
    return this.http.get(this.API_URL + '/stu_dashbord_que', { params })
  }

  //Add Question
  addQuestion(item: any) {
    return this.http.post(this.API_URL + '/stu_dashbord_que', item);
  }

  //Update Questions
  updateQuestion(item, id): Observable<any> {
    const url = `${this.API_URL}/stu_dashbord_que/${id}`;
    return this.http.put(url, item);
  }

  //Delete Question
  deleteQuestion(id: any) {
    return this.http.delete(this.API_URL + '/stu_dashbord_que/' + id);
  }

  // check if default selected
  deafultSelected() {
    return this.http.post(this.API_URL + '/stu_dashbord_que/check_default', '');
  }

  //Active In Active Question
  activeInactiveQuestion(id: any) {
    return this.http.put(this.API_URL + '/stu_dashbord_que/change_status/' + id, '');
  }

}
