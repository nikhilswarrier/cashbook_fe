import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Income } from '../income';
import { IncomeService } from '../income.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UpdateDialogComponent } from '../update-dialog/update-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { MatTable } from '@angular/material/table';
import { Router } from '@angular/router';
import { CloseScrollStrategy } from '@angular/cdk/overlay';
import { from } from 'rxjs';


@Component({
  selector: 'app-income',
  templateUrl: './income.component.html',
  styleUrls: ['./income.component.css'],
  providers: [IncomeService]
})

export class IncomeComponent implements OnInit {
  error: any;
  headers: string[];
  public dataSource = new MatTableDataSource<Income>();
  displayedColumns: string[] = ['id', 'date', 'particulars', 'vrNumber', 'amount', 'update', 'delete'];
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatTable) table: MatTable<any>;
  constructor(private incomeService: IncomeService,
    private _snackBar: MatSnackBar,
    public dialog: MatDialog,
    public router: Router) { }

  ngOnInit() {
    this.getAll();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  public getAll() {
    this.incomeService.getIncome()
      .subscribe(res => {
        this.dataSource.data = res as Income[];
      })
    if (!this.dataSource) {
      this.noDataFound();
    }
  }

  public doFilter = (value: string) => {
    this.dataSource.filter = value.trim().toLocaleLowerCase();
  }

  public redirectToUpdate = (id: number) => {

    this.incomeService.getIncomeById(id).subscribe(res => {
      const dialogRef = this.dialog.open(UpdateDialogComponent, {
        width: '300px',
        data: res as Income
      });
      console.log(res);
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.updateById(result as Income);
        }
      });
    });
  }

  public redirectToCreate = () => {

    const res: Income = { id: 0, date: new Date("2020-04-02"), particulars: "", vrNumber: 0, amount: 0, totalAmount: 0, cumulativeBalance: 0, openingBalance: 0 };
    const dialogRef = this.dialog.open(UpdateDialogComponent, {
      width: '300px',
      data: res as Income
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.createNewRecord(result as Income);
      }
    });
  }

  public createNewRecord(incomeData: Income) {
    this.incomeService.createNewRecord(incomeData).subscribe(res => console.log(res));
    this._snackBar.open('Created. Table will be refreshed after 5 second', 'OK', {
      duration: 1300,
      horizontalPosition: 'right',
      verticalPosition: 'top',
    });
    this.refresh(5);
  }

  public deleteById(id: number) {
    this.incomeService.deleteIncomeById(id).subscribe(res => console.log(res));
    this.refresh(5);
  }

  public updateById(incomeData: Income) {
    this.incomeService.updateIncomeById(incomeData).subscribe(res => console.log(res));
    this._snackBar.open('Updated. Table will be refreshed after 5 second', 'OK', {
      duration: 1300,
      horizontalPosition: 'right',
      verticalPosition: 'top',
    });
    this.refresh(5);
  }

  public refresh(timeLapse: number) {
    setTimeout(() => {
      console.log('sleep');
      this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        this.router.navigate(['/income']);
      });
    }, timeLapse * 1000);
  }

  noDataFound() {
    this._snackBar.open('Cannot get data from server', 'OK', {
      duration: 1300,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: ['red-snackbar'],
    });
  }

  public findTotal() {
    return this.dataSource.data.map(t => t.amount).reduce((acc, value) => acc + value, 0);
  }


  public cumulative() {
    return this.dataSource.data[0].cumulativeBalance;
  }
  getPdfReportURL() {
    window.open(this.incomeService.baseUrl + 'pdfreport', '_blank', 'toolbar=0');
  }

}

