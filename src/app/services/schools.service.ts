import { Injectable, OnDestroy, Inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, forkJoin, Observable } from 'rxjs';
import { exhaustMap, map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';


@Injectable({
	providedIn: 'root'
})
export class SchoolsService {
	API_URL = `${environment.apiUrl}`;
	constructor(public http: HttpClient) {
	}
	// READ
	getAllSchool(
		search: any,
		stateId: any,
		districtId: any,
		status: any,
		page: any,
		limit: any
	) {
		let params = new HttpParams()
			.set('schoolName', search ? search : '')
			.set('stateId', stateId ? stateId : '')
			.set('districtId', districtId ? districtId : '')
			.set('isDeleted', status ? status : '')
			.set('pageNumber', page)
			.set('pageSize', limit)
		return this.http.get(this.API_URL + '/schools', { params });
	}
	// School Without Filters
	getSchoolWithoutFilter() {
		let params = new HttpParams()
			.set('isDeleted', 'false')
		return this.http.get(this.API_URL + '/schools', { params });
	}

	getSchoolDataWithID(schoolId: any) {
		let params = new HttpParams()
			.set('schoolId', schoolId)
		return this.http.get(this.API_URL + '/schools', { params });
	}

	// Create School
	createSchool(item: any): Observable<any> {
		return this.http.post(this.API_URL + '/schools/create', item);
	}


	//Update School
	updateSchool(item, schoolId): Observable<any> {
		const url = `${this.API_URL}/schools/update/${schoolId}`;
		return this.http.put(url, item);
	}

	// Delete School
	deleteSchool(id: any): Observable<any> {
		const url = `${this.API_URL}/schools/delete/` + `${id}`;
		return this.http.put(url, '');
	}
}
