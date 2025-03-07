import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  
  ngOnInit(): void {
  }
  
}
// UI Feedback Functions
/*
function navigateTo(section) {
  const newPatientSection = document.getElementById("newPatientSection");
  const existingPatientSection = document.getElementById("existingPatientSection");

  if (!newPatientSection || !existingPatientSection) return;

  // Hide both sections first
  newPatientSection.classList.add("d-none");
  existingPatientSection.classList.add("d-none");

  // Show the correct section
  if (section === "new") {
      newPatientSection.classList.remove("d-none");
  } else if (section === "existing") {
      existingPatientSection.classList.remove("d-none");
  }
}

function generatePatientForm(patient) {
  return `
      <h4>Review & Edit Patient Details</h4>
      <form id="patientDetailsForm">
          <label class="form-label">Full Name:</label>
          <input type="text" class="form-control" value="${patient.fullName}" disabled>
          
          <label class="form-label">Date of Birth:</label>
          <input type="text" class="form-control" value="${patient.dateOfBirth}" disabled>
          
          <label class="form-label">SSN:</label>
          <input type="text" class="form-control" value="${patient.ssn || ""}" disabled>
          
          <label class="form-label">Patient ID:</label>
          <input type="text" class="form-control" value="${patient.pid}" disabled>
          
          <label class="form-label">Address:</label>
          <input type="text" class="form-control" value="${patient.address}">
          
          <label class="form-label">Contact Number:</label>
          <input type="text" class="form-control" value="${patient.contactNumber}">

          <label class="form-label">Emergency Contact:</label>
          <input type="text" class="form-control" value="${patient.emergencyContact}">

          <label class="form-label">Primary Physician:</label>
          <input type="text" class="form-control" value="${patient.primaryPhysician}">

          <label class="form-label">Medical History:</label>
          <input type="text" class="form-control" value="${patient.medicalHistory}">
          
          <button type="button" class="btn btn-primary mt-3" onclick="submitEnrollment('${patient.pid}')">Submit</button>
      </form>
  `;
}

function submitEnrollment(pid) {
  let form = document.getElementById("patientDetailsForm");
  let patientData = {
      pid: pid,
      address: form.elements[4].value,
      contactNumber: form.elements[5].value,
      emergencyContact: form.elements[6].value,
      primaryPhysician: form.elements[7].value,
      medicalHistory: form.elements[8].value
  };

  fetch("/patient/enrollment/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patientData)
  })
      .then(response => response.json())
      .then(data => {
          alert(data.message);
          document.getElementById("insuranceSection").classList.remove("d-none");
      })
      .catch(error => console.error("Error:", error));
}

function uploadInsurance() {
  const files = document.getElementById("insuranceFile").files;
  const pid = document.getElementById("patientDetailsForm").elements[3].value;
  const insuranceSection = document.getElementById("insuranceSection");
  const errorDiv = document.getElementById("uploadError");

  if (files.length === 0) {
      showErrorMessage("Please upload at least one insurance card.");
      return;
  }

  const formData = new FormData();
  Array.from(files).forEach(file => formData.append("files", file));

  fetch(`/insurance/upload?pid=${pid}`, {
      method: "POST",
      body: formData
  })
      .then(response => {
          // Check if the response is OK (status in the range 200-299)
          if (!response.ok) {
              print("\nInsurance error");
              return response.json().then(errorResponse => {
                  // Handle the error response
                  if (errorResponse.error) {
                      print("\nInsurance expired...");
                      if (errorResponse.code === "INSURANCE_EXPIRED") {
                          showInsuranceExpiryModal(errorResponse.error);
                      } else {
                          showErrorMessage(errorResponse.error);
                      }
                  } else {
                      showErrorMessage("An unknown error occurred.");
                  }
                  throw new Error("Error response from server");
              });
          }
          return response.json(); // Parse the JSON if the response is OK
      })
      .then(response => {
          // Handle the successful response
          insuranceSection.innerHTML = generateInsuranceForm(response.insurance);
          showSuccessMessage(response.message);
          document.getElementById("finalSubmitSection").classList.remove("d-none");
      })
      .catch(error => showErrorMessage("Insurance processing failed: " + error.message));
}

function showInsuranceExpiryModal(message) {
  print("\nInside expiry modal");
  const modal = new bootstrap.Modal(document.getElementById('insuranceExpiryModal'));
  document.getElementById("expiryMessage").textContent = message;
  modal.show();
}

function showNewInsuranceUpload() {
  document.getElementById("insuranceFile").value = "";
  document.getElementById("insuranceFile").click();
  bootstrap.Modal.getInstance(document.getElementById('insuranceExpiryModal')).hide();
}

function continueWithoutInsurance() {
  document.getElementById("insuranceData").innerHTML = `<p class="text-warning">Proceeding without insurance coverage</p>`;
  document.getElementById("finalSubmitSection").classList.remove("d-none");
  bootstrap.Modal.getInstance(document.getElementById('insuranceExpiryModal')).hide();
}

function fetchPatientDetails() {
  let patientId = document.getElementById("patientId").value.trim();
  if (!patientId) {
      alert("Please enter SSN or Patient ID.");
      return;
  }

  fetch("/patient/enrollment/details?patientId=" + patientId)
      .then(response => response.json())
      .then(data => {
          if (!data || !data.fullName) {
              document.getElementById("patientDetails").innerHTML = "<p class='text-danger'>No records found.</p>";
          } else {
              document.getElementById("patientDetails").innerHTML = generatePatientForm(data);
              document.getElementById("existingInsuranceSection").classList.remove("d-none");
              fetchInsuranceDetails(data.pid);
          }
      })
      .catch(error => console.error("Error:", error));
}

function fetchInsuranceDetails(pid) {
  fetch("/patient/insurance/details?patientId=" + pid)
      .then(response => response.json())
      .then(data => {
          if (!data || !data.policyNumber) {
              document.getElementById("existingInsuranceData").innerHTML = "<p class='text-warning'>No active insurance found.</p>";
          } else {
              document.getElementById("existingInsuranceData").innerHTML = `<p><strong>Provider:</strong> ${data.insuranceProvider}</p><p><strong>Policy Number:</strong> ${data.policyNumber}</p>`;
          }
      })
      .catch(error => console.error("Error:", error));
}

function uploadNewInsurance() {
  let files = document.getElementById("newInsuranceFile").files;
  if (files.length === 0) {
      alert("Please upload at least one insurance card.");
      return;
  }

  let pid = document.getElementById("patientDetailsForm").elements[3].value;
  let formData = new FormData();
  for (let file of files) {
      formData.append("files", file);
  }

  fetch("/patient/insurance/upload?pid=" + pid, {
      method: "POST",
      body: formData
  })
      .then(response => response.json())
      .then(data => {
          if (!data || !data.policyNumber) {
              document.getElementById("existingInsuranceData").innerHTML += "<p class='text-danger'>No valid insurance details extracted.</p>";
          } else {
              document.getElementById("existingInsuranceData").innerHTML += `<p><strong>Provider:</strong> ${data.insuranceProvider}</p><p><strong>Policy Number:</strong> ${data.policyNumber}</p>`;
          }
      })
      .catch(error => console.error("Error:", error));
}*/
