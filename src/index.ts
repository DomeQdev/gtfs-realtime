import { nearestPointOnLine, point, lineString } from "@turf/turf";
import { Options, Result, Stop } from "./typings";

export default ({
    stops,
    shapes,
    location,
    moveStopsToLine,
    predictLocation
}: Options): Result => {
    if (!stops?.length || shapes?.length < 2) throw new Error("Missing required parameters, see documentation.");
    let line = lineString(shapes);

    let vehicleDistance = location ? nearestPointOnLine(line, point(location), { units: 'meters' }).properties.location || 0 : 0;

    let stopList = stops.map(stop => {
        let departure = new Date(stop.departure).getTime();
        let arrival = new Date(stop.arrival || stop.departure)?.getTime();

        let nearest = (() => {
            if (stop.distance) {
                return {
                    distance: stop.distance,
                    location: stop.location
                };
            } else {
                let nearestPoint = nearestPointOnLine(line, point(stop.location), { units: 'meters' });
                return {
                    distance: nearestPoint.properties.location,
                    location: moveStopsToLine && nearestPoint.properties.dist! < 30 ? nearestPoint.geometry.coordinates : stop.location
                };
            }
        })();

        return {
            metersToStop: nearest.distance! - vehicleDistance,
            location: nearest.location,
            departure: new Date(departure),
            arrival: new Date(arrival),
            time: (arrival - new Date(stops[0].departure).getTime()) / 1000 / 60,
            meta: stop.meta
        };
    });

    let lastStop = stopList.filter(stop => stop?.metersToStop < -50).pop() || stopList[0];
    let serving = stopList.find(stop => stop?.metersToStop < 50 && stop?.metersToStop > -50);
    let nextStop = stopList.find(stop => stop?.metersToStop > 50) || stopList[stopList.length - 1];

    let realTime = (nextStop?.time! - (serving?.time || lastStop?.time)) * percentTravelled(serving || lastStop, nextStop!);
    let delay = Math.floor(realTime - minutesUntil(nextStop?.arrival.getTime()));

    return {
        stops: stopList,
        shapes,
        delay,
        lastStop,
        serving,
        nextStop
    };
};

function percentTravelled(stop1: Stop, stop2: Stop) {
    let res = stop1.metersToStop / (stop1.metersToStop - stop2.metersToStop);
    return (res >= 1 || res === -Infinity) ? 0 : (1 - res);
}

function minutesUntil(timestamp: number) {
    return Math.round((timestamp - Date.now()) / 60000);
}