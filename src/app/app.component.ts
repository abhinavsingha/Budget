import { Component, OnInit } from '@angular/core';
import { LoginComponent } from './login/login.component';
import {KeycloakService} from "keycloak-angular";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(private keycloakService: KeycloakService) {}
  async ngOnInit() {
    $.getScript('assets/js/adminlte.js');
    if (await this.keycloakService.isLoggedIn()) {
      const userProfile = await this.keycloakService.loadUserProfile();
      debugger;
      // Get Access Token
      const token = await this.keycloakService.getToken();
      localStorage.setItem('accessToken', token)
      // console.log('Access Token:', token);

      // Get Refresh Token
      const refreshToken = this.keycloakService.getKeycloakInstance().refreshToken;
      if(refreshToken!=undefined){
        localStorage.setItem('refreshToken', refreshToken)
      }
      // console.log('Refresh Token:', refreshToken);
    }
  }
  title = 'BMS';
  isShow = false;
  showHideNav(event: any) {
    this.isShow = !(event instanceof LoginComponent);
  }
}
