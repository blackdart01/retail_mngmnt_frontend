import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef } from '@angular/material/dialog';
import { ProductBatchService } from '../../services/product-batch.service';

@Component({
    selector: 'app-product-picker-dialog',
    standalone: true,
    imports: [CommonModule, FormsModule, MatFormFieldModule, MatInputModule, MatButtonModule],
    template: `
    <h2>Select Product</h2>
    <mat-form-field class="full-width">
      <mat-label>Search</mat-label>
      <input matInput [(ngModel)]="search" (input)="filter()" placeholder="Search products">
    </mat-form-field>
    <div *ngFor="let p of filtered" class="list-item" (click)="select(p)">
      <strong>{{ p.name }}</strong> <br>
      <small>SKU: {{ p.sku }} | Category: {{ p.category?.name }}</small>
    </div>
    <button mat-stroked-button (click)="close()">Cancel</button>
  `,
    styles: [`.list-item { padding: 8px; cursor: pointer; border-bottom: 1px solid #eee; } .list-item:hover { background:#f5f5f5; }`]
})
export class ProductPickerDialog implements OnInit {
    products: any[] = [];
    filtered: any[] = [];
    search = '';

    constructor(private http: HttpClient, private dialogRef: MatDialogRef<ProductPickerDialog>, private batchService: ProductBatchService) { }

    ngOnInit(): void {
        this.batchService.getProducts().subscribe(res => {
            this.products = res;
            this.filtered = res;
        });
    }

    filter() {
        this.filtered = this.products.filter(p => p.name.toLowerCase().includes(this.search.toLowerCase()));
    }

    select(product: any) {
        this.dialogRef.close(product);
    }

    close() {
        this.dialogRef.close();
    }
}
