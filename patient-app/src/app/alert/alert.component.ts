import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css']
})
export class AlertComponent {
  @Input() alertMessage: string = '';
  @Input() alertType: string = 'warning';
  @Input() showAlert: boolean = false;

  triggerAlert(message: string, type: string) {
    this.alertMessage = message;
    this.alertType = type;
    this.showAlert = true;

    // Auto close alert after 3 seconds
    setTimeout(() => {
      this.showAlert = false;
    }, 3000);
  }

  closeAlert() {
    this.showAlert = false;
  }
}
