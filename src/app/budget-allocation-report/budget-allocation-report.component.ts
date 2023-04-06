import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
@Component({
  selector: 'app-budget-allocation-report',
  templateUrl: './budget-allocation-report.component.html',
  styleUrls: ['./budget-allocation-report.component.scss']
})
export class BudgetAllocationReportComponent implements OnInit{

  ngOnInit(): void {

    $.getScript('assets/js/adminlte.js');

  }
}
