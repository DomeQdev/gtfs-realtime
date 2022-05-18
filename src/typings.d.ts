import { Position } from "@turf/helpers"

interface Stop {
    metersToStop: number,
    location: Position,
    departure: Date,
    arrival: Date,
    time: number,
    meta: any
}

interface Options {
    stops: {
        location: Position,
        arrival?: Date,
        departure: Date,
        distance?: number,
        meta?: any
    }[],
    shapes: Position[],
    location?: Position,
    moveStopsToLine?: boolean,
    predictLocation?: boolean
}

interface Result {
    stops: Stop[],
    shapes: Position[],
    delay?: number,
    lastStop?: Stop,
    serving?: Stop,
    nextStop?: Stop
}

export { Options, Result, Stop }