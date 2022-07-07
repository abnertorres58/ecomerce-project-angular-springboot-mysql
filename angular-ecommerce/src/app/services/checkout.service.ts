import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Purchase} from "../common/purchase";
import {Observable} from "rxjs";
import {environment} from "../../environments/environment";
import {PaymentInfo} from "../common/payment-info";

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {

  private purchaseUrl =  environment.fredsshopApiUrl + '/checkout/purchase';

  private paymentIntentUrl = environment.fredsshopApiUrl + '/checkout/payment-intent';

  constructor(private httpClient: HttpClient) { }

  placeOrder(purchase: Purchase): Observable<any> {
    return this.httpClient.post<Purchase>(this.purchaseUrl, purchase);
  }

  // PaymentInfo is our custom DTO
  createPaymentIntent(paymentInfo: PaymentInfo): Observable<any>{

    // Make REST API call
    return this.httpClient.post<PaymentInfo>(this.paymentIntentUrl, paymentInfo);
  }
}
