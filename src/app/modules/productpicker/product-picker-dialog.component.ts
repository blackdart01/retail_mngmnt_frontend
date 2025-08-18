import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { ProductBatchService } from '../../services/product-batch.service';

@Component({
    selector: 'app-product-picker-dialog',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        MatTableModule,
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule
    ],
    template: `
    <h2>Select a Product</h2>

    <mat-form-field style="width: 100%;">
      <mat-label>Search Products</mat-label>
      <input matInput [(ngModel)]="searchTerm" (input)="applyFilter()" placeholder="Enter name or SKU">
    </mat-form-field>

    <table mat-table [dataSource]="filteredProducts" class="mat-elevation-z8">
      <ng-container matColumnDef="name">
        <th mat-header-cell *matHeaderCellDef>Name</th>
        <td mat-cell *matCellDef="let product">{{ product.name }}</td>
      </ng-container>

      <ng-container matColumnDef="sku">
        <th mat-header-cell *matHeaderCellDef>SKU</th>
        <td mat-cell *matCellDef="let product">{{ product.sku }}</td>
      </ng-container>

      <ng-container matColumnDef="price">
        <th mat-header-cell *matHeaderCellDef>Price</th>
        <td mat-cell *matCellDef="let product">{{ product.sellingPrice | currency:'INR':'symbol' }}</td>
      </ng-container>

      <ng-container matColumnDef="actions">
        <th mat-header-cell *matHeaderCellDef></th>
        <td mat-cell *matCellDef="let product">
          <button mat-raised-button color="primary" (click)="selectProduct(product)">
            Select
          </button>
        </td>
      </ng-container>

      <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
      <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>
    </table>
  `
})
export class ProductPickerDialogComponent implements OnInit {
    products: any[] = [];
    filteredProducts: any[] = [];
    displayedColumns = ['name', 'sku', 'price', 'actions'];
    searchTerm = '';

    constructor(
        private http: HttpClient,
        public dialogRef: MatDialogRef<ProductPickerDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private batchService: ProductBatchService
    ) { }

    ngOnInit() {
      this.batchService.getProducts().subscribe({
            next: res => {
                this.products = res;
                this.filteredProducts = res;
            },
            error: err => console.error(err)
        });
    }

    applyFilter() {
        const term = this.searchTerm.trim().toLowerCase();
        this.filteredProducts = this.products.filter(p =>
            p.name.toLowerCase().includes(term) ||
            p.sku.toLowerCase().includes(term)
        );
    }

    // selectProduct(product: any) {
    //     this.dialogRef.close(product);
    // }

    selectProduct(product: any) {
        console.log("product", product);
        
      this.batchService.getProductById(product.id).subscribe(fullProduct => {
            this.dialogRef.close(fullProduct);
        });
    }
}