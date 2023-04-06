import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {ApiCallingServiceService} from "../services/api-calling/api-calling-service.service";
import {ConstantsService} from "../services/constants/constants.service";
import {DatePipe} from "@angular/common";
class InboxList{
  serial:number|undefined;
  type:string|undefined;
  createDate:string|undefined|null;
  createBy:string|undefined;
  unitName:string|undefined;
  route:string|undefined;
}
@Component({
  selector: 'app-inbox',
  templateUrl: './inbox.component.html',
  styleUrls: ['./inbox.component.scss'],
})
export class InboxComponent implements OnInit {
  inboxList: InboxList[]=[];

  constructor(private datePipe: DatePipe,
              private httpService: ApiCallingServiceService,private router: Router,private cons: ConstantsService) {}
  public userRole: any;
  ngOnInit(): void {
    this.userRole = localStorage.getItem('user_role');
    if (this.userRole == 'sys_Admin') {
      this.router.navigateByUrl('/dashboard');
    }
    this.httpService.getApi(this.cons.api.inboxlist).subscribe(
      (res) => {
        let result: { [key: string]: any } = res;
        console.log(result['response']);
        let list:any=result['response'];
        if(list!=null){
          for(let i=0;i<list.length;i++){
            const entry:InboxList= {
              serial: i + 1,
              type: list[i].isBgOrCg,
              createDate: this.datePipe.transform(new Date(list[i].createdOn), 'dd-MM-yyyy'),
              createBy: list[i].userData.fullName,
              unitName: list[i].toUnit.descr,
              route: (list[i].isBgOrCg=='CG')?'/contingent-bill-aprover':'/budget-approval'
            }
            this.inboxList.push(entry);
          }
          console.log(this.inboxList);
        }

      },
      (error) => {
        console.log(error);
      }
    );
  }
  redirect(li:InboxList) {

    if (li.type == "CB") {
      this.router.navigate(['/contingent-bill-aprover'])
      // window.location.href =;
    } else if (li.type == "BG") {
      this.router.navigate(['/budget-approval'])
      // window.location.href = '/budget-approval';
    }
  }


}
