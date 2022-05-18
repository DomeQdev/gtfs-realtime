# Slay 💄
✨ yes

## How to use
```js
const tripInfo = require("slay-gtfs-realtime");

const { stops, shapes, delay?, predictedLocation?, lastStop?, serving?, nextStop? } = tripInfo({
    stops: [
        {
            location: [52.215481561, 21.2114879], // stop location
            arrival?: new Date(), // bus arrival
            departure: new Date(), // bus departure
            distance?: 31584, // you don't have to fill this, if you want know how this works, look at code
            meta?: any // anything, name, zone, your credit card number
        },
        ... // more stops, as many as you want
    ],
    shapes: [ // array of vehicle shape locations
        [52.215481561, 21.2114879],
        [53.215481561, 22.2114879],
        [54.215481561, 23.2114879] 
    ],
    location?: [52.215481561, 21.2114879], // if you want have real time data like delay, live departures, provide current vehicle location
    moveStopsToLine?: true, // default: false, all stops that are in shape radius (30 meters) will be moved to line
    predictLocation?: false // default: false, predict current vehicle location if not available realtime
});
```

i'm too lazy to make result effects, just look at [typings](https://github.com/DomeQdev/gtfs-realtime/blob/main/src/typings.d.ts#L26-L33)