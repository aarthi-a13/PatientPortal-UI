import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AlertComponent } from './alert/alert.component';
import { PatientSelectionComponent } from './patient-selection/patient-selection.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { ErrorInterceptorService } from './interceptors/error.service';
import { ReactiveFormsModule } from '@angular/forms';
import { AlertModalComponent } from './alert-modal/alert-modal.component';

@NgModule({
  declarations: [
    AppComponent,
    AlertComponent,
    PatientSelectionComponent,
    AlertModalComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptorService, multi: true }
  ],
  bootstrap: [AppComponent],
  exports: [AlertComponent, AlertModalComponent]
})
export class AppModule { }
