import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Chart } from 'chart.js/auto';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ProductBatchService } from '../../services/product-batch.service';
@Component({
    selector: 'app-sales-report',
    standalone: true,
    imports: [CommonModule, FormsModule, MatCardModule, MatDatepickerModule, MatNativeDateModule, MatFormFieldModule, MatInputModule, MatButtonModule],
    templateUrl: './sales-report.component.html',
    styleUrls: ['./sales-report.component.css']
})
export class SalesReportComponent implements OnInit {
    report: any;
    startDate: string = '';
    endDate: string = '';
    activeDistribution: string = 'profit'; // default chart

    constructor(private http: HttpClient, private batchService:ProductBatchService) { }

    ngOnInit(): void {
        const today = new Date();
        this.startDate = today.toISOString().split('T')[0];
        this.endDate = today.toISOString().split('T')[0];
        this.fetchReport();
    }

    fetchReport() {
        const token = localStorage.getItem('token');
        const start = new Date(this.startDate).toISOString().split('T')[0];
        const end = new Date(this.endDate).toISOString().split('T')[0];
        this.batchService.getSalesReport(start, end).subscribe({
            next: (res) => {
                this.report = res;
                this.renderCharts();
                this.renderACharts();
            },
            error: (err) => console.error('Error fetching report:', err)
        });
    }

    setDistribution(type: string) {
        this.activeDistribution = type;
        this.renderDistributionChart();
    }

    renderCharts() {
        // Destroy previous charts
        Chart.getChart("salesChart")?.destroy();
        this.renderDistributionChart();
    }

    renderACharts() {
        Chart.getChart("lowerChart")?.destroy();
        this.renderLowerDistributionCharts();
    }
    renderLowerDistributionCharts() {
        Chart.getChart("salesExpenditureChart")?.destroy();
        Chart.getChart("profitPieChart")?.destroy();
        if (!this.report) return;
        console.log('Rendering charts with report:', this.report);
        
        const labels = Object.keys(this.report.salesPerProduct);

        // Sales vs Expenditure Bar Chart
        new Chart('salesExpenditureChart', {
            type: 'bar',
            data: {
                labels,
                datasets: [
                    {
                        label: 'Sales',
                        data: Object.values(this.report.salesPerProduct),
                        backgroundColor: '#4caf50'
                    },
                    {
                        label: 'Expenditure',
                        data: Object.values(this.report.expenditurePerProduct),
                        backgroundColor: '#f44336'
                    }
                ]
            },
            options: { responsive: true, maintainAspectRatio: false }
        });

        // Profit Pie Chart
        new Chart('profitPieChart', {
            type: 'pie',
            data: {
                labels,
                datasets: [{
                    label: 'Profit',
                    data: Object.values(this.report.profitPerProduct),
                    backgroundColor: ['#2196f3', '#ff9800', '#9c27b0', '#009688', '#795548']
                }]
            },
            options: { responsive: true, maintainAspectRatio: false }
        });
    }
    renderDistributionChart() {
        Chart.getChart("distributionChart")?.destroy();
        if (!this.report) return;

        let labels: string[] = [];
        let data: number[] = [];
        let title = '';

        switch (this.activeDistribution) {
            case 'profit':
                labels = Object.keys(this.report.profitPerProduct);
                data = Object.values(this.report.profitPerProduct);
                title = 'Profit Distribution';
                break;

            case 'itemsSold':
                labels = Object.keys(this.report.inferredSalesCountPerProduct);
                data = Object.values(this.report.inferredSalesCountPerProduct);
                title = 'Items Sold Distribution';
                break;

            case 'maxProfitItems':
                labels = Object.keys(this.report.profitPerProduct);
                data = Object.keys(this.report.profitPerProduct).map(
                    key => (this.report.profitPerProduct[key] / this.report.inferredSalesCountPerProduct[key]) || 0
                );
                title = 'Max Profitable Item Sold Distribution';
                break;

            // case 'leastProfitItems':
            //     labels = Object.keys(this.report.profitPerProduct);
            //     data = Object.keys(this.report.profitPerProduct).map(
            //         key => (this.report.inferredSalesCountPerProduct[key] - (this.report.profitPerProduct[key] / this.report.inferredSalesCountPerProduct[key] || 0))
            //     );
            //     title = 'Least Profitable Item Sold Distribution';
            //     break;

            case 'category':
                labels = Object.keys(this.report.salesCountPerCategory);
                data = Object.values(this.report.salesCountPerCategory);
                title = 'Category Distribution';
                break;
        }

        new Chart("distributionChart", {
            type: 'pie',
            data: {
                labels,
                datasets: [{
                    label: title,
                    data,
                    backgroundColor: [
                        '#42a5f5', '#66bb6a', '#ffa726', '#ab47bc', '#ef5350'
                    ]
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: title
                    }
                }
            }
        });
    }
    asString(value: unknown): string {
        return String(value);
    }
}

