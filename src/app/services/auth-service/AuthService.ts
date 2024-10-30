import { Injectable } from '@angular/core';
import { KeycloakService, KeycloakOptions } from 'keycloak-angular';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private keycloakService: KeycloakService) {}

  init() {
    return this.keycloakService.init({
    config: {
            // url: 'http://localhost:8080/auth',
            url: 'https://icg.net.in/auth/',
            realm: 'icgrms', // PRODUCTION
              // realm: 'uat',
            // clientId: 'cgbudget', // For Production
              clientId: 'budget', // For UAT Server
          },
      initOptions: {
        onLoad: 'login-required',
        checkLoginIframe: false
      }
    });
  }
  async logout(redirectUri: string) {
    try {
      await this.keycloakService.logout(redirectUri);
    } catch (error) {
      console.error('Error during logout:', error);
    }
  }
}
