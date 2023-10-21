import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { DataTablesModule } from 'angular-datatables';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MsalModule, MsalService, MSAL_INSTANCE, MsalInterceptor, MsalRedirectComponent, MsalGuard, MsalInterceptorConfiguration, MSAL_INTERCEPTOR_CONFIG } from '@azure/msal-angular';
import { PublicClientApplication, InteractionType, IPublicClientApplication, BrowserCacheLocation } from '@azure/msal-browser';
import { PolicyClientService } from './policy-client.service';

export function MSALInstanceFactory(): IPublicClientApplication {
  return new PublicClientApplication({
    auth: {
      clientId: 'cf446b20-4466-478c-834a-f8dad1f6e68c',
      authority: 'https://login.microsoftonline.com/7b80656d-d5bd-4304-8473-f5f29e70510f',
      redirectUri: 'http://localhost:4200',
      postLogoutRedirectUri: "http://localhost:4200"
    }, cache: {
      cacheLocation: BrowserCacheLocation.LocalStorage,
      storeAuthStateInCookie: true, // set to true for IE 11
    },
  });
}

export function MSALInterceptorConfigFactory(): MsalInterceptorConfiguration {
  const protectedResourceMap = new Map<string, Array<string>>();
  protectedResourceMap.set('https://localhost:7193', ['api://7916b465-5191-44ad-9c44-f1da5b9a1145/policy-read']);

  return {
    interactionType: InteractionType.Popup,
    protectedResourceMap
  };
}

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    DataTablesModule,
    ReactiveFormsModule,
    MsalModule,
    HttpClientModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: MsalInterceptor,
      multi: true
    },
    {
      provide: MSAL_INSTANCE,
      useFactory: MSALInstanceFactory
    }, {
      provide: MSAL_INTERCEPTOR_CONFIG,
      useFactory: MSALInterceptorConfigFactory
    },
    MsalService,
    PolicyClientService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
