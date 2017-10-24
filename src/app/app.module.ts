import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { Facebook } from '@ionic-native/facebook';
import { HttpModule } from '@angular/http';

import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireModule } from 'angularfire2';
import { config } from './app.firebaseconfig';

import { MyApp } from './app.component';
import { LoginPage } from '../pages/login/login';

import { AuthenticationProvider } from '../providers/authentication/authentication';
import { AlerthandlingProvider } from '../providers/alerthandling/alerthandling';
import { LoghandlingProvider } from '../providers/loghandling/loghandling';
import { ConstantProvider } from '../providers/constant/constant';
import { ApihandlingProvider } from '../providers/apihandling/apihandling';

@NgModule({
  declarations: [
    MyApp,
    LoginPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(config)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    LoginPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AuthenticationProvider,
    AlerthandlingProvider,
    LoghandlingProvider,
    ConstantProvider,
    Facebook,
    ApihandlingProvider,
    AngularFireAuth
  ]
})
export class AppModule {}
