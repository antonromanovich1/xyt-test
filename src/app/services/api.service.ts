import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private http = inject(HttpClient);

  getData() {
    return this.http.get<{ data: any[] }>('./assets/data.json').pipe(
      map(({ data }) =>
        data.reduce((acc, item) => {
          acc.set(item.Time, this.processSnapshotData(item));
          return acc;
        }, new Map())
      )
    );
  }

  private processSnapshotData(bidsObject: any) {
    const structuredData: { [key: string]: any } = {};
    let maxAsk = 0;
    let maxBid = 0;

    for (let i = 1; i <= 10; i++) {
      const level = i.toString();
      const askPriceKey = `Ask${level}`;
      const askSizeKey = `Ask${level}Size`;
      const bidPriceKey = `Bid${level}`;
      const bidSizeKey = `Bid${level}Size`;

      structuredData[i] = {};

      if (
        bidsObject.hasOwnProperty(askPriceKey) &&
        bidsObject.hasOwnProperty(askSizeKey)
      ) {
        const ask = bidsObject[askPriceKey];
        const askSize = bidsObject[askSizeKey];
        structuredData[i].ask = ask;
        structuredData[i].askSize = askSize;
        maxAsk = Math.max(maxAsk, askSize);
      }

      if (
        bidsObject.hasOwnProperty(bidPriceKey) &&
        bidsObject.hasOwnProperty(bidSizeKey)
      ) {
        const bid = bidsObject[bidPriceKey];
        const bidSize = bidsObject[bidSizeKey];
        structuredData[i].bid = bid;
        structuredData[i].bidSize = bidSize;
        maxBid = Math.max(maxBid, bidSize);
      }
    }

    return { ...structuredData, maxAsk, maxBid };
  }
}
