import { MsalService } from '@azure/msal-angular';
import { Component } from '@angular/core';
import { AuthenticationResult } from '@azure/msal-browser';
import { HttpClient } from '@angular/common/http';
import { Employee } from './Employee';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'My Microsoft Login- Example';

  apiResponse: string | undefined;

  constructor(private authService: MsalService, private http: HttpClient) {

  }
  ngOnInit(): void {
    this.authService.instance.handleRedirectPromise().then(res => {
      if (res != null && res.account != null) {
        this.authService.instance.setActiveAccount(res.account)
      }
    })
  }

  isLoggedIn(): boolean {
    return this.authService.instance.getActiveAccount() != null
  }

  login() {
    this.authService.loginPopup()
      .subscribe((response: AuthenticationResult) => {
        this.authService.instance.setActiveAccount(response.account);
      });
  }

  logout() {
    this.authService.logout()
  }


  private readonly baseURL = 'https://localhost:7193';

  getEmployees() {
    this.http.get<Employee[]>(this.baseURL + "/api/Employee").subscribe(resp => {
      this.apiResponse = JSON.stringify(resp)
    })
  }
}


