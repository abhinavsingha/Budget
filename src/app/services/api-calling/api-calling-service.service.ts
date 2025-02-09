import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import {AuthService} from "../auth-service/AuthService";

@Injectable({
  providedIn: 'root',
})
export class ApiCallingServiceService {
  constructor(private http: HttpClient,private authService: AuthService) {}

  async postApi(url: any, jsonPayload: any) {
    const token = await this.authService.getToken();
    return this.http.post(url, jsonPayload).pipe(
      map((results) => results),
      catchError(this.handleError)
    );
  }

  newpostApi(url: any, jsonPayload: any): Observable<Object> {
    const headers = new HttpHeaders().set('authorityUnit', 'demo');
    return this.http.post(url, JSON.stringify(jsonPayload)).pipe(
      map((results) => results),
      catchError(this.handleError)
    );
  }

  async getApi(url: any) {
    const token = await this.authService.getToken();
    return this.http.get(url).pipe(
      map((results) => results),
      catchError(this.handleError)
    );
  }

  // getToeknApi(url: any, token: any) {
  //   // console.log(token + " jsonPayload " + url);
  //   const headers = new HttpHeaders().set('Authorization', `Bearer ` + token);
  //   return this.http.get(url, { headers: headers }).pipe(
  //     map((results) => results),
  //     catchError(this.handleError)
  //   );
  // }

  // getToeknApiForBudget(url: any, token: any) {
  //   // console.log(token + " jsonPayload " + url);
  //   const headers = new HttpHeaders().set('token', token);
  //   return this.http.get(url, { headers: headers }).pipe(
  //     map((results) => results),
  //     catchError(this.handleError)
  //   );
  // }

  private handleError(error: Response | any) {
    let errMsg: string;
    // return throwError(() => error);
    if (error instanceof Response) {
      const err = error || '';
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
      //  errMsg = "No internet connection."
    }
    console.error(error);
    return throwError(() => error);
    // return throwError(
    //   () => {
    //     const error: any = new Error(`This is error number ${errMsg}`);
    //   });
  }
}
