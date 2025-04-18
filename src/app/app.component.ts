import { Component, inject, OnInit, signal } from '@angular/core';
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
  stop() {
    clearInterval(this.interval);
  }
  private interval: any;
  play() {
    if (this.interval) clearInterval(this.interval);

    const [currentKey, currentValue] = this.iterator.current() as [string, any];
    this.activeStamp$.set(currentValue);

    this.interval = setInterval(() => {
      const [key, value] = this.iterator.next() as [string, any];
      this.activeStamp$.set(value);
    }, 1000);
  }

  private apiService = inject(ApiService);

  protected data$ = signal<Map<string, any>>({} as Map<string, any>);

  private iterator: any;

  protected activeStamp$ = signal<any>(null);

  ngOnInit(): void {
    this.apiService.getData().subscribe((data) => {
      this.data$.set(data as Map<string, any>);
      this.iterator = this.createMapIterator(data as Map<string, any>);
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

  private createMapIterator<K, V>(map: Map<K, V>, startKey?: K) {
    const keys = Array.from(map.keys());
    if (keys.length === 0) {
      return {
        next: () => undefined,
        prev: () => undefined,
        current: () => undefined,
      };
    }

    // Find starting index
    let currentIndex = startKey !== undefined ? keys.indexOf(startKey) : 0;
    if (currentIndex === -1) currentIndex = 0;

    return {
      // Get current element without moving
      current: (): [K, V] => {
        const key = keys[currentIndex];
        return [key, map.get(key)!];
      },

      // Get next element and move forward
      next: (): [K, V] => {
        currentIndex = (currentIndex + 1) % keys.length;
        const key = keys[currentIndex];
        return [key, map.get(key)!];
      },

      // Get previous element and move backward
      prev: (): [K, V] => {
        currentIndex = (currentIndex - 1 + keys.length) % keys.length;
        const key = keys[currentIndex];
        return [key, map.get(key)!];
      },

      // Jump to a specific key
      jumpTo: (key: K): boolean => {
        const index = keys.indexOf(key);
        if (index === -1) return false;
        currentIndex = index;
        return true;
      },

      // Reset to initial position
      reset: () => {
        currentIndex = startKey !== undefined ? keys.indexOf(startKey) : 0;
        if (currentIndex === -1) currentIndex = 0;
      },
    };
  }
}
