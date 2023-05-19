import { Injectable } from '@angular/core';

@Injectable()
export class SharedService {
  public sharedValue: string|undefined; // Property to hold the shared value
  public redirectedFrom: string|undefined;
  public inbox:any;
  public outbox:any;
  public roleHeading: any;
  public status:boolean=false;
  public finYear: any;
  public dashboardData:any;
  constructor() { }
}
