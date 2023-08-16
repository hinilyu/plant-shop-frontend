import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Product } from "../models/product.model";

const STORE_BASE_URL = "https://fakestoreapi.com";

@Injectable({
  providedIn: "root",
})
export class StoreService {
  constructor(private httpClient: HttpClient) {}

  // fetch all products from Fake Store API
  getAllProducts(
    limit = "12",
    sort = "Descending",
    category?: string
  ): Observable<Array<Product>> {
    if (sort === "Ascending") {
      sort = "asc";
    } else if (sort === "Descending") {
      sort = "desc";
    }
    return this.httpClient.get<Array<Product>>(
      `${STORE_BASE_URL}/products${
        category ? "/category/" + category : ""
      }?sort=${sort}&limit=${limit}`
    );
  }

  // fetch all categories as string array
  getAllCategories(): Observable<Array<string>> {
    return this.httpClient.get<Array<string>>(`
    ${STORE_BASE_URL}/products/categories`);
  }
}
