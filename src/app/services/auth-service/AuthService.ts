import { Injectable } from '@angular/core';
import { KeycloakService, KeycloakOptions } from 'keycloak-angular';
import {from, Observable, switchMap} from "rxjs";
import {catchError, map} from "rxjs/operators";
import {HttpClient, HttpParams} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private keycloakUrl = 'https://icg.net.in/auth/'; // Change this to your Keycloak base URL
  private realm = 'icgrms';
  private clientId = 'budget';
  private clientSecret = '7bpt0mo2sfBdwbs8TDMYtQbui78RFY1h'; // Required if client authentication is enabled

  constructor(public keycloakService: KeycloakService, private http: HttpClient) {}

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
  getUsername(): string | null {
    const userProfile = this.keycloakService.getKeycloakInstance().idTokenParsed;
    return userProfile ? userProfile['preferred_username'] : null;
  }
  async getToken(): Promise<string | undefined> {
    try {
      if (await this.keycloakService.isLoggedIn()) {
        // Check if token is expired or about to expire in next 30 seconds
        const token = await this.keycloakService.getToken();
        const keycloakInstance = this.keycloakService.getKeycloakInstance();

        if (keycloakInstance.isTokenExpired(30)) {
          console.log('Token expired, attempting refresh...');
          await keycloakInstance.updateToken(30); // Refresh if expired
        }

        return keycloakInstance.token; // Return refreshed token
      } else {
        console.log('User not logged in');
        return undefined;
      }
    } catch (error) {
      console.error('Error getting token:', error);
      return undefined;
    }
  }

  revokeToken(): Observable<any> {
    const keycloakInstance = this.keycloakService.getKeycloakInstance();
    const refreshToken = keycloakInstance.refreshToken; // Get the refresh token

    if (!refreshToken) {
      console.error('No refresh token available.');
      return new Observable((observer) => observer.complete());
    }

    const body = new HttpParams()
      .set('client_id', this.clientId)
      .set('client_secret', this.clientSecret) // Optional if not confidential client
      .set('token', refreshToken);

    const url = `${this.keycloakUrl}/realms/${this.realm}/protocol/openid-connect/revoke`;

    return this.http.post(url, body.toString(), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });
  }

}
