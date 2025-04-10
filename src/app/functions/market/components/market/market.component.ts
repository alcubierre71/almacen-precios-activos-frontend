import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MarketService } from '../../../shared/services/market.service';
import { MarketElement } from './market-element';
import { ToolbarComponent } from '../../../shared/components/toolbar/toolbar.component';

@Component({
  selector: 'app-market',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatToolbarModule,
    MatCardModule,
    ToolbarComponent
  ],
  templateUrl: './market.component.html',
  styleUrls: ['./market.component.css']
})
export class MarketComponent implements OnInit {
  displayedColumns: string[] = ['id', 'code', 'description', 'sector', 'country', 'actions'];
  dataSource = new MatTableDataSource<MarketElement>();
  markets: MarketElement[] = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private marketService: MarketService, private router: Router) {}

  ngOnInit(): void {
    this.loadMarkets();
  }

  loadMarkets(): void {
    this.marketService.getAllMarkets().subscribe({
      next: (data) => {
        this.markets = data;
        this.dataSource = new MatTableDataSource(this.markets);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error: (err) => console.error('Error loading markets', err)
    });
  }

  onEdit(id: number): void {
    this.router.navigate(['/markets/edit', id]);
  }

  onDelete(id: number): void {
    this.marketService.deleteMarket(id).subscribe({
      next: () => this.loadMarkets(),
      error: (err) => console.error('Delete failed', err)
    });
  }
}
