import { useState } from "react";
import Table from 'react-bootstrap/Table';
import L10n from './L10n';
import { ILookupRange } from "./Types";

export class LookupRangesModel {
  value: number
  constructor(ranges: ILookupRange[], quantity: number) {
    const range = ranges.find(r => (r.starting <= quantity) && (quantity <= r.ending))
    this.value = Number(range?.value);
  }
}

export function LookupRangesInitialRange(): ILookupRange {
  return {
    key: crypto.randomUUID(),
    starting: 0,
    ending: 1000000,
    value: "",
  };
}

function LookupRanges({ranges, quantity, setRanges, title, valueLabel}: {ranges: ILookupRange[], quantity: string, setRanges: (ranges: ILookupRange[]) => void, title: string, valueLabel: string}) {
  const [splitRangeAt, setSplitRangeAt] = useState("");
  const [rangePairSelectIndex, setRangePairSelectIndex] = useState(-1);

  const lookupRangesModel = new LookupRangesModel(ranges, Number(quantity));

  function handleValueChange(value: string, index: number) {
    const nextLookupRanges = ranges.map((iw, i) => {
      if (i === index) {
        return {
          key: iw.key,
          starting: iw.starting,
          ending: iw.ending,
          value: value,
        }
      } else {
        return {...iw};
      }
    });
    setRanges(nextLookupRanges);
  }

  function handleSplitRange() {
    const startingNumber = Number(splitRangeAt);
    if (!Number.isInteger(startingNumber)) {
      alert("'Spllit range at' value must be integer");
      return;
    }
    const nextLookupRanges = [];
    for (const range of ranges) {
      if ((startingNumber > range.starting) && (startingNumber < range.ending)) {
        nextLookupRanges.push({
          key: crypto.randomUUID(),
          starting: startingNumber,
          ending: range.ending,
          value: range.value,
        });
        nextLookupRanges.push({
          key: range.key,
          starting: range.starting,
          ending: startingNumber - 1,
          value: range.value,
        });
      } else {
        nextLookupRanges.push(range);
      }
    }
    setRanges(nextLookupRanges);
  }

  function handleMergeRanges(isKeepUpper: boolean) {
    if (rangePairSelectIndex === -1) {
      return;  // No range selected
    }
    const nextLookupRanges: ILookupRange[] = [];
    ranges.forEach((range, i) => {
      if (rangePairSelectIndex === i) {
        nextLookupRanges.push({
          key: range.key,
          starting: ranges[i+1].starting,
          ending: range.ending,
          value: isKeepUpper ? range.value : ranges[i+1].value,
        });
      } else if (rangePairSelectIndex+1 === i) {
        // Don't pass lower range pair on to next round
      } else {
        nextLookupRanges.push(range);
      }
    });
    setRanges(nextLookupRanges);
    setRangePairSelectIndex(Math.min(rangePairSelectIndex, nextLookupRanges.length-2));
  }

  const rangePairSelectOptions = []
  for (let i = 0; i < ranges.length - 1; i++) {
    const hi = ranges[i];
    const lo = ranges[i+1];
    rangePairSelectOptions.push(
      <option value={i} key={i}>
         ({hi.starting}-{hi.ending}) &amp; ({lo.starting}-{lo.ending}) &rarr; ({lo.starting}-{hi.ending})
      </option>
    );
  }
  const rangePairSelectFrag =
    <select
      value={rangePairSelectIndex}
      onChange={e => setRangePairSelectIndex(Number(e.target.value))}
    >
      <option value={-1} key="blank row"></option>
      {rangePairSelectOptions}
    </select>;

  const rangesRowsFrag = ranges.map((iw, i) => {
    return <tr key={iw.key}>
      <td>{iw.starting}</td>
      <td>{iw.ending}</td>
      <td><input
        name="value"
        value={iw.value}
        onChange={(e) => handleValueChange(e.target.value, i)}
      /></td>
    </tr>
  });

  return (
   <>
    <h4>{title}:</h4>
    <p>{L10n.exampleUnitQuantity.chinese} Example unit quantity {quantity || 0} &rarr; {valueLabel}: {lookupRangesModel.value}</p>
    <Table bordered striped>
      <thead>
        <tr>
          <th>{L10n.rangeStart.chinese} Range Start</th>
          <th>{L10n.rangeEnd.chinese} Range End</th>
          <th>{valueLabel}</th>
        </tr>
      </thead>
      <tbody>
        {rangesRowsFrag}
      </tbody>
    </Table>

    <input
      value={splitRangeAt}
      onChange={e => setSplitRangeAt(e.target.value)}
    />
    <button type="button" onClick={handleSplitRange}>{L10n.splitRangeAt.chinese}Split Range At</button>
    <br/>
    {rangePairSelectFrag}
    <button type="button" onClick={() => handleMergeRanges(true)}>{L10n.mergeRangesKeepUpper.chinese}Merge Ranges (keep upper)</button>
    <button type="button" onClick={() => handleMergeRanges(false)}>{L10n.mergeRangesKeepLower.chinese}Merge Ranges (keep lower)</button>
   </>
  );
}

export default LookupRanges;
