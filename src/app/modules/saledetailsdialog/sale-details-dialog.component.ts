import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';

@Component({
    selector: 'app-sale-details-dialog',
    standalone: true,
    imports: [CommonModule, MatDialogModule, MatTableModule],
    templateUrl: './sale-details-dialog.component.html',
})
export class SaleDetailsDialogComponent {
    itemColumns: string[] = ['product', 'category', 'price', 'quantity', 'subtotal'];

    constructor(@Inject(MAT_DIALOG_DATA) public sale: any) { }
}
