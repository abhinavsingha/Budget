import { Pipe, PipeTransform } from '@angular/core';



@Pipe({
  name: 'filter',
})
export class FilterPipe implements PipeTransform {
  transform(value: any[], searchText: string): any[] {
    if (!value || !searchText) {
      return value;
    }

    const filterValue = searchText.toLowerCase();
    return value.filter(
      (item: any) =>
        item.isType.toLowerCase().includes(filterValue) ||
        item.createDate.toLowerCase().includes(filterValue) ||
        item.unit_sub.toLowerCase().includes(filterValue));
  }
}
