import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
@Component({
  selector: 'app-budget-approver',
  templateUrl: './budget-approver.component.html',
  styleUrls: ['./budget-approver.component.scss']
})
export class BudgetApproverComponent implements OnInit{

  ngOnInit(): void {

    $.getScript('assets/js/adminlte.js');

  }
  
}
