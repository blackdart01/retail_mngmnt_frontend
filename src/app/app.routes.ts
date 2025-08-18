import { Routes } from '@angular/router';
import { InventoryListComponent } from './modules/inventory/inventory-list.component';
import { SaleEntryComponent } from './modules/recordsales/sale-entry.component';
import { SalesListComponent } from './modules/viewsales/sales-list.component';
import { MainLayoutComponent } from './modules/sidebar/main-layout.component';
import { LoginComponent } from './modules/login/login.component';
import { AuthGuard } from './modules/login/auth.guard';
import { ProductCreateComponent } from './modules/createproduct/product-create.component';
import { BatchCreateComponent } from './modules/batchcreate/batch-create.component';
import { SalesReportComponent } from './modules/salesreport/sales-report.component';
export const routes: Routes = [
    // { path: 'inventory', component: InventoryListComponent },
    // { path: 'record-sale', component: SaleEntryComponent },
    // { path: 'view-sales', component: SalesListComponent },
    // { path: '', redirectTo: 'inventory', pathMatch: 'full' } // default to inventory
    {
        path: '',
        component: MainLayoutComponent,
        canActivate: [AuthGuard],
        children: [
            { path: 'inventory', component: InventoryListComponent },
            { path: 'sale-entry', component: SaleEntryComponent },
            { path: 'sales', component: SalesListComponent },
            { path: 'products', component: InventoryListComponent },
            { path: 'products/create', component: ProductCreateComponent },
            { path: 'products/add-batch', component: BatchCreateComponent },
            // { path: 'products/update', component: ProductUpdateComponent },
            { path: 'sales/analysis', component: SalesReportComponent },
            { path: '', redirectTo: 'inventory', pathMatch: 'full' }
        ]
    },
    { path: 'login', component: LoginComponent },
    { path: '**', redirectTo: 'inventory' }
];
