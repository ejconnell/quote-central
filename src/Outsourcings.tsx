import { useState } from "react";
import Table from 'react-bootstrap/Table';
import Importer from "./Importer";
import Trifold from "./Trifold";
import L10n from "./L10n";
import { TabLabels } from "./TabLabels";
import { IItem, IOutsourcing } from "./Types";

function Outsourcings({outsourcings, items, saveOutsourcing, deleteOutsourcing}: {outsourcings: IOutsourcing[], items: IItem[], saveOutsourcing: (outsourcing: IOutsourcing) => void, deleteOutsourcing: (name: string) => void,}) {
  const [name, setName] = useState("");
  const [isPricedByUnit, setIsPricedByUnit] = useState(false);
  const [variableCost, setVariableCost] = useState("");
  const [minCostPerJob, setMinCostPerJob] = useState("");

  const variableCostStr = isPricedByUnit ? "unit" : "kilogram";
  const variableCostLabel = isPricedByUnit ? L10n.minCostPerUnit.chinese + "Minimum cost per unit" : L10n.minCostPerKg.chinese + "Minimum cost per kilogram";

  const itemCounts: { [key: string]: number } = {};
  items.forEach((item) => {
    item.itemOutsourcings.forEach((itemOutsourcing) => {
      itemCounts[itemOutsourcing.name] = (itemCounts[itemOutsourcing.name] || 0) + 1;
    })
  });

  function handleSaveOutsourcing() {
    if (!name) {
      alert("Need a Name");
      return;
    }
    if (!variableCost || isNaN(Number(variableCost))) {
      alert(`Need a numeric cost per ${variableCostStr}`);
      return;
    }
    if (isNaN(Number(minCostPerJob))) {
      alert("Need a numeric minimum cost");
      return;
    }
    const outsourcing = {
      name: name,
      isPricedByUnit: isPricedByUnit,
      variableCost: variableCost,
      minCostPerJob: minCostPerJob,
    };
    saveOutsourcing(outsourcing);
  }

  function handleLoadOutsourcing(index: number) {
     const os = outsourcings[index];
     setName(os.name);
     setIsPricedByUnit(os.isPricedByUnit);
     setVariableCost(os.variableCost);
     setMinCostPerJob(os.minCostPerJob);
  }

  function importerProcessorFunc(grid: string[][]) {
    grid.forEach((row, i) => {
      if ((row.length < 3) || (row.length > 4)) {
        alert(`Import failed on row ${i+1}.  Expected exactly 3-4 columns`);
        return;
      }
      const [name, variableCost, minCostPerJob, isPricedByUnit] = row;
      if (!name) {
        return;
      }
      saveOutsourcing({
        name: name,
        variableCost: variableCost,
        minCostPerJob: minCostPerJob,
        isPricedByUnit: isPricedByUnit?.toLowerCase() === "true",
      });
    });
  }

  const outsourcingsRowsFrag = outsourcings.map((os, i) => {
    const deleteOutsourcingButton = <button type="button" onClick={() => deleteOutsourcing(os.name)}>{L10n.delete.chinese}Delete</button>;
    return <tr key={os.name}>
      <td>{os.name}</td>
      <td>{os.minCostPerJob}</td>
      <td>{os.isPricedByUnit ? `${L10n.unit.chinese} Unit` : `${L10n.kilogram.chinese} Kilogram`}</td>
      <td>{os.variableCost}</td>
      <td>
        <button type="button" onClick={() => handleLoadOutsourcing(i)}>{L10n.load.chinese}Load</button>
      </td>
      <td>{itemCounts[os.name] || 0}</td>
      <td>{!itemCounts[os.name] && deleteOutsourcingButton}</td>
    </tr>
  });

  const importerInstructionsText = `Paste 3-4 columns with no header:
  Column 1: name
  Column 2: min cost per kg (or unit)
  Column 3: min cost per job
  Column 4: (optional) "true" if priced by unit or "false"
            if priced by kg.  Defaults to "false"

    --------------------------------|
    | name1 | 25   | 50   | "true"  |
    | name2 | 35   | 150  |         |
    | name3 | 15   | 500  | "false" |
    | ...   |
  `;

  const allOutsourcingsFrag = (<>
    <Table bordered striped>
      <thead>
        <tr>
          <th>{L10n.name.chinese} Name</th>
          <th>{L10n.minCostPerJob.chinese} Minimum cost per job</th>
          <th>{L10n.pricedBy.chinese} Priced by</th>
          <th>{L10n.costPerKgUnit.chinese} Cost per kg/unit</th>
          <th>{L10n.load.chinese} Load</th>
          <th>{L10n.item.chinese}{L10n.quantity.chinese} Num Items</th>
          <th>{L10n.deleteIfUnused.chinese}Delete if unused</th>
        </tr>
      </thead>
      <tbody>
        {outsourcingsRowsFrag}
      </tbody>
    </Table>
  </>);

  const currentOutsourcingFrag = (<>
    <label>{L10n.name.chinese} Name:</label>
    <input
      value={name}
      onChange={(e) => setName(e.target.value)}
    />
    <br/>

    <label>{L10n.minCostPerJob.chinese} Minimum Cost per job:</label>
    <input
      value={minCostPerJob}
      onChange={(e) => setMinCostPerJob(e.target.value)}
    />
    <br/>

    <label>{L10n.pricedByUnit.chinese} ({L10n.uncheckForPricedByKg.chinese}) Priced by unit (uncheck for per kg pricing):</label>
    <input
      type="checkbox"
      name="isPricedByUnit"
      checked={isPricedByUnit}
      onChange={() => setIsPricedByUnit(!isPricedByUnit) }
    />
    <br/>

    <label>{variableCostLabel}:</label>
    <input
      value={variableCost}
      onChange={(e) => setVariableCost(e.target.value)}
    />
    <br/>

    <button type="submit" onClick={handleSaveOutsourcing}>
      {L10n.save.chinese}{L10n.outsourcing.chinese} Save Outsourcing
    </button>
  </>);

  const administrationFrag = (<>
    <Importer
      instructionsText={importerInstructionsText}
      buttonText="Save Outsourcings"
      processorFunc={importerProcessorFunc}
    />
  </>);

  return (<>
    <Trifold
      top={allOutsourcingsFrag}
      middle={currentOutsourcingFrag}
      bottom={administrationFrag}
      label={TabLabels.outsourcing}
    />
  </>);
}

export default Outsourcings;
