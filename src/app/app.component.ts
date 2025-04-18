import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ApiService } from './services/api.service';
import { NgStyle } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [NgStyle],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  host: {
    class: 'app-container',
  },
})
export class AppComponent implements OnInit {
  private apiService = inject(ApiService);

  protected data$ = signal<Map<string, any>>({} as Map<string, any>);

  protected activeStamp$ = signal<any>(null);

  ngOnInit(): void {
    this.apiService.getData().subscribe((data) => {
      this.data$.set(data as Map<string, any>);
    });
  }

  calculateWidth(value: number, type: string): number {
    const refValue =
      type === 'ask'
        ? this.activeStamp$()?.maxAsk
        : this.activeStamp$()?.maxBid;

    const width = (value / refValue) * 100;

    return width;
  }

  protected onStampClick(stamp: string) {
    this.activeStamp$.set(this.data$().get(stamp));
  }

  onNextClick() {}

  onPrevClick() {}
}
