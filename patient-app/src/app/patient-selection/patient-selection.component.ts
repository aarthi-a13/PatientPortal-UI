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
  existingPatientForm!: FormGroup;
  selectedTab: string = 'new'; // Default tab
  selectedFiles: File[] = [];
  insuranceCards: File[] = [];
  insuranceData: any;
  existingPatientInsuranceData: any;
  public imageWidth: number = 0;
  public imageHeight: number = 0;
  showAlert = false;
  alertMessage = '';
  alertType = 'warning';
  showEnrollmentButton = false;
  isPatientDetailsReceived = false;
  isExistingPatientDetailsReceived = false;
  showInsuranceSection = false;
  showInsuranceSectionExisting = false;
  patient: any = {
    fullName: '',
    dateOfBirth: '',
    ssn: '',
    pid: '',
    address: '',
    contactNumber: '',
    emergencyContact: '',
    medicalHistory: '',
    primaryPhysician: '',
  };
  existingPatient: any = {
    fullName: '',
    dateOfBirth: '',
    ssn: '',
    pid: '',
    address: '',
    contactNumber: '',
    emergencyContact: '',
    medicalHistory: '',
    primaryPhysician: '',
  };

  selectTab(tab: string) {
    this.selectedTab = tab;
    tab === 'new' ? this.initializeNewPatientForm() : this.initializeExistingPatientForm();
  }
  constructor(
    public patientEnrollmentService: PatientEnrollmentService,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.initializeNewPatientForm();
  }
  initializeExistingPatientForm() {
    this.existingPatientForm = this.fb.group({
      fullName: [{ value: this.existingPatient.fullName, disabled: true }],
      dateOfBirth: [{ value: this.existingPatient.dateOfBirth, disabled: true }],
      ssn: [{ value: this.existingPatient.ssn, disabled: true }],
      pid: '',
      address: [this.existingPatient.address],
      contactNumber: [this.existingPatient.contactNumber],
      emergencyContact: [this.existingPatient.emergencyContact],
      medicalHistory: [this.existingPatient.medicalHistory],
      primaryPhysician: [this.existingPatient.primaryPhysician],
    });
  }
  initializeNewPatientForm() {
    this.patientForm = this.fb.group({
      fullName: [{ value: this.patient.fullName, disabled: true }],
      dateOfBirth: [{ value: this.patient.dateOfBirth, disabled: true }],
      ssn: [{ value: this.patient.ssn, disabled: true }],
      pid: [{ value: this.patient.pid, disabled: true }],
      address: [this.patient.address],
      contactNumber: [this.patient.contactNumber],
      emergencyContact: [this.patient.emergencyContact],
      medicalHistory: [this.patient.medicalHistory],
      primaryPhysician: [this.patient.primaryPhysician],
    });
  }

  fetchPatientDetails() {
    let patientId = this.existingPatientForm.value.pid;
    // this.existingPatient.pid = patientId;
    if (!patientId) {
      this.showAlert = true;
      this.alertMessage = 'Please enter SSN or Patient ID.';
      this.alertType = 'danger';
      return;
    }
    this.patientEnrollmentService.fetchPatientDetails(patientId)
    .subscribe({
      next: (response: any) => {
        console.log(response);
        this.existingPatient = response;
        this.showInsuranceSectionExisting = true;
        this.isExistingPatientDetailsReceived = true;
        this.existingPatientForm.setValue({
          fullName: this.existingPatient?.fullName,
          dateOfBirth: this.existingPatient?.dateOfBirth,
          ssn: this.existingPatient?.ssn,
          pid: this.existingPatient?.pid,
          address: this.existingPatient?.address,
          contactNumber: this.existingPatient?.contactNumber,
          emergencyContact: this.existingPatient?.emergencyContact,
          medicalHistory: this.existingPatient?.medicalHistory,
          primaryPhysician: this.existingPatient?.primaryPhysician,
        });
        this.fetchInsuranceDetails(this.existingPatient?.pid);
      },
      error: (error: HttpErrorResponse) => {
        console.error('Fetching patient details failed:', error);
        this.showAlert = true;
        this.alertMessage =
          error.message || 'Fetching patient details failed.';
        this.alertType = 'danger';
      },
    });
  }

  fetchInsuranceDetails(patientId: string) {
    this.patientEnrollmentService.fetchPatientInsuranceDetails(patientId)
    .subscribe({
      next: (response: any) => {
        console.log(response);
        this.existingPatientInsuranceData = response;
      },
      error: (error: HttpErrorResponse) => {
        console.error('Fetching patient insurance details failed:', error);
        this.showAlert = true;
        this.alertMessage =
          error.message || 'Fetching patient insurance details failed.';
        this.alertType = 'danger';
      },
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

  submitEnrollment(patient: any, isExisting: boolean) {
    const value = patient.value;
    let patientData = {
      pid: value.pid,
      address: value.address,
      contactNumber: value.contactNumber,
      emergencyContact: value.emergencyContact,
      medicalHistory: value.medicalHistory,
      primaryPhysician: value.primaryPhysician,
    };

    this.patientEnrollmentService.submitEnrollment(patientData).subscribe({
      next: (response: any) => {
        console.log(response);
        if (response?.pid) {
          this.showAlert = true;
          this.alertMessage = response?.message;
          this.alertType = 'success';
          if (isExisting) {
            this.showInsuranceSectionExisting = true;
          } else {
            this.showInsuranceSection = true;
          }
        }
      },
      error: (error: HttpErrorResponse) => {
        console.error('Submit patient enroll failed:', error);
        this.showAlert = true;
        this.alertMessage =
          error.message || 'Patient Enroll Submission failed.';
        this.alertType = 'danger';
      },
    });
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
            contactNumber: this.patient.contactNumber,
            emergencyContact: this.patient.emergencyContact,
            medicalHistory: this.patient.medicalHistory,
            primaryPhysician: this.patient.primaryPhysician,
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

  validateImages($event: any) {
    const input = $event.target;
    if (!input || !input.files) {
      console.error('No file input detected.');
      this.showAlert = true;
      this.alertMessage = 'No file input detected.';
      this.alertType = 'danger';
      return;
    }

    const files = (this.insuranceCards = input.files);
    if (files.length === 0) {
      console.error('No files selected.');
      this.showAlert = true;
      this.alertMessage = 'No files selected.';
      this.alertType = 'danger';
      return;
    }

    if (!files) {
      console.error('No file input detected.');
      this.showAlert = true;
      this.alertMessage = 'No file input detected.';
      this.alertType = 'danger';
      return;
    }

    console.log('Validating', files.length, 'files.');
    for (let i = 0; i < this.insuranceCards.length; i++) {
      console.log('iterate cards ', this.insuranceCards[i]);
      // Create an image object
      const img = new Image();
      img.src = URL.createObjectURL(this.insuranceCards[i]);
      img.onload = () => {
        // Get natural width & height
        this.imageWidth = img.naturalWidth;
        this.imageHeight = img.naturalHeight;
        if (this.imageWidth < 500 || this.imageHeight < 500) {
          this.showAlert = true;
          this.alertMessage =
            'Image resolution too low. Please upload a clearer image.';
          this.alertType = 'danger';
        }
      };
    }
  }
  uploadInsurance(isExisting: boolean) {
    let files = this.insuranceCards;
    if (files.length === 0) {
      this.showAlert = true;
      this.alertMessage = 'Please upload at least one insurance card.';
      this.alertType = 'danger';
      return;
    }

    let formData = new FormData();
    for (let file of files) {
      formData.append('files', file);
    }

    this.patientEnrollmentService
      .uploadInsurance(isExisting ? this.existingPatient.pid : this.patient.pid, formData)
      .subscribe({
        next: (response: any) => {
          if (!response || !response?.insurance?.policyNumber) {
            this.showAlert = true;
            this.alertMessage = 'No valid insurance details extracted.';
            this.alertType = 'danger';
          } else {
            if (isExisting) {
              this.existingPatientInsuranceData = [...this.existingPatientInsuranceData, response.insurance];
            } else {
              this.insuranceData = response;
            }
            this.showAlert = true;
            this.alertMessage = response.message;
            this.alertType = 'success';
          }
        },
        error: (error: HttpErrorResponse) => {
          console.error('Insurance upload failed:', error);
          this.showAlert = true;
          this.alertMessage = error.message || 'Insurance upload failed.';
          this.alertType = 'danger';
        },
      });
  }
}
