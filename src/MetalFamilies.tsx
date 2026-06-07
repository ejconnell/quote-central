import { useState } from "react";
import Table from 'react-bootstrap/Table';
import Trifold from "./Trifold";
import L10n from "./L10n";
import { TabLabels } from "./TabLabels";
import { IMetalFamily, IMetal } from "./Types";

function MetalFamilies({metalFamilies, metals, saveMetalFamily, deleteMetalFamily}: {metalFamilies: IMetalFamily[], metals: IMetal[], saveMetalFamily: (metalFamily: IMetalFamily) => void, deleteMetalFamily: (name: string) => void}) {
  const [name, setName] = useState<string>("");

  const metalCounts: { [key: string]: number } = {};
  metals.forEach((metal) => {
    metalCounts[metal.metalFamilyName] = (metalCounts[metal.metalFamilyName] || 0) + 1;
  });

  function handleSaveMetalFamily() {
    if (!name) {
      alert("Need a name");
      return;
    }
    const metalFamily = {
      name: name,
    };
    saveMetalFamily(metalFamily)
  }

  const mfRowsFrag = metalFamilies.map(mf => {
    const deleteMetalFamilyButton = <button type="button" onClick={() => deleteMetalFamily(mf.name)}>{L10n.delete.chinese}Delete</button>;
    return <tr key={mf.name}>
      <td>{mf.name}</td>
      <td>{metalCounts[mf.name] || 0}</td>
      <td>{!metalCounts[mf.name] && deleteMetalFamilyButton}</td>
    </tr>
  });

  const allMetalFamiliesFrag = (<>
    <Table bordered striped>
      <thead>
        <tr>
          <th>{L10n.name.chinese} Name</th>
          <th>{L10n.metal.chinese}{L10n.quantity.chinese} Num Metals</th>
          <th>{L10n.deleteIfUnused.chinese}Delete if unused</th>
        </tr>
      </thead>
      <tbody>
        {mfRowsFrag}
      </tbody>
    </Table>
  </>);

  const currentMetalFamilyFrag = (<>
    <label>{L10n.name.chinese} Name:</label>
    <input
      value={name}
      onChange={e => setName(e.target.value)}
    />
    <br/>
    <button type="submit" onClick={handleSaveMetalFamily}>
      {L10n.save.chinese}{L10n.metalFamily.chinese} Save Metal Family
    </button>
  </>);

  return (
    <Trifold
      top={allMetalFamiliesFrag}
      middle={currentMetalFamilyFrag}
      bottom={<></>}
      label={TabLabels.metalFamily}
    />
  );
}

export default MetalFamilies;
