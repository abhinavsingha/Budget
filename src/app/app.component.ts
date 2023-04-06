import { Component } from '@angular/core';
import { LoginComponent } from './login/login.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'BMS';
  isShow=false;
  showHideNav(event:any){
    this.isShow= !(event instanceof LoginComponent);
  }
  
}
