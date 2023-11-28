"use client"
import { decrypt, encrypt, generatePairs } from "@/lib/pairing-generator";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function Home() {
  const sp = useSearchParams();
  let viewResults: boolean = false;

  if (sp.has('key') && sp.has('group')) {
    viewResults = true;
  }

  useEffect(() => {
    if (sp.has('key') && sp.has('group')) {
      const key = sp.get("key") ?? '';
      const group = sp.get("group") ?? '';

      decrypt(group, key).then(f => {
        const receiver = document.getElementById("receiver") as HTMLHeadElement;
        const giver = document.getElementById("giver") as HTMLSpanElement;

        giver.innerHTML = f.giver;
        receiver.innerHTML = f.receiver.name;

        const clue = document.getElementById("clue") as HTMLHeadElement;
        if (f.receiver.clue ?? '' !== '') {
          clue.innerHTML = `Your clue for this year's gift is: ${f.receiver.clue}`;
        }
        else {
          clue.innerHTML = "Unfortunately this year's partner has not provided any clues. Good luck!";
        }
      })
    }
  }, []);

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

    const pairs = generatePairs(rows);
    const results = document.getElementById("results") as HTMLUListElement;

    results.innerHTML = '';
    pairs.pairs.forEach(pair => {
      const result = document.createElement("li");
      const a = document.createElement("a");
      result.appendChild(a);

      encrypt(pair).then(f => {
        a.href = `${window.location.origin}/?${f}`;
        a.text = `Give this link to: ${pair.giver}`;
        results?.appendChild(result);
      });
    });
  }

  function CurrentPage() {
    if (viewResults) {
      return (
        <div className="outer-wrapper">
          <h1>Congratulations, <span id="giver"></span>!</h1>
          <h2>This year, your lucky pick is: </h2>
          <h3 id="receiver"></h3>
          <h4 id="clue"></h4>
        </div>
      )
    }
    else {
      return (
        <div className="outer-wrapper">
          <h1>Santa pairs generator</h1>
          <div className="content-wrapper">
            <textarea id="names" placeholder="You can add people you would like to generate pairs for by adding them one on each line. If you would like to add some clues for the gift, you can put them in paranthesis">

            </textarea>
            <button className="btn-generate" type="submit" onClick={btnClick}>Generate pairs</button>
          </div>
          <div className="results-wrapper">
            <ul id="results" className="results-list">

            </ul>
          </div>
        </div>
      )
    }
  }

  return (
    <div className="content">
      <CurrentPage></CurrentPage>
    </div>
  )
}
