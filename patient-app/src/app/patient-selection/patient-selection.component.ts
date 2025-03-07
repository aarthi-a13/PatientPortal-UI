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
  selectedFiles: File | null = null;
  public imageWidth: number = 0;
  public imageHeight: number = 0;
  showAlert = false;
  alertMessage = '';
  alertType = 'warning';
  fileName = '';

  selectTab(tab: string) {
    this.selectedTab = tab;
  }
  constructor(public patientEnrollmentService: PatientEnrollmentService) {}

  ngOnInit(): void {}

  clearFile(): void {
    this.fileName = '';
    (document.getElementById('fileInput') as HTMLInputElement).value = ''; // Reset file input
  }

  handleFileInput(input: any): void {
    const file = input.target.files[0] as File;
    this.selectedFiles = file;
    if (file) {
      this.fileName = file.name;
      console.log('Selected file:', file);
    }
    console.log('input webcam image', input);
    if (!input || !input.files) {
      console.error('No file input detected.');
      this.showAlert = true;
      this.alertMessage = 'No file input detected.';
      this.alertType = 'danger';
      return;
    }

    const files = input.files;
    if (files.length === 0) {
      console.error('No files selected.');
      this.showAlert = true;
      this.alertMessage = 'No files selected.';
      this.alertType = 'danger';
      return;
    }

    if (this.selectedFiles) {
      this.selectedFiles = input.files;
      // Create an image object
      const img = new Image();
      img.src = URL.createObjectURL(files);
      img.onload = () => {
        // Get natural width & height
        this.imageWidth = img.naturalWidth;
        this.imageHeight = img.naturalHeight;

        console.log('Image Natural Size:', this.imageWidth, this.imageHeight);

        // Get actual displayed size in the DOM
        setTimeout(() => {
          const videoElement = document.querySelector(
            'video'
          ) as HTMLVideoElement;
          if (videoElement) {
            const computedWidth = videoElement.clientWidth;
            const computedHeight = videoElement.clientHeight;
            if (computedWidth < 100 || computedHeight < 100) {
              this.showAlert = true;
              this.alertMessage =
                'Image resolution too low. Please upload a clearer image.';
              this.alertType = 'danger';
            }
            console.log('Actual Rendered Size:', computedWidth, computedHeight);
          }
        }, 100); // Timeout to ensure styles are applied
      };
    }
  }

  uploadEnrollment(): void {
    if (this.selectedFiles === null) {
      // this.uploadError = 'Please upload at least one enrollment form.';
      return;
    }

    const formData = new FormData();
    formData.append('files', this.selectedFiles);
    this.patientEnrollmentService.uploadEnrollment(formData).subscribe({
      next: (response) => {
        if (!response.patient?.pid) {
          throw new Error(
            response.message ||
              'No valid details extracted. Please upload a clearer form.'
          );
        }
      },
      error: (error: HttpErrorResponse) => {
        console.error('Upload failed:', error);
      },
    });
  }
}
