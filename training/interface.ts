const STONE = 0
const PAPER = 1
const SCISSORS = 2

interface HandGenerator {
    generate(): number
}

class RandomHandGenerator implements HandGenerator {
    generate(): number  {
        return Math.floor(Math.random() * 3)
    }

    generateArray(): number[] {
        return []
    }
}

class StoneHandGenerator implements HandGenerator {
    generate(): number {
        return STONE
    }
}

class Janken {
    play(handGenerator: HandGenerator) {
        const computerHand = handGenerator.generate()

        console.log(`computerHand = ${computerHand}`)

        // 勝敗判定などが続く...
    }
}

const janken = new Janken()

const generator = new RandomHandGenerator()
janken.play(generator)

const generator2 = new StoneHandGenerator()
janken.play(generator2)