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
    selector: 'app-supplier-picker-dialog',
    standalone: true,
    imports: [CommonModule, FormsModule, MatFormFieldModule, MatInputModule, MatButtonModule],
    template: `
    <h2>Select Supplier</h2>

    <!-- Search -->
    <mat-form-field class="full-width">
      <mat-label>Search</mat-label>
      <input matInput [(ngModel)]="search" (input)="filter()" placeholder="Search suppliers">
    </mat-form-field>

    <!-- Supplier List -->
    <div *ngFor="let s of filtered" class="list-item" (click)="select(s)">
      <strong>{{ s.name }}</strong>
      <div *ngIf="s.contactPerson || s.phone || s.email" class="text-sm text-gray">
        <span *ngIf="s.contactPerson"> {{ s.contactPerson }} </span>
        <span *ngIf="s.phone"> | {{ s.phone }} </span>
        <span *ngIf="s.email"> | {{ s.email }} </span>
      </div>
    </div>

    <hr>

    <!-- Toggle create new supplier -->
    <button mat-stroked-button color="primary" (click)="toggleCreate()">
      {{ showCreate ? 'Cancel' : 'Create New Supplier' }}
    </button>

    <!-- Create Form -->
    <div *ngIf="showCreate" class="create-form">
      <mat-form-field class="full-width">
        <mat-label>Name *</mat-label>
        <input matInput [(ngModel)]="newSupplier.name" name="name" required>
      </mat-form-field>

      <mat-form-field class="full-width">
        <mat-label>Contact Person</mat-label>
        <input matInput [(ngModel)]="newSupplier.contactPerson" name="contactPerson">
      </mat-form-field>

      <mat-form-field class="full-width">
        <mat-label>Phone</mat-label>
        <input matInput [(ngModel)]="newSupplier.phone" name="phone">
      </mat-form-field>

      <mat-form-field class="full-width">
        <mat-label>Email</mat-label>
        <input matInput [(ngModel)]="newSupplier.email" name="email">
      </mat-form-field>

      <button mat-raised-button color="accent" (click)="createSupplier()">Save Supplier</button>
    </div>

    <br>
    <button mat-stroked-button (click)="close()">Close</button>
  `,
    styles: [`
    .list-item {
      padding: 8px;
      cursor: pointer;
      border-bottom: 1px solid #eee;
    }
    .list-item:hover {
      background: #f5f5f5;
    }
    .create-form {
      margin-top: 1rem;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
    .full-width { width: 100%; }
  `]
})
export class SupplierPickerDialog implements OnInit {
    suppliers: any[] = [];
    filtered: any[] = [];
    search = '';
    showCreate = false;

    newSupplier = {
        name: '',
        contactPerson: '',
        phone: '',
        email: ''
    };

    constructor(private http: HttpClient, private dialogRef: MatDialogRef<SupplierPickerDialog>, private batchService : ProductBatchService) { }

    ngOnInit(): void {
        this.loadSuppliers();
    }

    private getAuthHeaders() {
        return {
            headers: new HttpHeaders({
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            })
        };
    }

    loadSuppliers() {
        this.batchService.getSuppliers()
            .subscribe(res => {
                this.suppliers = res;
                this.filtered = res;
            });
    }

    filter() {
        this.filtered = this.suppliers.filter(s => s.name.toLowerCase().includes(this.search.toLowerCase()));
    }

    select(supplier: any) {
        this.dialogRef.close(supplier);
    }

    toggleCreate() {
        this.showCreate = !this.showCreate;
    }

    createSupplier() {
        if (!this.newSupplier.name.trim()) {
            alert('Supplier name is required');
            return;
        }

      this.batchService.createSupplier(this.newSupplier)
            .subscribe({
                next: (res: any) => {
                    alert('Supplier created!');
                    this.newSupplier = { name: '', contactPerson: '', phone: '', email: '' };
                    this.showCreate = false;
                    this.loadSuppliers(); // 🔄 Refresh supplier list
                },
                error: err => {
                    console.error('Failed to create supplier', err);
                    alert('Failed to create supplier');
                }
            });
    }

    close() {
        this.dialogRef.close();
    }
}
