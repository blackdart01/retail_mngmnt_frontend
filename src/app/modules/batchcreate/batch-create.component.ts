import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { ProductPickerDialog } from '../productpickerinaddbatch/product-picker.dialog';
import { SupplierPickerDialog } from '../productpickerinaddbatch/supplier-picker.dialog';
import { ProductBatchService } from '../../services/product-batch.service';

@Component({
    selector: 'app-batch-create',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatDialogModule,
        MatDatepickerModule,
        MatNativeDateModule
    ],
    templateUrl: './batch-create.component.html',
    styleUrls: ['./batch-create.component.css']
})
export class BatchCreateComponent {
    batch = {
        productId: 0,
        product: null as any,
        costPrice: 0,
        sellingPrice: 0,
        backstoreQuantity: 0,
        rackQuantity: 0,
        location: 'BACKSTORE',
        expiryDate: '',
        purchaseDate: '',
        supplierId: null as number | null,
        supplier: null as any
    };

    constructor(private http: HttpClient, private dialog: MatDialog, private batchService: ProductBatchService) { }

    private getAuthHeaders() {
        return {
            headers: new HttpHeaders({
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            })
        };
    }

    openProductPicker() {
        const dialogRef = this.dialog.open(ProductPickerDialog, { width: '90%', maxWidth: '500px' });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.batch.productId = result.id;
                this.batch.product = result;
            }
        });
    }

    openSupplierPicker() {
        const dialogRef = this.dialog.open(SupplierPickerDialog, { width: '90%', maxWidth: '500px' });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.batch.supplierId = result.id;
                this.batch.supplier = result;
            }
        });
    }

    submitBatch() {
        if (!this.batch.productId) {
            alert('Please select a product');
            return;
        }

        const payload = {
            productId: this.batch.productId,
            costPrice: this.batch.costPrice,
            sellingPrice: this.batch.sellingPrice,
            backstoreQuantity: this.batch.backstoreQuantity,
            rackQuantity: this.batch.rackQuantity,
            location: this.batch.location,
            expiryDate: this.batch.expiryDate ? new Date(this.batch.expiryDate).toISOString().split('T')[0] : null,
            purchaseDate: this.batch.purchaseDate ? new Date(this.batch.purchaseDate).toISOString() : new Date().toISOString(),
            supplierId: this.batch.supplierId
        };

        this.batchService.createBatch(payload)
            .subscribe({
                next: () => {
                    alert('Batch created successfully!');
                    this.resetForm();
                },
                error: err => console.error('Failed to create batch', err)
            });
    }

    resetForm() {
        this.batch = {
            productId: 0,
            product: null,
            costPrice: 0,
            sellingPrice: 0,
            backstoreQuantity: 0,
            rackQuantity: 0,
            location: 'BACKSTORE',
            expiryDate: '',
            purchaseDate: '',
            supplierId: null,
            supplier: null
        };
    }
}
