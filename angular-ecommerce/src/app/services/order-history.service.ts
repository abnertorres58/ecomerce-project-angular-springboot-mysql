import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {OrderHistory} from "../common/order-history";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class OrderHistoryService {

  private orderUrl = environment.fredsshopApiUrl + '/orders';

  constructor(private httpClient: HttpClient) { }

  getOrderHistory(theEmail: string): Observable<GetResponseOrderHistory> {

    // Need to build URL based on the customer email
    const orderHistoryUrl = `${this.orderUrl}/search/findByCustomerEmailOrderByDateCreatedDesc?email=${theEmail}`;

    // Call REST API
    return this.httpClient.get<GetResponseOrderHistory>(orderHistoryUrl);

  }
}

interface GetResponseOrderHistory {
  _embedded: {
    // Unwraps the JSON from Spring Data Rest _embedded entry
    orders: OrderHistory[];
  }
}
