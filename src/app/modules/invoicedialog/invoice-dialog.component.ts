import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';

@Component({
    selector: 'app-invoice-dialog',
    standalone: true,
    imports: [CommonModule, MatButtonModule],
    templateUrl: './invoice-dialog.component.html',
    styleUrls: ['./invoice-dialog.component.css']
})
export class InvoiceDialogComponent {
    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any,
        private dialogRef: MatDialogRef<InvoiceDialogComponent>,
        private router: Router
    ) { }

    recordAnotherSale() {
        this.dialogRef.close('new-sale');
    }

    close() {
        this.dialogRef.close();
        this.router.navigate(['/view-sales']);
    }
}
