import { Component, OnInit } from '@angular/core';
import { PatientEnrollmentService } from '../services/patient-enrollment.service';
import { HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-patient-selection',
  templateUrl: './patient-selection.component.html',
  styleUrls: ['./patient-selection.component.css'],
})
export class PatientSelectionComponent implements OnInit {
  patientForm!: FormGroup;
  selectedTab: string = 'new'; // Default tab
  selectedFiles: File[] = [];
  public imageWidth: number = 0;
  public imageHeight: number = 0;
  showAlert = false;
  alertMessage = '';
  alertType = 'warning';
  showEnrollmentButton = false;
  isPatientDetailsReceived = false;
  patient: any = {
    fullName: '',
    dateOfBirth: '',
    ssn: '',
    pid: '',
    address: '',
    contactNumber: '',
  };

  selectTab(tab: string) {
    this.selectedTab = tab;
  }
  constructor(
    public patientEnrollmentService: PatientEnrollmentService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.initializeForm();
  }
  initializeForm() {
    this.patientForm = this.fb.group({
      fullName: [{ value: this.patient.fullName, disabled: true }],
      dateOfBirth: [{ value: this.patient.dateOfBirth, disabled: true }],
      ssn: [{ value: this.patient.ssn, disabled: true }],
      pid: [{ value: this.patient.pid, disabled: true }],
      address: [this.patient.address],
      contactNumber: [this.patient.contactNumber],
    });
  }

  clearFile(): void {
    (document.getElementById('fileInput') as HTMLInputElement).value = ''; // Reset file input
    this.showAlert = true;
    this.showEnrollmentButton = false;
    this.alertMessage = 'Please select at lease one file';
    this.alertType = 'danger';
    this.selectedFiles = [];
  }

  handleFileInput(input: any): void {
    this.showAlert = false;

    const files = (this.selectedFiles = input?.target?.files);

    console.log('input webcam image', files.length);
    if (!files) {
      console.error('No file input detected.');
      this.showAlert = true;
      this.alertMessage = 'No file input detected.';
      this.alertType = 'danger';
      return;
    }

    if (files.length === 0) {
      console.error('No files selected.');
      this.showAlert = true;
      this.alertMessage = 'No files selected.';
      this.alertType = 'danger';
      return;
    }

    if (files) {
      this.selectedFiles = input?.target?.files;
      this.showEnrollmentButton = true;
      console.log(this.selectedFiles[0]);
      for (let i = 0; i < this.selectedFiles.length; i++) {
        console.log('iterate files ', this.selectedFiles[i]);
        // Create an image object
        const img = new Image();
        img.src = URL.createObjectURL(this.selectedFiles[i]);
        img.onload = () => {
          // Get natural width & height
          this.imageWidth = img.naturalWidth;
          this.imageHeight = img.naturalHeight;
          if (this.imageWidth < 500 || this.imageHeight < 500) {
            this.showEnrollmentButton = false;
            this.showAlert = true;
            this.alertMessage =
              'Image resolution too low. Please upload a clearer image.';
            this.alertType = 'danger';
          }
        };
      }
    }
  }

  submitEnrollment(pid: string) {}

  uploadEnrollment(): void {
    if (this.selectedFiles.length === 0) {
      this.showAlert = true;
      this.alertMessage = 'Please upload at least one enrollment form.';
      return;
    }

    const formData = new FormData();
    for (let i = 0; i < this.selectedFiles.length; i++) {
      const file = this.selectedFiles[i];
      formData.append('files', file);
    }
    this.patientEnrollmentService.uploadEnrollment(formData).subscribe({
      next: (response: any) => {
        if (!response?.pid) {
          this.showAlert = true;
          this.alertMessage =
            response.message ||
            'No valid details extracted. Please upload a clearer form.';
        } else {
          this.isPatientDetailsReceived = true;
          this.patient = response;
          this.patientForm.setValue({
            fullName: this.patient.fullName,
            dateOfBirth: this.patient.dateOfBirth,
            ssn: this.patient.ssn,
            pid: this.patient.pid,
            address: this.patient.address,
            contactNumber: this.patient.contactNumber
          });
        }
      },
      error: (error: HttpErrorResponse) => {
        console.error('Upload failed:', error);
        this.showAlert = true;
        this.alertMessage = error.message || 'Upload failed.';
        this.alertType = 'danger';
        // this.clearFile();
      },
    });
  }
}
