import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

const BACKEND_URL = environment.apiUrl + '';

@Injectable({
  providedIn: 'root'
})
export class StudentsService {

  constructor(private http: HttpClient) { }

  //Fetch School
  getAllStudent(search: any, schoolId: any, status: any, page: any, limit: any) {
    let params = new HttpParams()
      .set('search', search ? search : '')
      .set('schoolId', schoolId ? schoolId : '')
      .set('status', status ? status : '')
      .set('pageNumber', page)
      .set('pageSize', limit)
    return this.http.get(BACKEND_URL + '/students', { params })
  }

  //Fetch School
  getAllStudentWithoutFilters() {
    return this.http.get(BACKEND_URL + '/students')
  }
  //Fetch Student With Particular school id
  getStudentWithId(schoolId: any) {
    let params = new HttpParams()
      .set('schoolId', schoolId ? schoolId : '')
      .set('status', 'false')
    return this.http.get(BACKEND_URL + '/students', { params })
  }

  //Fetch Active Student With SchoolId
  getActiveStudents(schoolId: string) {
    let params = new HttpParams()
      .set('isDeleted', 'false')
      .set('schoolId', schoolId)
    return this.http.get(BACKEND_URL + '/students', { params })
  }

  // Create Student
  craeteStudent(item: any) {
    return this.http.post(BACKEND_URL + '/students', item);

  }

  //Update Student
  updateStudent(item, studentId) {
    const url = `${BACKEND_URL}/students/${studentId}`;
    return this.http.put(url, item);
  }

  //Delete Student
  deleteStudent(id: any) {
    return this.http.delete(BACKEND_URL + '/students/' + id)
  }

  //Active Deactive student
  activeDeacticveStudent(id: any) {
    return this.http.put(BACKEND_URL + '/students/change_status/' + id, '')
  }

  // Add question form data
  craeteQuestionStudent(item: any) {
    return this.http.post(BACKEND_URL + '/queans_student_dashbord', item);

  }
}
