import { Injectable } from '@angular/core';

import { LoghandlingProvider } from '../loghandling/loghandling';

/*
  Generated class for the ConstantProvider provider.

  ConstantProvider contains all constant variable.
*/
@Injectable()
export class ConstantProvider {

  private TAG:string = "ConstantProvider";

  /** Alert title */
  public static ALERT_TITLE_ERROR: string = "Error";
  public static ALERT_TITLE_ALERT: string = "Alert";
  public static ALERT_TITLE_CONFIRM: string = "Confirm";
  public static ALERT_TITLE_WARNING: string = "Warning";
  public static ALERT_TITLE_SUCCESS: string = "Success";

  /** base url constant */
  public static BASE_URL: string = "https://us-central1-surfer-2c9ac.cloudfunctions.net/";

  constructor(private loghandlingProvider: LoghandlingProvider) {
     this.loghandlingProvider.showLog(this.TAG,'Hello ConstantProvider Provider');
  }

}
