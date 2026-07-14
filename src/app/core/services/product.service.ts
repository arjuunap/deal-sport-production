import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../environment/environment';

@Injectable({
  providedIn: 'root',
})

export class ProductService {
  private apiUrl = environment.apiUrl + '/products';
  constructor(private http: HttpClient) { }

  getProducts() {
    return this.http.get<any[]>(this.apiUrl + '/fetch-all-products');
  }
  getProductsById(id: string) {
    return this.http.get<any[]>(this.apiUrl + '/fetch-product-by-id' + id);
  }

  addProduct(body:any) {
    return this.http.post<any[]>(this.apiUrl + '/add-product',body);
  }

  updateProduct(body:any) {
    return this.http.put<any[]>(this.apiUrl + '/update-product',body);
  }

  deleteProduct(id: number) {
    return this.http.delete<any>(this.apiUrl + '/delete-product/' + id);
  }


}
