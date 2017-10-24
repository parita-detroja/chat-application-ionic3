import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';

import { Facebook } from '@ionic-native/facebook';
import { AngularFireAuth } from 'angularfire2/auth';

import { LoghandlingProvider } from '../loghandling/loghandling';
import { usercredentials } from '../../models/interfaces/usercredentials';

/*
  Generated class for the AuthenticationProvider provider.

  AuthenticationProvider provides facebook sigin and auth tocken from that.
*/
@Injectable()
export class AuthenticationProvider {

  private TAG: string = 'AuthenticationProvider';

  /**
   * Basic constructor for LogServiceProvider.
   */
  constructor(private loghandlingProvider: LoghandlingProvider, private platform: Platform,
  private facebook: Facebook, private angularFireAuth: AngularFireAuth) {
    this.loghandlingProvider.showLog(this.TAG,'Hello AuthenticationProvider Provider');
  }

  /**
   * sign in with facebook
   */
  signInWithFacebook() {
     this.loghandlingProvider.showLog(this.TAG, "sign in with facebook");
    if (this.platform.is('cordova')) {
      return this.platform.ready().then(() => {
        return this.facebook.login(['email', 'public_profile']).then((res) => {
           this.loghandlingProvider.showLog(this.TAG, "credential " + res.authResponse.accessToken);
          return res.authResponse.accessToken;
        }, (error) => {
           this.loghandlingProvider.showLog(this.TAG, "from error block of auth" + error.message);
          return error.message;
      });
      });
    } else {
       this.loghandlingProvider.showLog(this.TAG, "else block for none cordova.");
    }
  }

  /**
   * Allow user to login with email and password from firebase.
   * @param credentials user login credential having email and password.
   */
  login(credentials: usercredentials) {
    var promise = new Promise((resolve, reject) => {
      this.angularFireAuth.auth.signInWithEmailAndPassword(credentials.email, credentials.password).then(() => {
        resolve(true);
      }).catch((err) => {
        reject(err);
       })
    })

    return promise;
    
  }  

}
