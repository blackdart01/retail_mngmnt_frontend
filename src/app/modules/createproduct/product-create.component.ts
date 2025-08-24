import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { CategoryPickerDialogComponent } from '../categorypickerdialog/category-picker-dialog.component';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ProductBatchService } from '../../services/product-batch.service';
import { MatSelectModule } from '@angular/material/select';

enum WeightUnit {
    kg = 'KG',
    gm = 'GM',
    lt = 'LT',
    ml = 'ML',
    other = 'OTHER'
}


@Component({
    selector: 'app-product-create',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatDialogModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatCardModule,
        MatSelectModule
    ],
    templateUrl: './product-create.component.html',
    styleUrls: ['./product-create.component.css']
})

export class ProductCreateComponent {
    productForm: FormGroup;
    selectedCategory: any = null;
    weightUnits = Object.values(WeightUnit);
    constructor(
        private fb: FormBuilder,
        private http: HttpClient,
        private dialog: MatDialog,
        private router: Router,
        private batchService: ProductBatchService
    ) {
        this.productForm = this.fb.group({
            name: ['', Validators.required],
            // sku: ['', Validators.required],
            weight: ['', Validators.required],
            weightUnits: ['', Validators.required],
            description: [''],
            lowStockThreshold: [0, Validators.required]
        });
        // let sku = "";
        // this.productForm.get('sku')?.setValue(sku);
    }

    openCategoryPicker() {
        const dialogRef = this.dialog.open(CategoryPickerDialogComponent, {
            width: '500px'
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.selectedCategory = result;
            }
        });
    }

    onSubmit() {
        if (this.productForm.valid && this.selectedCategory) {
            const token = localStorage.getItem('token');

            const payload = {
                ...this.productForm.value,
                categoryId: this.selectedCategory.id
            };

            const headers = new HttpHeaders({
                Authorization: `Bearer ${token}`
            });

            this.batchService.createProduct(payload)
                .subscribe({
                    next: (res) => {
                        console.log('Product created:', res);
                        alert('Product created successfully!');
                        this.productForm.reset();
                        this.selectedCategory = null;
                        this.router.navigate(['/inventory']);
                    },
                    error: (err) => {
                        console.error('Error creating product:', err);
                        alert('Failed to create product.');
                    }
                });
        }
    }
}
