import { Component, OnInit } from '@angular/core';
import { PatientEnrollmentService } from '../services/patient-enrollment.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-patient-selection',
  templateUrl: './patient-selection.component.html',
  styleUrls: ['./patient-selection.component.css'],
})
export class PatientSelectionComponent implements OnInit {
  selectedTab: string = 'new'; // Default tab
  selectedFiles: File[] = [];
  public imageWidth: number = 0;
  public imageHeight: number = 0;
  showAlert = false;
  alertMessage = '';
  alertType = 'warning';
  showEnrollmentButton = false;

  selectTab(tab: string) {
    this.selectedTab = tab;
  }
  constructor(public patientEnrollmentService: PatientEnrollmentService) {}

  ngOnInit(): void {}

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
      next: (response) => {
        if (!response.patient?.pid) {
          this.showAlert = true;
          this.alertMessage =
            response.message ||
            'No valid details extracted. Please upload a clearer form.';
        }
      },
      error: (error: HttpErrorResponse) => {
        console.error('Upload failed:', error);
      },
    });
  }
}
