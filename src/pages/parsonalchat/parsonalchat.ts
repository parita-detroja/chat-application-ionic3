import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { IonicPage, NavParams, Platform, TextInput, Content, LoadingController } from 'ionic-angular';
import { Keyboard } from '@ionic-native/keyboard';

import { ChathandlingProvider } from '../../providers/chathandling/chathandling';
import { UserModel } from '../../providers/authentication/authentication';
import { ApihandlingProvider } from '../../providers/apihandling/apihandling';
import { LoghandlingProvider } from '../../providers/loghandling/loghandling';
import { ConstantProvider } from '../../providers/constant/constant';
import { MessageimagehandlerProvider } from '../../providers/messageimagehandler/messageimagehandler';
import { OnlineHandlingProvider } from '../../providers/online-handling/online-handling';
import { AlerthandlingProvider } from '../../providers/alerthandling/alerthandling';

/**
 * Generated class for the ParsonalchatPage page.
 *
 * Page display list of messages for personal channel.
 */

@IonicPage()
@Component({
  selector: 'page-parsonalchat',
  templateUrl: 'parsonalchat.html',
})
export class ParsonalchatPage implements OnInit, OnDestroy {

  private TAG: string = 'ParsonalchatPage';
  chatText: string = '';
  chatMessages: Array<string>;
  textMaxLength: number = 400;
  user: UserModel;
  channelId: string;
  loading: any;

  showEmojiPicker = false;
  @ViewChild('chat_input') messageInput: TextInput;
  @ViewChild(Content) content: Content;

  private autoScroller: MutationObserver;
  
  /**
   * Default constructor.
   * @param navParams used to retrive user.
   * @param platform used for keyboard and scrolling related issue.
   * @param keyboard keyboard related handling
   * @param chatProvider chat handling
   * @param apihandlingProvider provides api methods.
   * @param loghandlingProvider log handling provider.
   * @param loadingController loading controller.
   * @param messageimagehandlerProvider handle image uploading on firebase.
   */
  constructor( 
    private navParams: NavParams,
    private platform: Platform,
    private keyboard: Keyboard,
    private chatProvider: ChathandlingProvider,
    private apihandlingProvider: ApihandlingProvider,
    private loghandlingProvider: LoghandlingProvider,
    private loadingController:LoadingController,
    private messageimagehandlerProvider: MessageimagehandlerProvider,
    private onlineHandlingProvider: OnlineHandlingProvider,
    private alerthandlingProvider: AlerthandlingProvider) {
    this.user = this.navParams.get('user');
    this.channelId = this.navParams.get('channelId');

    this.loadData();

    /*this.loading = this.loadingController.create({
      content: 'Please wait'
    });

    this.loghandlingProvider.showLog(this.TAG, "calling api");
    this.loading.present();
    this.apihandlingProvider.callRequest(ConstantProvider.BASE_URL + "getUserToChat").subscribe(res => {
      if(this.user.uid > res.uid)
      {
        this.channelId = this.user.uid + "-" + res.uid;
      }else {
        this.channelId = res.uid + "-" + this.user.uid ;
      }
      this.loghandlingProvider.showLog(this.TAG,'Channel ID : ' + this.channelId);
      this.loadData();
    },err => {
      this.loghandlingProvider.showLog(this.TAG, err.message);
      this.loading.dismiss();
    });*/

  }

  /**
   * Load data for personal chennal.
   */
  loadData(){
    this.loghandlingProvider.showLog(this.TAG, this.channelId);

    this.chatProvider.getPersonalMessages(this.channelId)
      .subscribe(messages => {
        if(messages.length > 0)
        {
          this.chatMessages = messages;
          this.loghandlingProvider.showLog(this.TAG,"message subscribed");
        }
      });

    if (this.platform.is('cordova')) {
      this.keyboard.onKeyboardShow()
        .subscribe(() => this.scrollDown());
    }
  }

  /**
   * Auto scroll page on init.
   */
  ngOnInit() {
    this.autoScroller = this.autoScroll();
  }

  /**
   * Disconnect scroller on destroy.
   */
  ngOnDestroy() {
    this.autoScroller.disconnect();
    ConstantProvider.setAlreadySubscribed(false);
  }

  /**
   * Call send message method of chat provider on send button.
   * @param event specific event from button.
   */
  sendMessage(event: any) {
    if (!this.chatText)
      return;

    this.chatProvider.sendPersonalMessage((this.user as any).$key, this.chatText, this.channelId)
      .then(() => {
          this.chatText = '';
          this.scrollDown();
      }, (error) => {
          this.loghandlingProvider.showLog(this.TAG, error.toString());
      });
  }

  /**
   * Compare received timestump with current one.
   * @param timestamp timestump to check
   */
  isToday(timestamp: number) {
    return new Date(timestamp).setHours(0,0,0,0) == new Date().setHours(0,0,0,0);
  }

  /**
   * Scroll down using scroller.
   */
  private scrollDown() {
      this.scroller.scrollTop = this.scroller.scrollHeight;
  }

  /**
   * Return auto scroller.
   */
  private autoScroll(): MutationObserver {
      const autoScroller = new MutationObserver(this.scrollDown.bind(this));

      autoScroller.observe(this.messageContent, {
        childList: true,
        subtree: true
      });

      return autoScroller;
  }

  /**
   * Get message content.
   */
  private get messageContent(): Element {
      return document.querySelector('.messages');
  }

  /**
   * Scroll message content. 
   */
  private get scroller(): Element {
      return this.messageContent.querySelector('.scroll-content');
  }

  /**
   * Method called on emoji button for appering emoji keyboard.
   */
  switchEmojiPicker() {
      this.showEmojiPicker = !this.showEmojiPicker;
      if (!this.showEmojiPicker) {
          this.messageInput.setFocus();
      }
      this.content.resize();
      this.scrollToBottom();
  }

  /**
   * Scroll to bottom while emoji keyboard appered.
   */
  scrollToBottom() {
      setTimeout(() => {
          if (this.content.scrollToBottom) {
              this.content.scrollToBottom();
          }
      }, 400)
  }

  /**
   * Update flag for emoji picker and scroll to bottom.
   */
  onFocus() {
        this.showEmojiPicker = false;
        this.content.resize();
        this.scrollToBottom();
  }

  /**
   * Send image as message from camera button.
   */
  sendPicMsg() {
    this.loading.present();
    this.messageimagehandlerProvider.imageMassegeUpload().then((imgurl) => {
      this.loading.dismiss();
      this.chatProvider.sendPersonalMessage((this.user as any).$key, imgurl.toString() , this.channelId)
      .then(() => {
        this.chatText = '';
        this.scrollDown();
      }, (error) => {
          this.loghandlingProvider.showLog(this.TAG, error.toString());
      })
    }).catch((err) => {
      alert(err);
      this.loading.dismiss();
    })
  }

  /**
   * Generates specific delete chat confirmation dialog.
   * @param e event specify direction of swipe.
   */
  swipeEvent(e) {
    if (e.direction == 4 || e.direction == 2) {
      this.alerthandlingProvider.confirmAlert("Confirm delete","Are you sure you want to delete the chat?").then((res) => {
        this.onlineHandlingProvider.deleteChat(this.user.uid,this.channelId);
      }, err => {
        this.loghandlingProvider.showLog(this.TAG, "user cancelled.");
      })
    }
  }
}
