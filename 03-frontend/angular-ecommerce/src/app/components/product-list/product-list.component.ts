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

  products: Product[] = [];
  currentCategoryId: number = 1;
  previousCategoryId: number = 1;
  searchMode: boolean = false;

  // New properties for pagination
  thePageNumber: number =1;
  thePageSize: number = 50;
  theTotalElements: number = 0;


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

    //
    // Check if we have a different category than previous
    // Note: Angular will reuse a component if it is currently being viewed
    //

    // If we have a different category id than previous
    // then set thePageNumber back to 1
    if(this.previousCategoryId != this.currentCategoryId) {
      this.thePageNumber = 1;
    }

    this.previousCategoryId = this.currentCategoryId;

    console.log(`currentCategoryId=${this.currentCategoryId}, thePageNumber=${this.thePageNumber}`);


    // Method is invoked once you "subscribe"
    // Now get the products for the given category id
    this.productService.getProductListPaginate( this.thePageNumber -1,
                                                        this.thePageSize,
                                                        this.currentCategoryId)
                                                        .subscribe(this.processResult());
  }

  private processResult() {
    // @ts-ignore
    return data => {
      this.products = data._embedded.products;
      this.thePageNumber = data.page.number + 1;
      this.thePageSize = data.page.size;
      this.theTotalElements = data.page.totalElements;
    };
  }
}
