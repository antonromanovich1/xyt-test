import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private http = inject(HttpClient);

  getData() {
    // CORS restricts requests from localhost for https://big-xyt.com/assets/files/sample.json
    return this.http.get<{ data: any[] }>('./assets/data.json').pipe(
      map(({ data }) =>
        data.reduce((acc, item) => {
          acc.set(item.Time, this.processSnapshotData(item));
          return acc;
        }, new Map())
      ),
      tap((data) => console.log(data))
    );
  }

  private processSnapshotData(bidsObject: any) {
    let maxAsk = 0;
    let maxBid = 0;
    const levels: {
      ask?: number;
      askSize?: number;
      bid?: number;
      bidSize?: number;
    }[] = [];

    for (let i = 1; i <= 10; i++) {
      const level = i.toString();
      const askPriceKey = `Ask${level}`;
      const askSizeKey = `Ask${level}Size`;
      const bidPriceKey = `Bid${level}`;
      const bidSizeKey = `Bid${level}Size`;

      const levelData: {
        ask?: number;
        askSize?: number;
        bid?: number;
        bidSize?: number;
      } = {};

      if (
        bidsObject.hasOwnProperty(askPriceKey) &&
        bidsObject.hasOwnProperty(askSizeKey)
      ) {
        levelData.ask = bidsObject[askPriceKey];
        levelData.askSize = bidsObject[askSizeKey];
        maxAsk = Math.max(maxAsk, levelData.askSize!);
      }

      if (
        bidsObject.hasOwnProperty(bidPriceKey) &&
        bidsObject.hasOwnProperty(bidSizeKey)
      ) {
        levelData.bid = bidsObject[bidPriceKey];
        levelData.bidSize = bidsObject[bidSizeKey];
        maxBid = Math.max(maxBid, levelData.bidSize!);
      }

      levels.push(levelData);
    }

    return { levels, maxAsk, maxBid };
  }
}
