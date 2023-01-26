import { Injectable } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable({
  providedIn: 'root'
})
export class BusyService {
  busyCounter = 0;
  constructor(private ngxSpinner:NgxSpinnerService) { }

  busy(){
    this.busyCounter++;
    this.ngxSpinner.show(undefined,{
      type: 'line-spin-clockwise-fade',
      bdColor: 'rgba(255,255,255,0)',
      color: '#333333'
    });
  }

  idle() {
    this.busyCounter--;
    if(this.busyCounter <= 0) {
      this.busyCounter = 0;
      this.ngxSpinner.hide();
    }
  }
}
