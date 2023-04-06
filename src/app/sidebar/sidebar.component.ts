import { Component } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent {
  public userRole: any;

  ngOnInit(): void {
    this.userRole = localStorage.getItem('user_role');
    console.log('Role of user == ' + this.userRole);
    // if (!localStorage.getItem('foo')) {
    //   localStorage.setItem('foo', 'no reload');
    //   location.reload();
    // } else {
    //   localStorage.removeItem('foo');
    //   localStorage.setItem('user_role', 'Admin');
    // }
  }

  constructor(private keycloakService: KeycloakService) {}

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('cgwwaUserDetails');
    this.keycloakService.logout();
  }
}
