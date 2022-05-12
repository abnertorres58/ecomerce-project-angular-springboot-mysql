import { Component, OnInit } from "@angular/core";
import { ProductService } from "../../services/product.service";
import { Product } from "../../common/product";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list-grid.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  // @ts-ignore
  products: Product[];
  // @ts-ignore
  currentCategoryId: number;
  // @ts-ignore
  searchMode: boolean

  constructor(private productService: ProductService,
              private route: ActivatedRoute) { }

  ngOnInit()  {
    this.route.paramMap.subscribe(() => {
      this.listProducts();
    });
  }


  listProducts() {

    this.searchMode = this.route.snapshot.paramMap.has('keyword');

    if(this.searchMode) {
      this.handleSearchProducts();
    } else {
      this.handleListProducts();
    }
  }

  private handleSearchProducts() {

    // @ts-ignore
    const theKeyword: string = this.route.snapshot.paramMap.get('keyword');

    // Now search for products using keyword
    this.productService.searchProducts(theKeyword).subscribe(
      data => {
        this.products = data;
      }
    )

  }

  handleListProducts() {
    // Check if "id" parameter is available
    const hasCategoryId: boolean = this.route.snapshot.paramMap.has('id');

    if(hasCategoryId) {
      // Get the "id" param string. Convert string to a number using the "+" symbol
      // @ts-ignore
      this.currentCategoryId = +this.route.snapshot.paramMap.get('id');
    }
    else {
      // Not category id available ... default category id 1
      this.currentCategoryId = 1;
    }

    // Method is invoked once you "subscribe"
    // Now get the products for the given category id
    this.productService.getProductList(this.currentCategoryId).subscribe(
      data => {
        this.products = data; // Assign results to the Product array
      }
    )
  }


}
