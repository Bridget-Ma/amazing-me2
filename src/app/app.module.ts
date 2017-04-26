import { NgModule }       from '@angular/core';
import { BrowserModule }  from '@angular/platform-browser';
import { FormsModule }    from '@angular/forms';
import { MaterialModule } from '@angular/material';
import { HttpModule } from '@angular/http';
import { AngularFireModule,AuthProviders, AuthMethods } from 'angularfire2';
// import {HTTP_PROVIDERS} from 'angular2/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import { AppComponent }         from './app.component';
import { AppRoutingModule }     from './app-routing.module';

import { HomepageRoutingModule }         from './homepage/homepage-routing.module';
import { LoginRoutingModule }   from './login-routing.module';
import { LoginComponent }       from './login.component';
import { HomepageComponent } from './homepage/homepage.component';

import { DialogService }        from './dialog.service';

import {MdButtonModule, MdCheckboxModule, MdInputModule, MdListModule, MdCardModule, MdDialogModule, MdSidenavModule} from '@angular/material';

import 'hammerjs';


export const myFirebaseConfig = {

  apiKey: "AIzaSyCleNPTW1m0VsF2V_sSuYJQ1pm5E356Ra8",
    authDomain: "amazing-me-ac8b6.firebaseapp.com",
    databaseURL: "https://amazing-me-ac8b6.firebaseio.com",
    storageBucket: "amazing-me-ac8b6.appspot.com",
    messagingSenderId: "582459982323"
 
};

const myFirebaseAuthConfig = {
 
      provider: AuthProviders.Password,
      method: AuthMethods.Password,
    
};


@NgModule({
  imports: [
    AngularFireModule.initializeApp(myFirebaseConfig, myFirebaseAuthConfig),
    BrowserModule,
    FormsModule,
    HttpModule,
    HomepageRoutingModule,
    LoginRoutingModule,
    AppRoutingModule,
    MaterialModule,
    MdButtonModule, MdCheckboxModule, MdInputModule, MdListModule, MdCardModule, MdDialogModule, MdSidenavModule,
    BrowserAnimationsModule
  ],
  declarations: [
    AppComponent,
    LoginComponent,
    HomepageComponent,

  ],
  
  providers: [
    DialogService,
 
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule {


  
}

