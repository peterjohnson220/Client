import { AfterViewInit, Component, Input } from '@angular/core';

@Component({
  selector: 'pf-peer-data-cut-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss']
})
export class FilterComponent implements AfterViewInit {
  @Input() filter: any;

  public source: Array<{ text: string, value: number }> = [
    { text: 'Small', value: 1 },
    { text: 'Medium', value: 2 },
    { text: 'Large', value: 3 }
  ];

  public data: Array<{ text: string, value: number }>;

 constructor() {
    this.data = this.source.slice(0);
  }

  ngAfterViewInit(): void {
    // const contains = value => s => s.text.toLowerCase().indexOf(value.toLowerCase()) !== -1;
    // this.list.filterChange.asObservable().pipe(
    //   switchMap(value => from([this.source]).pipe(
    //     tap(() => this.list.loading = true),
    //     delay(1000),
    //     map((data) => data.filter(contains(value)))
    //   ))
    // ).subscribe(x => {
    //   this.data = x;
    //   this.list.loading = false;
    // });
  }
}
