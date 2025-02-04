import { Injectable } from '@angular/core';
import { KeycloakService, KeycloakOptions } from 'keycloak-angular';
import {from, Observable, switchMap} from "rxjs";
import {catchError, map} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private keycloakService: KeycloakService) {}

  init() {
    return this.keycloakService.init({
    config: {
            url: 'http://localhost:8080/auth',
            // url: 'https://icg.net.in/auth/',
            // realm: 'icgrms', // PRODUCTION
              realm: 'uat',
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
  // getToken(): Observable<string | null> {
  //   return from(this.keycloakService.isLoggedIn()).pipe(
  //     switchMap((loggedIn) => {
  //       if (!loggedIn) {
  //         console.log('User not logged in');
  //         return from([null]);
  //       }
  //
  //       return from(this.keycloakService.getToken()).pipe(
  //         switchMap((token) => {
  //           const keycloakInstance = this.keycloakService.getKeycloakInstance();
  //
  //           if (keycloakInstance.isTokenExpired(30)) {
  //             console.log('Token expired, attempting refresh...');
  //             return from(keycloakInstance.updateToken(30)).pipe(
  //               map(() => keycloakInstance.token) // Return refreshed token
  //             );
  //           }
  //
  //           return from([token]); // Return existing token
  //         }),
  //         catchError((error) => {
  //           console.error('Error getting token:', error);
  //           return from([null]);
  //         })
  //       );
  //     })
  //   );
  // }

}
