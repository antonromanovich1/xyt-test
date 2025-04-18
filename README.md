Exercise
In trading environments, markets are driven by order books that display various ask (sell) and bid (buy) levels.

Asks: Represent prices at which sellers are willing to sell an asset.
Bids: Represent prices at which buyers are willing to purchase the asset.

Visualizing this data helps in understanding market depth and liquidity, which can be crucial for traders making quick decisions.

Build an interactive data visualization tool in Angular that displays trading information provided in a JSON file - https://big-xyt.com/assets/files/sample.json. The provided data is essentially an order book snapshot at different moments. Each snapshot includes one timestamp and 10 levels of ask and bid prices.

Features:
View Snapshot: display the order book for a selected moment
Time Navigation: provide controls to navigate between available timestamps
Replay mode: implement a “replay” mode that animates the progression through all snapshots. The entire dataset should be replayed over a fixed period (e.g. 30 seconds) with the relative time intervals (proportions) between snapshots preserved.

As an example, you can use this market simulator: https://oxford-man.ox.ac.uk/projects/market-simulator/. Feel free to visualise it differently, if you will find it to be clearer to the user. Use your preferred visualisation library. 

Please provide a link to the repository with the code.