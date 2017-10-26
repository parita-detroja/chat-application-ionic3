import { Component } from '@angular/core';
import { IonicPage, LoadingController } from 'ionic-angular';
import { ContactslistProvider } from '../../providers/contactslist/contactslist';
import { LocalstorageProvider } from '../../providers/localstorage/localstorage';

/**
 * Generated class for the TabContactsPage page.
 *
 * Display list of contacts.
 */

@IonicPage()
@Component({
  selector: 'page-tab-contacts',
  templateUrl: 'tab-contacts.html',
})
export class TabContactsPage {
  contactList: Array<any>;
  email: string;

  constructor(private loadingController: LoadingController, private contactslistProvider: ContactslistProvider,
  private localstorageProvider: LocalstorageProvider) {
    this.email = this.localstorageProvider.getEmail()
  }

  ionViewDidLoad() {
    let loading = this.loadingController.create();
    loading.present();
    this.contactslistProvider.getContactsList().subscribe((contacts) => {
      this.contactList = contacts;
      loading.dismiss();
    })
  }

  log(status: string){
    console.log("status : " + status);
  }

}
