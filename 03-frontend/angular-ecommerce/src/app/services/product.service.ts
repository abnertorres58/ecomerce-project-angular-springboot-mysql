import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Product} from "../common/product";
import {map} from 'rxjs/operators'

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private  baseUrl = 'http://localhost:8080/api/products';

  constructor(private httpClient: HttpClient) { }

  // Returns an observable
  // Maps the JSON data from Spring Data REST to product array
  getProductList(theCategoryId: number): Observable<Product[]> {

    //@TODO: need to build URL based on category id ... will come back to this!

    return this.httpClient.get<GetResponse>(this.baseUrl).pipe(
      map(response => response._embedded.products)
    );

  }
}

interface GetResponse {
  _embedded: {
    products: Product[];
  }
}
