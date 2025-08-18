import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { ProductBatchService } from '../../services/product-batch.service';

@Component({
    selector: 'app-category-picker-dialog',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        MatDialogModule,
        MatFormFieldModule,
        MatInputModule,
        MatIconModule,
        MatListModule,
        MatButtonModule
    ],
    templateUrl: './category-picker-dialog.component.html',
    // styleUrls: ['./category-picker-dialog.component.css']
})
export class CategoryPickerDialogComponent implements OnInit {
    categories: any[] = [];
    filteredCategories: any[] = [];
    newCategoryName: string = '';
    creatingCategory: boolean = false;
    loading: boolean = false;

    constructor(
        private http: HttpClient,
        private dialogRef: MatDialogRef<CategoryPickerDialogComponent>,
        private batchService: ProductBatchService
    ) { }

    ngOnInit() {
        this.fetchCategories();
    }

    private fetchCategories() {
        const token = localStorage.getItem('token');
        const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

        this.batchService.getCategories()
            .subscribe({
                next: (res) => {
                    this.categories = res;
                    this.filteredCategories = res;
                },
                error: (err) => console.error('Failed to load categories:', err)
            });
    }

    filterCategories(event: any) {
        const value = event.target.value.toLowerCase();
        this.filteredCategories = this.categories.filter(cat =>
            cat.name.toLowerCase().includes(value)
        );
    }

    selectCategory(cat: any) {
        this.dialogRef.close(cat);
    }

    toggleCreateCategory() {
        this.creatingCategory = !this.creatingCategory;
        this.newCategoryName = '';
    }

    createCategory() {
        if (!this.newCategoryName.trim()) {
            alert('Please enter category name');
            return;
        }

        this.loading = true;
        const token = localStorage.getItem('token');
        const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

        this.batchService.createCategory({ name: this.newCategoryName })
            .subscribe({
                next: () => {
                    this.loading = false;
                    this.creatingCategory = false;
                    this.newCategoryName = '';
                    this.fetchCategories();
                    alert('Category created successfully!');
                },
                error: (err) => {
                    this.loading = false;
                    console.error('Failed to create category:', err);
                    alert('Failed to create category.');
                }
            });
    }
}
