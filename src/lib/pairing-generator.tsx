
export function generatePairs(names: string[]): Results {
    let message = '';
    let givers: string[] = Object.create(names);
    let receivers: string[] = Object.create(names);

    let paired: Pair[] = [];

    while (givers.length > 2 || receivers.length > 2) {
        const pick1 = pickRandomNumber(givers.length);
        let pick2 = -1;

        do {
            pick2 = pickRandomNumber(receivers.length);
        } while (pick1 === pick2);

        const removed1 = givers.splice(pick1, 1);
        const removed2 = receivers.splice(pick2, 1);

        paired.push(new Pair(removed1[0], removed2[0]));
    }

    // we add the remaining together to skip all the RNG
    paired.push(new Pair(givers[0], receivers[1]));
    paired.push(new Pair(givers[1], receivers[0]));

    var duplicates = paired.filter((value, idx, self) => {
        idx === self.findIndex(t => {
            value.giver === t.giver || value.receiver == t.receiver;
        });
    });
    if (duplicates.length > 0) {
        message = 'Duplicates found during generation. You might want to retry!';
        console.error(`Duplicates: ${JSON.stringify(duplicates)}`);
    }

    console.log(`Pairs: ${JSON.stringify(paired)}`);

    return new Results(message, paired);
};

function pickRandomNumber(size: number) {
    var pickedNumber = Math.floor(Math.random() * size);
    if (pickedNumber === size) {
        throw "Should not happen";
    }

    return pickedNumber;
};

export class Results {
    constructor(message: string, pairs: Pair[]) {
        this.message = message;
        this.pairs = pairs;
    }
    message: string;
    pairs: Pair[];
};

export class Pair {
    constructor(giver: string, receiver: string) {
        this.giver = giver;
        this.receiver = receiver;
    }

    giver: string;
    receiver: string;
};