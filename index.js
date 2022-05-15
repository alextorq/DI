const getConstructorSignature = (classFunc) => {
    let str = classFunc.toString()
        .replace(/\s|['"]/g, '')
        .replace(/.*(constructor\((?:\w+=\w+?,?)+\)).*/g, '$1')
    const item = str.match(/\((.*)\)/)
    if (item && item.length > 1) {
        str = item[1]
    }
    return str
        .split(',')
        .map(item => item.split('='))
        .filter((item) => !!item[0]);
}
const getMethodsSignature = (classFunc, propKey) => {
    const replace = `/.*(${propKey}\((?:\w+=\w+?,?)+\)).*/g`
    const reg = new RegExp(replace);
    return classFunc
        .toString()
        .replace(/\s|['"]/g, '')
        .split('{')[0]
        .replace(reg, '')
        .replace(/^.+\{/, '')
        .match(/\((.*)\)/)[1]
        .split(',')
        .map(item => item.split('='))
        .filter((item) => !!item[0]);
}

export const nullItem = Symbol('null')

export class DIContainer {
    /**
     * @private
     */
    static instance;

    /**
     * @private
     */
    constructor() {
        this.container = {}
    }
    /**
     * @param {Class} classInstance
     */
    registrationSingleTon(classInstance) {
        const name = classInstance.name
        this.registration(classInstance)
        this.container[name] = this.container[name]()
    }


    /**
     * @param {Array<Array<string, string>>} debs
     * @return {Array<Class>}
     */
    getFrom(debs) {
        return debs.map(deb => {
            const debItem = deb[1]
            if (this.container[debItem]) {
                if (typeof this.container[debItem] === 'function') {
                    return this.container[debItem]()
                }
                return this.container[debItem]
            }
            return nullItem
        }).filter(item => item !== nullItem)
    }

    /**
     * @param {Class|object} item
     */
    registration(item, ...params) {
        if (typeof item !== 'function' && typeof item !== 'object') {
            throw new Error('argument must be class or object')
        }
        const classInstance = typeof item === 'function' ? item : item.class
        const name = item.name
        if (this.container[name]) return
        const self = this

        this.container[name] = () => {
            const constructorDecorator = new Proxy(classInstance, {
                construct(target, params) {
                    const debs = getConstructorSignature(classInstance)
                    let args = self.getFrom(debs)
                    const result = [...args, ...params]
                    return new target(...result);
                }
            });

            const instance = new constructorDecorator(...params)

            return new Proxy(instance, {
                get(target, propKey, receiver) {
                    const origMethod = target[propKey];
                    if (typeof origMethod === 'function') {
                        return function (...params) {
                            const deb = getMethodsSignature(origMethod, propKey)
                            let args = self.getFrom(deb)
                            const result = [...args, ...params]
                            return origMethod.apply(this, result);
                        };
                    }
                    return origMethod
                },
            });
        }
    }

    /**
     * @param {Class|object} item
     * @return {object}
     */
    getDeps(item) {
        const name = typeof item === 'string' ? item : item.name
        const exemplar = this.container[name]
        if (typeof exemplar === 'function') {
            return exemplar()
        }
        return exemplar
    }

    /**
     * @return {DIContainer}
     */
    static getInstance() {
        if (!DIContainer.instance) {
            DIContainer.instance = new DIContainer()
        }
        return DIContainer.instance
    }
}
