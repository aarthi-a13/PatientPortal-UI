import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PatientEnrollmentService {
  BASE_URL = 'https://patientportal-production.up.railway.app/patient/';
  constructor(private http: HttpClient) { }

  uploadEnrollment(formData: FormData): Observable<any> {
    return this.http.post<any>(this.BASE_URL + 'enrollment/upload', formData)
  }
}
