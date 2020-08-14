import { Component, OnInit, ViewChild } from '@angular/core';
import { Expenditure } from '../expenditure';
import { ExpenditureService } from '../expenditure.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UpdateDialogComponent } from '../update-dialog/update-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { MatTable } from '@angular/material/table';
import { Router } from '@angular/router';
import { CloseScrollStrategy } from '@angular/cdk/overlay';


@Component({
  selector: 'app-expenditure',
  templateUrl: './expenditure.component.html',
  styleUrls: ['./expenditure.component.css'],
  providers: [ExpenditureService]
})

export class ExpenditureComponent implements OnInit {
  error: any;
  headers: string[];
  public dataSource = new MatTableDataSource<Expenditure>();
  displayedColumns: string[] = ['id', 'date', 'particulars', 'vrNumber', 'amountAdjustment', 'amountAnt', 'update', 'delete'];

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatTable) table: MatTable<any>;


  constructor(private expenditureService: ExpenditureService,
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
    this.expenditureService.getExpenditure()
      .subscribe(res => {
        this.dataSource.data = res as Expenditure[];
      })
    if (!this.dataSource) {
      this.noDataFound();
    }
  }

  public doFilter = (value: string) => {
    this.dataSource.filter = value.trim().toLocaleLowerCase();
  }

  public redirectToUpdate = (id: number) => {

    this.expenditureService.getExpenditureById(id).subscribe(res => {
      const dialogRef = this.dialog.open(UpdateDialogComponent, {
        width: '300px',
        data: res as Expenditure
      });
      console.log(res);
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.updateById(result as Expenditure);
        }
      });
    });
  }

  public redirectToCreate = () => {

    const res: Expenditure = { id: 0, date: new Date("2020-04-02"), particulars: "", vrNumber: 0, amountAdjustment: 0, amountAnt: 0 };
    const dialogRef = this.dialog.open(UpdateDialogComponent, {
      width: '300px',
      data: res as Expenditure
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.createNewRecord(result as Expenditure);
      }
    });
  }

  public createNewRecord(expenditureData: Expenditure) {
    this.expenditureService.createNewRecord(expenditureData).subscribe(res => console.log(res));
    this._snackBar.open('Created. Table will be refreshed after 5 second', 'OK', {
      duration: 1300,
      horizontalPosition: 'right',
      verticalPosition: 'top',
    });
    this.refresh();
  }

  public deleteById(id: number) {
    this.expenditureService.deleteExpenditureById(id).subscribe(res => console.log(res));
    this.refresh();
  }

  public updateById(expenditureData: Expenditure) {
    this.expenditureService.updateExpenditureById(expenditureData).subscribe(res => console.log(res));
    this._snackBar.open('Updated. Table will be refreshed after 5 second', 'OK', {
      duration: 1300,
      horizontalPosition: 'right',
      verticalPosition: 'top',
    });
    this.refresh();
  }

  public refresh() {
    setTimeout(() => {
      console.log('sleep');
      this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        this.router.navigate(['/expenditure']);
      });
    }, 5000);

  }

  noDataFound() {
    this._snackBar.open('Cannot get data from server', 'OK', {
      duration: 1300,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: ['red-snackbar'],
    });
  }


}

