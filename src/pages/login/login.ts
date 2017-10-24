import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';

import { LoghandlingProvider } from '../../providers/loghandling/loghandling';
import { AuthenticationProvider } from '../../providers/authentication/authentication';
import { ConstantProvider } from '../../providers/constant/constant';
import { ApihandlingProvider } from '../../providers/apihandling/apihandling';
import { usercredentials } from '../../models/interfaces/usercredentials';

/**
 * Generated class for the LoginPage page.
 *
 * Login page provide user authentication using facebook.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  private TAG: string = "LoginPage";
  credentials = {} as usercredentials;

  constructor(private navCtrl: NavController, private navParams: NavParams, private loadingCtrl: LoadingController,
  private authenticationProvider: AuthenticationProvider, private loghandlingProvider: LoghandlingProvider, 
  private apihandlingProvider: ApihandlingProvider) {
  }

  ionViewDidLoad() {
    this.loghandlingProvider.showLog(this.TAG,'ionViewDidLoad LoginPage');
  }

  loginWithFacebook() {
    let loading = this.loadingCtrl.create();
    loading.present();
    this.authenticationProvider.signInWithFacebook()
      .then((res) => {
        this.loghandlingProvider.showLog(this.TAG, "user get auth token" + res.user);
        loading.dismiss();
      }, (error) => {
        this.loghandlingProvider.showLog(this.TAG, "from error block" + error.message);
        loading.dismiss();
      });

    /*this.loghandlingProvider.showLog(this.TAG, "calling api");
    this.apihandlingProvider.callRequest(ConstantProvider.BASE_URL + "getUserToChat").subscribe(res => {
      this.loghandlingProvider.showLog(this.TAG, res.name +" : "+ res.uid);
    },err => {
      this.loghandlingProvider.showLog(this.TAG, err.message);
    });*/
  }

  loginWithGoogle(){
    //google login 
  }

  loginWithGithub(){
    //github login
  }

  signin(){
     this.authenticationProvider.login(this.credentials).then((res: any) => {
      if (!res.code)
        this.navCtrl.setRoot('TabsPage');
      else
        alert(res);
    })
  }

}
