import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'searchPipeReciept',
})
export class SearchPipeRecieptPipe implements PipeTransform {
  transform(items: any[], searchText: string): any[] {
    if (!items) {
      return [];
    }
    if (!searchText) {
      return items;
    }
    return items.filter((it) => {
      return (
        it.allocTypeId.allocDesc
          .toLowerCase()
          .includes(searchText.toLowerCase()) ||
        it.finYear.finYear.includes(searchText)
      );
    });
  }
}
