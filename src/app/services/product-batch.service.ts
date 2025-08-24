import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ProductBatchService {
    private baseUrl = 'https://retail-mngmnt-backend.onrender.com'
    // private baseUrl = 'http://localhost:8080';
    constructor(private http: HttpClient) { }

    getAll(): Observable<any[]> {
        return this.http.get<any[]>(`${this.baseUrl}/api/products`, {
            headers: new HttpHeaders({
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            })
        });
    }

    getById(id: number): Observable<any> {
        return this.http.get<any>(`${this.baseUrl}/api/products/${id}`, {
            headers: new HttpHeaders({
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            })
        });
    }

    getLowStockProducts(considerRackQuantity: boolean): Observable<any[]> {
        const url = `${this.baseUrl}/api/products/low-stock-products?considerRackQuantityAlso=${considerRackQuantity}`;
        return this.http.get<any[]>(url, {
            headers: new HttpHeaders({
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            })
        });
    }

    createBatch(batch: any): Observable<any> {
        return this.http.post(`${this.baseUrl}/api/productBatch`, batch, this.getAuthHeaders())
    }
    getCategories(): Observable<any> {
        return this.http.get<any[]>(`${this.baseUrl}/api/categories`, this.getAuthHeaders());
    }
    createCategory(category: any): Observable<any> {
        return this.http.post(`${this.baseUrl}/api/categories`, category, this.getAuthHeaders());
    }
    createProduct(product: any): Observable<any> {
        return this.http.post(`${this.baseUrl}/api/products`, product, this.getAuthHeaders());
    }
    login(loginPayload: any): Observable<any> {
        return this.http.post<any>(`${this.baseUrl}/api/auth/login`, loginPayload)
    }
    getProducts(): Observable<any> {
        return this.http.get<any[]>(`${this.baseUrl}/api/products` , this.getAuthHeaders());
    }
    getProductById(id: number): Observable<any> {
        return this.http.get<any>(`${this.baseUrl}/api/products/${id}`, this.getAuthHeaders());
    }  
    getSuppliers(): Observable<any[]> {
        return this.http.get<any[]>(`${this.baseUrl}/api/suppliers`, this.getAuthHeaders());
    } 
    createSupplier(supplier: any): Observable<any> {
        return this.http.post(`${this.baseUrl}/api/suppliers`, supplier, this.getAuthHeaders());
    }
    getSales(): Observable<any[]> {
        return this.http.get<any[]>(`${this.baseUrl}/api/sales`, this.getAuthHeaders());
    }
    createSales(sale: any): Observable<any> {
        return this.http.post(`${this.baseUrl}/api/sales`, sale, this.getAuthHeaders());
    }
    getSalesReport(startDate: string, endDate: string): Observable<any> {
        return this.http.get<any>(`${this.baseUrl}/api/inventory/sales/report/range?startDate=${startDate}&endDate=${endDate}`, this.getAuthHeaders());
    }
    getSalesBetween(startDate: string, endDate: string): Observable<any> {
        return this.http.get<any>(`${this.baseUrl}/api/sales/between?from=${startDate}&to=${endDate}`, this.getAuthHeaders());
    }
    getAuthHeaders() {
        return {
            headers: new HttpHeaders({
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            })
        };
    }
    
}
