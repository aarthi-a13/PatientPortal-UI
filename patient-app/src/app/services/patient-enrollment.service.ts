import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
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

  submitEnrollment(payload: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this.http.post<any>(this.BASE_URL + 'enrollment/submit', payload, { headers});
  }

  uploadInsurance(pid: string, formData: FormData): Observable<any> {
    return this.http.post<any>(this.BASE_URL + 'insurance/upload?pid=' + pid, formData);
  }
}
