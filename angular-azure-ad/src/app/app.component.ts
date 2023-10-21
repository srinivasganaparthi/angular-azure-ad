import { MsalService } from '@azure/msal-angular';
import { Component } from '@angular/core';
import { AuthenticationResult } from '@azure/msal-browser';
import { HttpClient } from '@angular/common/http';
import { PolicyClientService, PolicyModel } from './policy-client.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'My Microsoft Login- Example';

  apiResponse: string | undefined;

  constructor(private authService: MsalService, private http: HttpClient, private policyClientService: PolicyClientService) {

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

  getPolicy() {
    this.http.get<PolicyModel[]>(this.baseURL + "/api/Policy").subscribe(resp => {
      this.apiResponse = JSON.stringify(resp)
    })
  }
}


