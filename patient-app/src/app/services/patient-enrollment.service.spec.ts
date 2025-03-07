import { TestBed } from '@angular/core/testing';

import { PatientEnrollmentService } from './patient-enrollment.service';

describe('PatientEnrollmentService', () => {
  let service: PatientEnrollmentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PatientEnrollmentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
