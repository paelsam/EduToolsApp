import { importProvidersFrom, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HttpClientXsrfModule } from '@angular/common/http';



@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule
  ],
  providers: [
    importProvidersFrom(HttpClientModule),
    importProvidersFrom(
      HttpClientXsrfModule.withOptions({
        cookieName: 'csrftoken',
        headerName: 'Set-Cookie',
      })
    )
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
