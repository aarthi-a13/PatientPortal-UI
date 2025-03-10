import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-alert-modal',
  templateUrl: './alert-modal.component.html',
  styleUrls: ['./alert-modal.component.css']
})
export class AlertModalComponent implements OnInit {
  @Input() alertMessage: string = '';
  @Input() alertType: string = 'warning';
  @Input() showAlert: boolean = false;
  constructor() { }

  ngOnInit(): void {
  }

}
