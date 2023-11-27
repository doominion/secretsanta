"use client"
import { generatePairs } from "@/lib/pairing-generator";

export default function Home() {
  function btnClick() {
    const names: string = document.getElementById("names")?.value;

    if (names === '' || names === undefined) {
      return;
    }
    const rows = names.split(/\r?\n/).filter((name) => name !== '' && name !== undefined && name.length > 0);

    if (rows.length <= 1) {
      console.log("not enough rows to pair");
      return;
    }
    const pairs = generatePairs(rows);
    const results = document.getElementById("results");
    
    pairs.pairs.forEach(pair => {
      const result = document.createElement("li");
      result.textContent = `Giver: ${pair.giver} - Receiver: ${pair.receiver}`;
      results?.appendChild(result);
    });
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1>Lidl santa generator</h1>
      <textarea rows={25} cols={100} id="names">

      </textarea>
      <button type="submit" onClick={btnClick}>Generate pairs</button>
      <ul id="results">

      </ul>
    </main>
  )
}
