import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ProductPickerDialogComponent } from '../productpicker/product-picker-dialog.component';
import { BatchPickerDialogComponent } from '../batchpicker/batch-picker-dialog.component';
import { InvoiceDialogComponent } from '../invoicedialog/invoice-dialog.component';
import { ProductBatchService } from '../../services/product-batch.service';

@Component({
    selector: 'app-sale-entry',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        MatTableModule,
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        MatIconModule,
        MatDialogModule
    ],
    templateUrl: './sale-entry.component.html'
})
export class SaleEntryComponent implements OnInit {
    username = localStorage.getItem('username') || '';
    items = [{
        productName: '',
        availableBatches: [],
        sku:'',
        productId: 0,
        originalProductId: 0,
        batchNumber: 0,
        quantity: 0,
        price: 0,
        totalPrice: 0
    }];
    displayedColumns = ['productName', 'sku', 'availableBatches', 'quantity', 'price', 'totalPrice', 'actions'];

    constructor(private http: HttpClient, private dialog: MatDialog, private batchService : ProductBatchService) { }

    ngOnInit(): void {
        const data = localStorage.getItem('saleItems');
        try {
            const parsed = data ? JSON.parse(data) : [];
            console.log("items:: ", JSON.stringify(parsed));
            
            if (Array.isArray(parsed) && parsed.length > 0) {
                this.items = parsed.map(item => ({
                    productName: item?.productName ?? '',
                    sku: item?.sku ?? '',
                    availableBatches: item?.availableBatches ?? [],
                    productId: item?.productId ?? 0,
                    originalProductId: item?.originalProductId ?? 0,
                    batchNumber: item?.batchNumber ?? '',
                    quantity: item?.quantity ?? 0,
                    price: item?.price ?? 0,
                    totalPrice: item?.quantity * item?.price || 0
                }));
            }
        } catch (e) {
            console.error('Invalid saleItems in localStorage:', e);
            this.resetItems();
        }
    }

    private resetItems() {
        this.items = [{
            productName: '',
            sku: '',
            availableBatches: [],
            productId: 0,
            originalProductId: 0,
            batchNumber: 0,
            quantity: 0,
            price: 0,
            totalPrice: 0
        }];
        this.saveItemsToStorage();
    }

    private saveItemsToStorage() {
        localStorage.setItem('saleItems', JSON.stringify(this.items));
    }

    addItem() {
        this.items = [...this.items, {
            productName: '',
            sku: '',
            availableBatches: [],
            productId: 0,
            originalProductId: 0,
            batchNumber: 0,
            quantity: 0,
            price: 0,
            totalPrice: 0
        }];
        this.saveItemsToStorage();
    }

    removeItem(index: number) {
        this.items.splice(index, 1);
        this.items = [...this.items];
        this.saveItemsToStorage();
    }

    onItemChange() {
        this.items.forEach(item => {
            item.totalPrice = item.quantity * item.price;
        });
        console.log("items after change", this.items);
        
        this.saveItemsToStorage();
    }
    openProductPicker(index: number) {
        const dialogRef = this.dialog.open(ProductPickerDialogComponent, { width: '800px' });

        dialogRef.afterClosed().subscribe(selectedProduct => {
            if (selectedProduct) {
                // Set product details
                this.items[index].productName = selectedProduct.name;
                this.items[index].originalProductId = selectedProduct.id;
                this.items[index].sku = selectedProduct.sku || '';
                // Store batches so Batch Picker can display them
                this.items[index].availableBatches = selectedProduct.batches || [];

                this.openBatchPicker(index);
            }
        });
    }

    openBatchPicker(index: number) {
        const productId = this.items[index].originalProductId;

        if (!productId || productId <= 0) {
            alert('No product selected');
            return;
        }

        this.batchService.getProductById(productId).subscribe({
            next: (product) => {
                if (!product.batches || product.batches.length === 0) {
                    alert('No batches available for this product');
                    return;
                }

                const dialogRef = this.dialog.open(BatchPickerDialogComponent, {
                    width: '600px',
                    data: { batches: product.batches }
                });

                dialogRef.afterClosed().subscribe(selectedBatch => {
                    if (selectedBatch) {
                        this.items[index].productId = selectedBatch.productId; // store batchId
                        this.items[index].batchNumber = selectedBatch.id;
                        if (selectedBatch.sellingPrice) {
                            this.items[index].price = selectedBatch.sellingPrice;
                        }
                        this.saveItemsToStorage();
                    }
                });
            },
            error: (err) => {
                console.error('Error fetching product batches', err);
                alert('Failed to fetch batches for this product');
            }
        });
      }
    submitSale() {
        let cleanedItems = this.items.filter(
            item => item.productId > 0 && item.quantity > 0 && item.price > 0
        );
        if (cleanedItems.length === 0) {
            alert('Please add at least one valid item.');
            return;
        }
        cleanedItems.forEach(item => {
            item.productId = item.batchNumber; // Use batchNumber as productId for sale
        });

        const payload = {
            user: { username: this.username },
            items: cleanedItems
        };
        this.batchService.createSales(payload).subscribe({
            next: (res) => {
                console.log('Sale created:', res);
                localStorage.setItem('saleItems', '[]');
                this.dialog.open(InvoiceDialogComponent, {
                    width: '700px',
                    data: {
                        invoiceNumber: res.invoiceNumber,
                        date: new Date(),
                        username: this.username,
                        items: cleanedItems,
                        totalPrice: cleanedItems.reduce((sum, i) => sum + (i.quantity * i.price), 0)
                    }
                }).afterClosed().subscribe(action => {
                    if (action === 'new-sale') {
                        this.items = [{
                            productName: '',
                            availableBatches: [],
                            sku: '',
                            productId: 0,
                            originalProductId: 0,
                            batchNumber: 0,
                            quantity: 0,
                            price: 0,
                            totalPrice: 0
                        }];
                        this.username = '';
                        localStorage.setItem('saleItems', '[]');
                    }
                });
            },
            error: (err) => console.error(err)
          });
    }
}
