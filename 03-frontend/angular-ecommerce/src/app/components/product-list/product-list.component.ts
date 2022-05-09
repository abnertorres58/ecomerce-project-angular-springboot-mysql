import { Component, OnInit } from '@angular/core';
import { ProductService } from "../../services/product.service";
import { Product } from "../../common/product";

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  // @ts-ignore
  products: Product[];

  constructor(private productService: ProductService) { }

  ngOnInit(): void {

    this.listProducts();
  }

  listProducts() {

    // Method is invoked once you "subscribe"
    this.productService.getProductList().subscribe(
      data => {
        this.products = data; // Assign results to the Product array
      }
    )
  }

}
