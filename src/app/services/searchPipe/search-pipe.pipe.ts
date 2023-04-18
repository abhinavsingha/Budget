import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'searchPipe',
})
export class SearchPipePipe implements PipeTransform {
  //transform(value: unknown, ...args: unknown[]): unknown {
  transform(items: any[], searchText: string): any[] {
    if (!items) {
      return [];
    }
    if (!searchText) {
      return items;
    }

    // console.log(items.filter(it => {
    //   return it.name.toLowerCase().includes(searchText.toLowerCase())
    //     || it.unitDescr.toLowerCase().includes(searchText.toLowerCase())
    //     || it.rankDescr.toLowerCase().includes(searchText.toLowerCase())
    //     || it.pno.includes(searchText)
    //     || it.email.includes(searchText)
    //     || it.mobileNo.includes(searchText)
    // }));

    return items.filter((it) => {
      debugger;
      return (
        it.unit.toLowerCase().includes(searchText.toLowerCase()) ||
        it.role.toLowerCase().includes(searchText.toLowerCase()) ||
        it.name.toLowerCase().includes(searchText.toLowerCase()) ||
        it.finYear.finYear.includes(searchText.toLowerCase()) ||
        it.pno.includes(searchText)
      );
    });
  }
}
