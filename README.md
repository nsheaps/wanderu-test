# Wanderu Interview Test

Author: Nathan Heaps

Github: github.com/nsheaps

Email: nsheaps@gmail.com

## How to run
**FIRST** run `npm install`

**THEN**

Run using npm run command - `npm run run`  OR

Run direct from CLI - `node -r dotenv/config index.js`

Tested on Node v12.11.1

## What it does
Finds and outputs the 5 center-most stations in Berlin and 5 center-most in Hamburg. Center-most means closest to the known
latitude/longitude center of the given city.  

From those stations, it finds and outputs 5 station pairs from Hamburg to Berlin and their travel distances with the following criteria: 
* The Hamburg station has to have parking. 
* The Berlin station has to have public transportation available.