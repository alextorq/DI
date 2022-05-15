import {DIContainer} from "./index.js";

const di = DIContainer.getInstance()


class Wheel {
    constructor() {
        this.radix = 15
    }
}

class Car {
    constructor(number = 4, engine = Engine) {
        this.engine = engine
        this.number = number
    }

    /**
     * @param {number} power
     * @param {Wheel} wheel
     */
    async asyncCalculatePower(power, wheel = Wheel) {
        return power * wheel.radix
    }

    /**
     * @param {number} power
     * @param {Wheel} wheel
     */
    calculatePower(power, wheel = Wheel) {
        return power * wheel.radix
    }
}

class Engine {}

di.registrationSingleTon(Engine)
di.registration(Wheel)
di.registration(Car, 1)

const car = di.getDeps(Car)

car.asyncCalculatePower(15).then(item => console.assert(item === 225));
console.assert(car.calculatePower(15) ===  225);

console.assert(typeof di.getDeps(Car).engine === 'object')
console.assert(typeof car.asyncCalculatePower(15) === 'object')

console.assert(di.getDeps(Engine) === di.getDeps(Engine))
console.assert(car !== di.getDeps(Car))
console.assert(car !== di.getDeps(Engine))
console.assert(car instanceof Car)
