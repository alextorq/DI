# Simple DI

Based on reflection and Proxy


Rules:
* For use must use default value _engine = Engine_
* For correct work use inject class last params

Example
```js

class Wheel {
    constructor() {
        this.radix = 15
    }
}

class Engine {
    constructor() {
        this.power = 1
    }
}

class Car {
    constructor(number = 4, engine = Engine) {
        this.engine = engine
        this.number = number
    }

    calculateOwnSpeed(wheel = Wheel) {
        return this.engine.power * wheel.radix
    }

    /**
     * @param {number} power
     * @param {Wheel} wheel
     */
    calculateSpeed(power, wheel = Wheel) {
        return power * wheel.radix
    }
}
di.registration(Wheel)
di.registrate(Car)

const car = di.getDeps(Car) // Car { engine: Engine, number: 4 }
car.calculateSpeed(15) // wheel inject from DI, result = 225
car instanceof Car //  true
```
