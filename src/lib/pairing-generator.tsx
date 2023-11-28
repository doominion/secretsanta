// import CryptoJS from 'crypto-js';

export function generatePairs(names: string[]): Results {
    let message = '';
    let givers: string[] = names.map(n => {
        const [first, ...rest] = n.split('(');
        return first;
    });

    let receivers: Receiver[] = names.map(n => {
        if (n.indexOf('(') > 0 && n.indexOf(')') > 0) {
            const [first, ...rest] = n.split('(');
            const r = rest.join('').trim().replaceAll('(', '').replaceAll(')', '');

            return new Receiver(first, r);
        }
        else {
            return new Receiver(n, '');
        }
    });

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
    constructor(giver: string, receiver: Receiver) {
        this.giver = giver;
        this.receiver = receiver;
    }

    giver: string;
    receiver: Receiver;
};

export class Receiver {
    constructor(name: string, clue: string) {
        this.name = name;
        this.clue = clue;
    }

    name: string;
    clue: string;
}

export async function encrypt(pair: Pair): Promise<string> {
    const str = `${pair.giver}~${pair.receiver.name}~${pair.receiver.clue}`;

    let key = await window.crypto.subtle.generateKey({
        name: "AES-GCM",
        length: 256
    }, true, ["encrypt", "decrypt"]);

    const encryptedPair = await window.crypto.subtle.encrypt({
        name: "AES-GCM",
        iv: new Uint8Array([1, 0, 1])
    }, key, Buffer.from(str));

    const keyBuf = await window.crypto.subtle.exportKey("raw", key);
    const strKey = btoa(String.fromCharCode(...new Uint8Array(keyBuf)));
    const stringifiedPair = btoa(String.fromCharCode(...new Uint8Array(encryptedPair)));

    return `key=${encodeURIComponent(strKey)}&group=${encodeURIComponent(stringifiedPair)}`;
}

export async function decrypt(token: string, key: string): Promise<Pair> {
    let decodedToken = decodeURIComponent(token);
    let decodedKey = decodeURIComponent(key);

    const k2 = atob(decodedKey);
    const t2 = atob(decodedToken);

    const k = await window.crypto.subtle.importKey("raw", getCharCodes(k2), 'AES-GCM', true, [
        'encrypt',
        'decrypt'
    ]);

    const decriptedValues = await window.crypto.subtle.decrypt({
        name: "AES-GCM",
        iv: new Uint8Array([1, 0, 1])
    }, k, getCharCodes(t2));

    const decoded = String.fromCharCode(...new Uint8Array(decriptedValues));
    const values = decoded.split('~');

    return new Pair(values[0], new Receiver(values[1], values[2]));
}

function getCharCodes(data: string): Uint8Array {
    let index = -1;
    let result: number[] = [];
    while (++index < data.length) {
        result.push(data.charCodeAt(index));
    }

    return new Uint8Array(result);
}

// export function encrypt(pair: Pair): string {
//     const str = `${pair.giver}~${pair.receiver.name}~${pair.receiver.clue}`;
//     const secret = btoa(String.fromCharCode(...window.crypto.getRandomValues(new Uint8Array(32))));

//     const text = CryptoJS.AES.encrypt(str, secret).toString();

//     return `?key=${encodeURIComponent(secret)}&pairing=${encodeURIComponent(text)}`;
// }

// export function decrypt(key: string, token: string): Pair {
//     const data = CryptoJS.AES.decrypt(token, key).toString(CryptoJS.enc.Utf8);

//     const arr = data.split('~');

//     return new Pair(arr[0], new Receiver(arr[1], arr[2]));
// }