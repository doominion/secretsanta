"use client"
import { generatePairs } from "@/lib/pairing-generator";

export default function Home() {
  function btnClick() {
    const names: string = (document.getElementById("names") as HTMLTextAreaElement)?.value;

    if (names === '' || names === undefined) {
      return;
    }
    const rows = names.split(/\r?\n/).filter((name) => name !== '' && name !== undefined && name.length > 0);

    if (rows.length <= 1) {
      console.log("not enough rows to pair");
      return;
    }

    const pairs = generatePairs(rows, rows[0].indexOf('-') > 0);
    const results = document.getElementById("results") as HTMLUListElement;

    results.innerHTML = '';
    pairs.pairs.forEach(pair => {
      const result = document.createElement("li");

        result.textContent = `Giver: ${pair.giver} - Receiver: ${JSON.stringify(pair.receiver)}.`;
        results?.appendChild(result);
    });
  }



  return (
    <div className="content">
      <h1>Santa pairs generator</h1>
      <div className="outer-wrapper">
        <div className="content-wrapper">
          <textarea rows={25} cols={60} id="names">

          </textarea>
          <button className="btn-generate" type="submit" onClick={btnClick}>Generate pairs</button>
        </div>
        <div className="results-wrapper">
          <ul id="results" className="results-list">

          </ul>
        </div>
      </div>
    </div>
  )
}
