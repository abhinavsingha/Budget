import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'searchUserPipe',
})
export class SearchUserPipePipe implements PipeTransform {
  transform(items: any[], searchText: string): any[] {
    if (!items) {
      return [];
    }
    if (!searchText) {
      return items;
    }
    debugger;
    return items.filter((it) => {
      debugger;
      return (
        it.name.toLowerCase().includes(searchText.toLowerCase()) ||
        it.unit.toLowerCase().includes(searchText.toLowerCase()) ||
        it.pno.includes(searchText)
      );
    });
  }
}
