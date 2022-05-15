# Simple DI

Based on reflection and Proxy


Rules:
* For use must use default value _engine = Engine_
* For correct work use inject class first argument

Example
```js

class Wheel {
    constructor(value) {
        this.radix = value
    }
}

class Engine {
    constructor() {
        this.power = 1
    }
}

class Car {
    constructor(engine = Engine, number = 4) {
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
    calculateSpeed(wheel = Wheel, power) {
        return power * wheel.radix
    }
}
di.registration(Wheel, 15)
di.registrate(Car, 1) // or use more params di.registration({name: 'Car', class: Car}, 1)

const car = di.getDeps(Car) // Car { engine: Engine, number: 4 }
car.calculateSpeed(15) // wheel inject from DI, result = 225
car instanceof Car //  true
```
