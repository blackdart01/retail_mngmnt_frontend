import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { formatDate } from '@angular/common';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatCardModule } from '@angular/material/card';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { SaleDetailsDialogComponent } from '../saledetailsdialog/sale-details-dialog.component';
import { ProductBatchService } from '../../services/product-batch.service';
// import { SaleDetailsDialogComponent } from './sale-details-dialog.component';

@Component({
    selector: 'app-sales-list',
    standalone: true,
    imports: [
        CommonModule, FormsModule,
        MatTableModule, MatFormFieldModule, MatIconModule,
        MatInputModule, MatButtonModule, MatCheckboxModule,
        MatExpansionModule, MatCardModule, MatDialogModule
    ],
    templateUrl: './sales-list.component.html',
    animations: [
        trigger('expandCollapse', [
            state('collapsed', style({ height: '0px', opacity: 0, overflow: 'hidden' })),
            state('expanded', style({ height: '*', opacity: 1, overflow: 'hidden' })),
            transition('expanded <=> collapsed', animate('250ms ease-in-out'))
        ])
    ]
})
export class SalesListComponent implements OnInit {
    fromDate: string;
    toDate: string;
    sales: any[] = [];
    displayedColumns = ['invoice', 'date', 'total', 'user', 'popup'];
    itemColumns = ['product', 'category', 'price', 'quantity', 'subtotal'];
    listAllSales = true;
    expandedProduct: any | null = null;

    constructor(private http: HttpClient, private dialog: MatDialog, private batchService: ProductBatchService) {
        const today = formatDate(new Date(), 'yyyy-MM-dd', 'en-US');
        this.fromDate = today;
        this.toDate = today;
    }

    isExpanded(product: any) {
        return this.expandedProduct === product ? 'expanded' : 'collapsed';
    }

    toggleExpand(product: any) {
        this.expandedProduct = this.expandedProduct === product ? null : product;
    }

    openSaleDetails(sale: any) {
        this.dialog.open(SaleDetailsDialogComponent, {
            width: '90%',
            maxWidth: '700px',
            data: sale
        });
    }

    ngOnInit() {
        this.fetchSales();
    }

    fetchSales() {
        if (this.listAllSales) {
            this.loadAllSales();
        } else {
            this.batchService.getSalesBetween(this.fromDate, this.toDate).subscribe({
                next: (data: any) => this.sales = data,
                error: (err) => console.error(err)
            });
        }
    }

    onSalesFetchToggle() {
        this.listAllSales = !this.listAllSales;
    }

    loadAllSales() {
        this.batchService.getSales().subscribe((res: any) => {
            this.sales = res;
        });
    }
}
