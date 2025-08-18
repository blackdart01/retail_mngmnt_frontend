import { Component, OnInit } from '@angular/core';
import { ProductBatchService } from '../../services/product-batch.service'
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';

@Component({
    selector: 'app-inventory-list',
    standalone: true,
    imports: [
        CommonModule,
        MatTableModule,
        MatPaginatorModule,
        MatSortModule,
        MatFormFieldModule,
        MatInputModule,
        MatCardModule,
        MatIconModule,
        MatCheckboxModule,
        FormsModule,
        MatButtonModule,
      ],
    templateUrl: './inventory-list.component.html',
    styleUrls: ['./inventory-list.component.css'],
    animations: [
        trigger('expandCollapse', [
            state('collapsed', style({ height: '0px', opacity: 0, overflow: 'hidden' })),
            state('expanded', style({ height: '*', opacity: 1, overflow: 'hidden' })),
            transition('expanded <=> collapsed', animate('250ms ease-in-out'))
        ])
      ]
})
export class InventoryListComponent implements OnInit {
    displayedColumns: string[] = ['category', 'name', 'sku', 'stockQuantity', 'expand'];
    products: any[] = [];
    expandedProduct: any | null = null;
    filteredProducts: any[] = [];
    considerRackQuantity = true;
    lowStockProductFetched=false;

    constructor(private batchService: ProductBatchService) { }

    ngOnInit() {
        console.log("helloo");
        this.loadAllProducts();
        // this.batchService.getAll().subscribe(data => {
        //     this.products = data;
        //     this.filteredProducts = data;
        //   });
    }
    loadAllProducts() {
        this.lowStockProductFetched = false;
        this.batchService.getAll().subscribe(data => {
            this.products = data;
            this.filteredProducts = data;
        });
      }
    toggleExpand(product: any) {
        this.expandedProduct = this.expandedProduct === product ? null : product;
    }
    
    filterProducts(event: Event) {
        const searchTerm = (event.target as HTMLInputElement).value.toLowerCase().trim();
        this.filteredProducts = this.products.filter(product =>
            product.name.toLowerCase().includes(searchTerm) ||
            product.sku.toLowerCase().includes(searchTerm) ||
            product.category?.name?.toLowerCase().includes(searchTerm)
        );
    }
    isExpanded(product: any) {
        return this.expandedProduct === product ? 'expanded' : 'collapsed';
      }

      fetchLowStock(flag: boolean) {
          this.lowStockProductFetched=true;
          this.batchService.getLowStockProducts(flag).subscribe(data => {
              this.products = data;
              this.filteredProducts = data;
          });
      }
    onRackQuantityToggle() {
        // if (this.considerRackQuantity) {
            this.fetchLowStock(this.considerRackQuantity);
        // } else {
        //     this.loadAllProducts();
        // }
    }
}