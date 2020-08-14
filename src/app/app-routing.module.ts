import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { IncomeComponent } from './income/income.component'
import { ExpenditureComponent } from './expenditure/expenditure.component'

const routes: Routes = [
  { path: 'income', component: IncomeComponent },
  { path: 'expenditure', component: ExpenditureComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
