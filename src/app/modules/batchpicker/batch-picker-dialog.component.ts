import { Component, Inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-batch-picker-dialog',
  standalone: true,
  imports: [
    CommonModule,
    DatePipe,
    MatDialogModule,
    MatTableModule,
    MatButtonModule
  ],
  template: `
    <h2 mat-dialog-title>Select a Batch</h2>
    <mat-dialog-content>
      <table mat-table [dataSource]="data.batches" class="mat-elevation-z8">
        <ng-container matColumnDef="batchNumber">
          <th mat-header-cell *matHeaderCellDef>Batch</th>
          <td mat-cell *matCellDef="let batch">{{ batch.id }}</td>
        </ng-container>

        <ng-container matColumnDef="stock">
          <th mat-header-cell *matHeaderCellDef>Stock</th>
          <td mat-cell *matCellDef="let batch">{{ batch.quantity }}</td>
        </ng-container>
        <ng-container matColumnDef="price">
          <th mat-header-cell *matHeaderCellDef>Price</th>
          <td mat-cell *matCellDef="let batch">{{ batch.sellingPrice }}</td>
        </ng-container>

        <ng-container matColumnDef="purchaseDate">
          <th mat-header-cell *matHeaderCellDef>Purchase Date</th>
          <td mat-cell *matCellDef="let batch">{{ batch.purchaseDate | date:'dd MMM yy' }}</td>
        </ng-container>

        <ng-container matColumnDef="expiry">
          <th mat-header-cell *matHeaderCellDef>Expiry</th>
          <td mat-cell *matCellDef="let batch">{{ batch.expiryDate | date:'dd MMM yy' }}</td>
        </ng-container>

        <ng-container matColumnDef="actions">
          <th mat-header-cell *matHeaderCellDef></th>
          <td mat-cell *matCellDef="let batch">
            <button mat-button color="primary" (click)="selectBatch(batch)">Select</button>
          </td>
        </ng-container>

        <tr mat-header-row *matHeaderRowDef="['batchNumber','stock','purchaseDate', 'price', 'expiry','actions']"></tr>
        <tr mat-row *matRowDef="let row; columns: ['batchNumber','stock','purchaseDate', 'price', 'expiry','actions']"></tr>
      </table>
    </mat-dialog-content>
  `
})
export class BatchPickerDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { batches: any[] },
    private dialogRef: MatDialogRef<BatchPickerDialogComponent>
  ) { console.log("batches", data.batches);
  }

  selectBatch(batch: any) {
    console.log("batch", batch);
    
    this.dialogRef.close(batch);
  }
}
