import { useState } from "react";
import Table from 'react-bootstrap/Table';
import Importer from "./Importer";
import Trifold from "./Trifold";
import L10n from './L10n';
import { TabLabels } from "./TabLabels";
import { IMaterial, IMetal, IMetalFamily } from "./Types";

function Metals({metals, metalFamilies, materials, saveMetal, deleteMetal}: {metals: IMetal[], metalFamilies: IMetalFamily[], materials: IMaterial[], saveMetal: (metal: IMetal) => void, deleteMetal: (name: string) => void}) {
  const [name, setName] = useState<string>("");
  const [metalFamilyName, setMetalFamilyName] = useState<string>("");
  const [density, setDensity] = useState<string>("");
  const [latheCostPerThousand, setLatheCostPerThousand] = useState<string>("");

  const materialCounts: { [key: string]: number } = {};
  materials.forEach((material) => {
    materialCounts[material.metalName] = (materialCounts[material.metalName] || 0) + 1;
  });

  function importerProcessorFunc(grid: string[][]) {
    grid.forEach((row, i) => {
      if ((row.length < 3) || (row.length > 4)) {
        alert(`Import failed on row ${i+1}.  Expected exactly 3-4 columns`);
        return;
      }
      const [name, density, latheCostPerThousand, metalFamilyName] = row;
      if (!name) {
        return;
      }
      saveMetal({
        name: name,
        metalFamilyName: metalFamilyName,
        density: density,
        latheCostPerThousand: latheCostPerThousand,
      });
    });
  }

  function handleSaveMetal() {
    if (!name) {
      alert("Need a Name");
      return;
    }
    if (!metalFamilyName) {
      alert("Need to select a Metal Family");
      return;
    }
    if (!density || isNaN(Number(density))) {
      alert("Need a numeric density");
      return;
    }
    if (!latheCostPerThousand || isNaN(Number(latheCostPerThousand))) {
      alert("Need a numeric lathe cost per 1k seconds");
      return;
    }
    saveMetal({
      name: name,
      metalFamilyName: metalFamilyName,
      density: density,
      latheCostPerThousand: latheCostPerThousand,
    })
  }

  function handleLoadMetal(index: number) {
     const metal = metals[index];
     setName(metal.name);
     setMetalFamilyName(metal.metalFamilyName);
     setDensity(metal.density);
     setLatheCostPerThousand(metal.latheCostPerThousand);
  }

  const tableRows = metals.map((m, i) => {
    const deleteMetalButton = <button type="button" onClick={() => deleteMetal(m.name)}>{L10n.delete.chinese}Delete</button>;
    return <tr key={m.name}>
      <td>{m.name}</td>
      <td>{m.metalFamilyName}</td>
      <td>{m.density}</td>
      <td>{m.latheCostPerThousand}</td>
      <td><button type="button" onClick={() => handleLoadMetal(i)}>{L10n.load.chinese}Load</button></td>
      <td>{materialCounts[m.name] || 0}</td>
      <td>{!materialCounts[m.name] && deleteMetalButton}</td>
    </tr>
});

  const mfSelectOptionsFrag = metalFamilies.map(mf => {
     return <option value={mf.name} key={mf.name}>{mf.name}</option>;
  });

  const allMetalsFrag = (<>
    <Table bordered striped>
      <thead>
        <tr>
          <th>{L10n.name.chinese} Name</th>
          <th>{L10n.metalFamily.chinese} Metal Family</th>
          <th>{L10n.density.chinese}Density (g/mm<sup>3</sup>)</th>
          <th>{L10n.latheCostPerThousand.chinese} Lathe cost per 1k seconds</th>
          <th>{L10n.load.chinese}Load</th>
          <th>{L10n.material.chinese}{L10n.quantity.chinese} Num Materials</th>
          <th>{L10n.deleteIfUnused.chinese}Delete if unused</th>
        </tr>
      </thead>
      <tbody>
        {tableRows}
      </tbody>
    </Table>
  </>);

  const currentMetalFrag = (<>
    <label>{L10n.name.chinese} Name:</label>
    <input
      value={name}
      onChange={e => setName(e.target.value)}
    />
    <br/>

    <label>{L10n.metalFamily.chinese}Metal Family:</label>
    <select
      value={metalFamilyName}
      onChange={e => setMetalFamilyName(e.target.value)}
    >
      <option value=""></option>
      {mfSelectOptionsFrag}
    </select>
    <br/>

    <label>{L10n.density.chinese} Density (g/mm<sup>3</sup>):</label>
    <input
      value={density}
      onChange={e => setDensity(e.target.value)}
    />
    <br/>

    <label>{L10n.latheCostPerThousand.chinese} Lathe cost per 1k seconds</label>
    <input
      value={latheCostPerThousand}
      onChange={e => setLatheCostPerThousand(e.target.value)
      }
    />
    <br/>

    <button type="submit" onClick={handleSaveMetal}>
      {L10n.save.chinese}{L10n.metal.chinese} Save Metal
    </button>
  </>);

  const importerInstructionsText = `Paste 3-4 columns with no header:
  Column 1: name
  Column 2: density
  COlumn 3: lathe cost per 1k seconds
  Column 3: metal family (optional).  Defaults to
            alphabetically first metal family.

    ---------------------------------|
    | C3604B | 50   | 20   |         |
    | C2700T | 150  | 30   | Copper  |
    | ...    |      
  `;

  const administrationFrag = (<>
    <Importer
      instructionsText={importerInstructionsText}
      buttonText="Save Metals"
      processorFunc={importerProcessorFunc}
    />
  </>);

  return (<>
    <Trifold
      top={allMetalsFrag}
      middle={currentMetalFrag}
      bottom={administrationFrag}
      label={TabLabels.metal}
    />
  </>);
}

export default Metals;
