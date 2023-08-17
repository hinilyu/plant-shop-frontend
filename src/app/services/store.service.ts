import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Product } from "../models/product.model";

const STORE_BASE_URL = "http://localhost:8080/api/v1";

@Injectable({
  providedIn: "root",
})
export class StoreService {
  constructor(private httpClient: HttpClient) {}

  // fetch all products from API
  getAllProducts(
    limit = "12",
    sort = "Title",
    category?: string
  ): Observable<Array<Product>> {
    if (sort === "Title") {
      sort = "title";
    } else if (sort === "Price") {
      sort = "price";
    }
    return this.httpClient.get<Array<Product>>(
      `${STORE_BASE_URL}/products?category=${category}&sort=${sort}&limit=${limit}`
      // `${STORE_BASE_URL}/products/static`
    );
  }

  // fetch all categories as string array
  getAllCategories(): Observable<Array<string>> {
    return this.httpClient.get<Array<string>>(`
    ${STORE_BASE_URL}/products/categories`);
  }
}
