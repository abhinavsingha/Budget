import { Injectable } from '@angular/core';

@Injectable()
export class SharedService {
  public sharedValue: string|undefined; // Property to hold the shared value

  constructor() { }
}
