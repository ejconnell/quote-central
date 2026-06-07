import { useState } from "react";
import Table from 'react-bootstrap/Table';
import Importer from "./Importer";
import Trifold from "./Trifold";
import L10n from "./L10n";
import { TabLabels } from "./TabLabels";
import { IItem, IStandardSetup } from "./Types";

function StandardSetups({standardSetups, items, saveStandardSetup, deleteStandardSetup}: {standardSetups: IStandardSetup[], items: IItem[], saveStandardSetup: (standardSetup: IStandardSetup) => void, deleteStandardSetup: (name: string) => void}) {
  const [name, setName] = useState("");

  const itemCounts: { [key: string]: number } = {};
  items.forEach((item) => {
    item.itemSetups.forEach((itemSetup) => {
      itemSetup.standardName
      if (!itemSetup.standardName) {
        return;
      }
      itemCounts[itemSetup.standardName] = (itemCounts[itemSetup.standardName] || 0) + 1;
    })
  });

  function handleSaveStandardSetup() {
    if (!name) {
      alert("Need a name");
      return;
    }
    saveStandardSetup({
      name: name,
    });
  }

  function importerProcessorFunc(grid: string[][]) {
    grid.forEach((row, i) => {
      if (row.length !== 1) {
        alert(`Import failed on row ${i+1}.  Expected exactly 1 columns`);
        return;
      }
      const [name] = row;
      if (!name) {
        return;
      }
      saveStandardSetup({
        name: name,
      });
    });
  }

  const tableRows = standardSetups.map(ss => {
    const deleteStandardSetupButton = <button type="button" onClick={() => deleteStandardSetup(ss.name)}>{L10n.delete.chinese}Delete</button>;
    return (
      <tr key={ss.name}>
        <td>{ss.name}</td>
        <td>{itemCounts[ss.name] || 0}</td>
        <td>{!itemCounts[ss.name] && deleteStandardSetupButton}</td>
      </tr>
    )}
  );

  const importerInstructionsText = `Paste one column with no header:
    ---------
    | name1 |
    | name2 |
    | ...   |
  `;

  const allStandardSetupsFrag = (<>
    <Table bordered striped>
      <thead>
        <tr>
          <th>{L10n.name.chinese} Name</th>
          <th>{L10n.item.chinese}{L10n.quantity.chinese} Num Items</th>
          <th>{L10n.deleteIfUnused.chinese}Delete if unused</th>
        </tr>
      </thead>
      <tbody>
        {tableRows}
      </tbody>
    </Table>
  </>);

  const currentStandardSetupFrag = (<>
    <label>{L10n.name.chinese} Name:</label>
    <input
      value={name}
      onChange={(e) => setName(e.target.value)}
    />
    <br/>
    <button type="submit" onClick={handleSaveStandardSetup}>
      {L10n.save.chinese}{L10n.standardSetup.chinese} Save Standard Setup
    </button>
  </>);

  const administrationFrag = (<>
    <Importer
      instructionsText={importerInstructionsText}
      buttonText="Save Standard Setups"
      processorFunc={importerProcessorFunc}
    />
  </>);

  return (<>
    <Trifold
      top={allStandardSetupsFrag}
      middle={currentStandardSetupFrag}
      bottom={administrationFrag}
      label={TabLabels.standardSetup}
    />
  </>);
}

export default StandardSetups;
