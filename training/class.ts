class Fraction {
    private _numerator: number
    private _denominator: number

    constructor(numerator: number, denominator: number) {
        this._numerator = numerator
        this._denominator = denominator
    }

    get numerator() {
        return this._numerator
    }

    get denominator() {
        return this._denominator
    }
}

const f1 = new Fraction(1, 2)
console.log(f1.numerator)
console.log(f1.denominator)

// f1.numerator = 3
console.log(f1.numerator)