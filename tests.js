import {DIContainer} from "./index.js";

const di = DIContainer.getInstance()


class Wheel {
    constructor(value =  10) {
        this.radix = value
    }
}

class Car {
    constructor(engine = Engine, number = 4) {
        this.engine = engine
        this.number = number
    }

    /**
     * @param {number} power
     * @param {Wheel} wheel
     */
    async asyncCalculatePower(wheel = Wheel, power) {
        return power * wheel.radix
    }

    /**
     * @param {number} power
     * @param {Wheel} wheel
     */
    calculatePower(wheel = Wheel, power= 15) {
        return power * wheel.radix
    }
}

class Engine {}

di.registrationSingleTon(Engine)
di.registration(Wheel, 15)
di.registration(Car, 1)
di.registration({name: 'Car', class: Car}, 1)

const car = di.getDeps(Car)

const CALCULATE_POWER = 225

car.asyncCalculatePower(15).then(item => console.assert(item === CALCULATE_POWER));
console.assert(car.calculatePower() ===  CALCULATE_POWER);

console.assert(typeof di.getDeps(Car).engine === 'object')
console.assert(typeof car.asyncCalculatePower(15) === 'object')

console.assert(di.getDeps(Engine) === di.getDeps(Engine))
console.assert(car !== di.getDeps(Car))
console.assert(car !== di.getDeps(Engine))
console.assert(car instanceof Car)
