/* eslint-disable react-refresh/only-export-components */

import { useState } from "react";
import Table from 'react-bootstrap/Table';
import Importer from "./Importer";
import Trifold from "./Trifold";
import ItemSetups from "./ItemSetups"
import ItemInHouses from "./ItemInHouses"
import ItemWastage from "./ItemWastage"
import ItemOverhead from "./ItemOverhead"
import ItemOutsourcings from "./ItemOutsourcings"
import L10n from "./L10n"
import { TabLabels } from "./TabLabels";
import { ItemWastageInitialRange } from "./ItemWastage"
import { ItemOverheadInitialRange } from "./ItemOverhead"
import { ItemModel } from "./ItemModel";
import { ICustomer, IInHouse, IItem, IItemInHouse, IItemOutsourcing, IItemOverheadRange, IItemSetup, IItemWastageRange, IMaterial, IMetal, IOutsourcing, IQuote, IStandardSetup } from "./Types";
import { makeLogger } from "./utils/logger";

const log = makeLogger("Items");


export function blankItem(): IItem {
  return {
    name: "",
    createdBy: "",
    timestamp: 0,
    version: 1,
    customerName: "",
    materialName: "",
    unitLength: "",
    itemInHouses: [],
    itemOutsourcings: [],
    itemOverheadRanges: [ItemOverheadInitialRange()],
    itemSetups: [],
    itemWastageRanges: [ItemWastageInitialRange()],
  };
}

type ItemsProps = {
  items: IItem[];
  itemVersions: { [itemName: string]: IItem[] };
  materials: IMaterial[];
  metals: IMetal[];
  standardSetups: IStandardSetup[];
  inHouses: IInHouse[];
  outsourcings: IOutsourcing[];
  customers: ICustomer[];
  quotes: IQuote[];
  saveItem: (item: IItem) => void;
  deleteItem: (name: string) => void;
  saveItemVersion: (item: IItem) => void;
  email: string;
};

function Items({
  items,
  itemVersions,
  materials,
  metals,
  standardSetups,
  inHouses,
  outsourcings,
  customers,
  quotes,
  saveItem,
  deleteItem,
  saveItemVersion,
  email,
}: ItemsProps) {
  const [exampleUnitQuantity, setExampleUnitQuantity] = useState<string>("1000");
  const [customerName, setCustomerName] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [materialName, setMaterialName] = useState<string>("");
  const [unitLength, setUnitLength] = useState<string>("");
  const [createdBy, setCreatedBy] = useState<string>(email);
  const [timestamp, setTimestamp] = useState<number>(Date.now());
  const [version, setVersion] = useState<number>(1);
  const [itemSetups, setItemSetups] = useState<IItemSetup[]>([]);
  const [itemInHouses, setItemInHouses] = useState<IItemInHouse[]>([]);
  const [itemWastageRanges, setItemWastageRanges] = useState<IItemWastageRange[]>([ItemWastageInitialRange()]);
  const [itemOverheadRanges, setItemOverheadRanges] = useState<IItemOverheadRange[]>([ItemOverheadInitialRange()]);
  const [itemOutsourcings, setItemOutsourcings] = useState<IItemOutsourcing[]>([]);

  const ivItems = itemVersions[name] || [];

  const quoteCounts: { [key: string]: number } = {};
  quotes.forEach(q => {
    q.quoteItems.forEach(qi => {
      quoteCounts[qi.name] = (quoteCounts[qi.name] || 0) + 1;
    });
  });

  const lookupTables = {
    materials: materials,
    metals: metals,
    inHouses: inHouses,
    outsourcings: outsourcings,
    customers: customers,
  };

  const itemModel = new ItemModel({
    ...lookupTables,
    materialName: materialName,
    unitLength: unitLength,
    itemSetups: itemSetups,
    itemInHouses: itemInHouses,
    itemWastageRanges: itemWastageRanges,
    itemOverheadRanges: itemOverheadRanges,
    itemOutsourcings: itemOutsourcings,
    unitQuantity: Number(exampleUnitQuantity),
  });

  const itemsModels = items.map(item => {
    return new ItemModel({
       ...lookupTables,
       ...item,
       unitQuantity: Number(exampleUnitQuantity),
    });
  });

  const ivItemsModels = ivItems.map(item => {
    return new ItemModel({
       ...lookupTables,
       ...item,
       unitQuantity: Number(exampleUnitQuantity),
    });
  });

  function handleSaveItem() {
    log("handleSaveItem()");
    if (!customerName) {
      alert("Need a customer name");
      return;
    }
    if (!name) {
      alert("Need a name");
      return;
    }
    if (!materialName) {
      alert("Need a name");
      return;
    }
    if (isNaN(itemModel.materialCostPerUnit)) {
      alert("Need to fix Material section");
      return;
    }
    if (isNaN(itemModel.inHouseCostPerUnit)) {
      alert("Need to fix In House section");
      return;
    }
    if (isNaN(itemModel.outsourcingCostPerUnit)) {
      alert("Need to fix Outsourcing section");
      return;
    }
    if (isNaN(itemModel.wastagePercent)) {
      alert("Need to fix Wastage section");
      return;
    }
    if (isNaN(itemModel.setupCostPerUnit)) {
      alert("Need to fix Setup section");
      return;
    }
    if (isNaN(itemModel.overheadPercent)) {
      alert("Need to fix Overhead section");
      return;
    }

    const nextVersion = ivItems ? Math.max(...ivItems.map(iv => iv.version)) + 1 : 1;

    const item = {
      name: name,
      createdBy: email,
      timestamp: Date.now(),
      version: nextVersion,
      customerName: customerName,
      materialName: materialName,
      unitLength: unitLength,
      itemSetups: itemSetups,
      itemInHouses: itemInHouses,
      itemWastageRanges: itemWastageRanges,
      itemOverheadRanges: itemOverheadRanges,
      itemOutsourcings: itemOutsourcings,
    };
    saveItem(item);
    saveItemVersion(item);
  }

  function _handleLoadItem(item: IItem) {
    setName(item.name);
    setCustomerName(item.customerName || "");
    setMaterialName(item.materialName);
    setUnitLength(item.unitLength);
    setCreatedBy(item.createdBy);
    setTimestamp(item.timestamp);
    setVersion(item.version);
    setItemSetups(item.itemSetups);
    setItemInHouses(item.itemInHouses);
    setItemWastageRanges(item.itemWastageRanges);
    setItemOverheadRanges(item.itemOverheadRanges);
    setItemOutsourcings(item.itemOutsourcings);
  }

  function handleLoadItem(index: number) {
    const item = items[index];
    _handleLoadItem(item);
  }

  function handleLoadItemVersion(version: number) {
    const item = ivItems?.find(iv => iv.version === version);
    if (!item) {
      alert(`Could not find item version ${version}`);
      return;
    }
    _handleLoadItem(item);
  }

  const itemVersionRowsFrag = ivItems?.map((ivItem, i) => {
    return <tr key={ivItem.timestamp}>
      <td>{ivItem.name}</td>
      <td>{ivItem.customerName}</td>
      <td>{ivItem.materialName}</td>
      <td>{ivItemsModels[i].materialCostPerUnit.toFixed(2)}</td>
      <td>{ivItemsModels[i].inHouseCostPerUnit.toFixed(2)}</td>
      <td>{ivItemsModels[i].outsourcingCostPerUnit.toFixed(2)}</td>
      <td>{ivItemsModels[i].wastagePercent.toFixed(2)}</td>
      <td>{ivItemsModels[i].setupCostPerUnit.toFixed(2)}</td>
      <td>{ivItemsModels[i].overheadPercent.toFixed(2)}</td>

      <td>{ivItem.version}</td>
      <td>{ivItem.createdBy}</td>
      <td>{new Date(ivItem.timestamp).toLocaleString()}</td>
      <td><button type="button" onClick={() => handleLoadItemVersion(ivItem.version)}>
        {L10n.load.chinese}Load
      </button></td>
    </tr>
  });

  const allItemVersionsFrag = (<>
      <h3>Item Version Listing</h3>
      <Table bordered striped>
        <thead>
          <tr>
            <th>{L10n.name.chinese} Name</th>
            <th>{L10n.customer.chinese}{L10n.name.chinese} Customer name</th>
            <th>{L10n.material.chinese}{L10n.name.chinese} Material name</th>
            <th>{L10n.material.chinese}{L10n.cost.chinese} Material cost</th>
            <th>{L10n.inHouse.chinese}{L10n.cost.chinese} In House cost</th>
            <th>{L10n.outsourcing.chinese}{L10n.cost.chinese} Outsourcing cost</th>
            <th>{L10n.wastage.chinese} Wastage percent</th>
            <th>{L10n.setupCost.chinese} Setup cost</th>
            <th>{L10n.overhead.chinese} Overhead percent</th>
            <th>{L10n.version.chinese} Version</th>
            <th>{L10n.createdBy.chinese} Created by</th>
            <th>{L10n.timestamp.chinese} Created at</th>
            <th>{L10n.load.chinese} Load</th>
          </tr>
        </thead>
        <tbody>
          {itemVersionRowsFrag}
        </tbody>
      </Table>
    </>);

  const itemRowsFrag = items.map((item, i) => {
    const deleteItemButton = <button type="button" onClick={() => deleteItem(item.name)}>{L10n.delete.chinese} Delete</button>
    return <tr key={item.name}>
      <td>{item.name}</td>
      <td>{item.customerName}</td>
      <td>{item.materialName}</td>
      <td>{itemsModels[i].materialCostPerUnit.toFixed(2)}</td>
      <td>{itemsModels[i].inHouseCostPerUnit.toFixed(2)}</td>
      <td>{itemsModels[i].outsourcingCostPerUnit.toFixed(2)}</td>
      <td>{itemsModels[i].wastagePercent.toFixed(2)}</td>
      <td>{itemsModels[i].setupCostPerUnit.toFixed(2)}</td>
      <td>{itemsModels[i].overheadPercent.toFixed(2)}</td>
      <td><button type="button" onClick={() => handleLoadItem(i)}>
        {L10n.load.chinese}Load
      </button></td>
      <td>{quoteCounts[item.name] || 0}</td>
      <td>{!quoteCounts[item.name] && deleteItemButton}</td>
    </tr>
  });

  const customerSelectOptions = customers.map(c => {
    return <option value={c.name} key={c.name}>{c.name}</option>;
  });

  const materialSelectOptions = materials.map(m => {
     return <option value={m.name} key={m.name}>{m.name}</option>;
  });

  const allItemsFrag = (<>
    <label>{L10n.exampleUnitQuantity.chinese} Example unit quantity:</label>
    <input
      value={exampleUnitQuantity}
      onChange={(e) => setExampleUnitQuantity(e.target.value)}
    />
    <br/>
    <br/>

    <Table bordered striped>
      <thead>
        <tr>
          <th>{L10n.name.chinese} Name</th>
          <th>{L10n.customer.chinese}{L10n.name.chinese} Customer name</th>
          <th>{L10n.material.chinese}{L10n.name.chinese} Material name</th>
          <th>{L10n.material.chinese}{L10n.cost.chinese} Material cost</th>
          <th>{L10n.inHouse.chinese}{L10n.cost.chinese} In House cost</th>
          <th>{L10n.outsourcing.chinese}{L10n.cost.chinese} Outsourcing cost</th>
          <th>{L10n.wastage.chinese} Wastage percent</th>
          <th>{L10n.setupCost.chinese} Setup cost</th>
          <th>{L10n.overhead.chinese} Overhead percent</th>
          <th>{L10n.load.chinese} Load</th>
          <th>{L10n.quote.chinese}{L10n.quantity.chinese} Num Quotes</th>
          <th>{L10n.deleteIfUnused.chinese}Delete if unused</th>
        </tr>
      </thead>
      <tbody>
        {itemRowsFrag}
      </tbody>
    </Table>
  </>);

  const currentItemFrag = (<>
    <label>{L10n.name.chinese} Name:</label>
    <input
      value={name}
      onChange={(e) => setName(e.target.value)}
    />
    <br/>

    <label>{L10n.customer.chinese}{L10n.name.chinese} Customer name:</label>
    <select
      value={customerName}
      onChange={e => setCustomerName(e.target.value)}
    >
      <option value="" key="blank"></option>;
      {customerSelectOptions}
    </select>
    <br/>

    <label>{L10n.createdBy.chinese} Created by: {createdBy}</label>
    <br/>
    <label>{L10n.timestamp.chinese} Created at: {new Date(timestamp).toLocaleString()}</label>
    <br/>
    <label>{L10n.version.chinese} Version: {version}</label>
    <br/>

    <h4>{L10n.material.chinese} Material:</h4>
    <select
      value={materialName}
      onChange={e => setMaterialName(e.target.value)}
    >
      <option value="" key="blank"></option>;
      {materialSelectOptions}
    </select>
    &nbsp;
    <label>{L10n.unit.chinese}{L10n.length.chinese} Unit length (mm):</label>
    <input
      value={unitLength}
      onChange={(e) => setUnitLength(e.target.value)}
    />
    <br/>
    <label>{L10n.cost.chinese}/{L10n.unit.chinese}Cost per unit: {itemModel.materialCostPerUnit.toFixed(4)}</label>
    <br/>
    <label>{L10n.gram.chinese}/{L10n.unit.chinese}Grams per unit: {itemModel.gramsPerUnit.toFixed(4)}</label>
    <br/>
    <label>{L10n.gram.chinese}/{L10n.unit.chinese}{L10n.included.chinese}{L10n.wastage.chinese} Grams per unit including wastage: {itemModel.gramsPerUnitIncludingWastage.toFixed(4)}</label>
    <br/>

    <ItemInHouses
      inHouses={inHouses}
      itemInHouses={itemInHouses}
      metalName={itemModel.metalName}
      latheCostPerThousand={itemModel.latheCostPerThousand}
      setItemInHouses={setItemInHouses}
    />

    <ItemOutsourcings
      outsourcings={outsourcings}
      itemOutsourcings={itemOutsourcings}
      exampleUnitQuantity={exampleUnitQuantity}
      startingGramsPerUnit={itemModel.gramsPerUnit}
      setItemOutsourcings={setItemOutsourcings}
    />

    <ItemWastage
      itemWastageRanges={itemWastageRanges}
      exampleUnitQuantity={exampleUnitQuantity}
      setItemWastageRanges={setItemWastageRanges}
    />

    <ItemSetups
      standardSetups={standardSetups}
      itemSetups={itemSetups}
      setItemSetups={setItemSetups}
      exampleUnitQuantity={exampleUnitQuantity}
    />

    <ItemOverhead
      itemOverheadRanges={itemOverheadRanges}
      exampleUnitQuantity={exampleUnitQuantity}
      setItemOverheadRanges={setItemOverheadRanges}
    />

    <br/>
    <br/>
    <button type="submit" onClick={handleSaveItem}>
      {L10n.save.chinese}{L10n.item.chinese} Save Item
    </button>

    <br/>
    <br/>
    { allItemVersionsFrag }

  </>);

  const importerInstructionsText = `This importer works for a single item at a time.
It doesn't 'save' the item directly; it only 'loads' it
to the "Current Item" section for you to review, then add
the 'name' field based on Google Sheet tab name, and then
click "Save Item".

In Google Sheets go to an Item tab, click on cell P46
and drag back to cell A1.  Copy and then paste the
whole thing here.
  `;

  function importerProcessorFunc(grid: string[][]) {
    const materialNames = materials.map(m => m.name);
    const standardSetupNames = standardSetups.map(m => m.name);
    const inHouseNames = inHouses.map(m => m.name);
    const outsourcingNames = outsourcings.map(m => m.name);

    let numErrors = 0;
    const MaxErrors = 2;
    if (grid.length !== 46) {
      doAlert(`Import aborted. Expected exactly 46 rows but got ${grid.length}`);
      return;
    }
    log(grid);
    function doAlert(str: string) {
      if (numErrors < MaxErrors) {
        if (numErrors < MaxErrors - 1) {
          alert(str);
        } else {
          alert(str + " - Additional errors will be ignored");
        }
      }
      numErrors += 1;
    }
    grid.forEach((row, i) => {
      if (row.length !== 16) {
        doAlert(`Import failed on row ${i+1}.  Expected exactly 16 columns but got ${row.length}`);
        return;
      }
    });
    const materialName = grid[1][0];
    if (materialNames.includes(materialName)) {
      setMaterialName(materialName);
    } else {
      setMaterialName(materialName.replace("-", " "));
    }

    const unitLength = grid[3][13];
    setUnitLength(unitLength);

    const itemSetups: IItemSetup[] = [];
    for (let row = 2; row <= 7; row++) {
      const standardSetupName = grid[row][5];
      const costPerJob = grid[row][6];
      if (!standardSetupName) continue;
      if (standardSetupName === "空白") continue;  // "unused"
      if (!standardSetupNames.includes(standardSetupName)) {
        doAlert(`Standard setup name '${standardSetupName}' not found on row ${row+1}`);
        continue;
      }
      itemSetups.push({
        key: crypto.randomUUID(),
        standardName: standardSetupName,
        customName: "",
        isCustomName: false,
        costPerJob: costPerJob,
      });
    }
    for (let row = 10; row <= 15; row++) {
      const customSetupName = grid[row][5];
      const costPerJob = grid[row][6];
      if (!customSetupName) continue;
      itemSetups.push({
        key: crypto.randomUUID(),
        standardName: "",
        customName: customSetupName,
        isCustomName: true,
        costPerJob: costPerJob,
      });
    }
    setItemSetups(itemSetups);

    const itemInHouses = [];
    for (let row = 4; row <= 15; row++) {
      //const inHouseName = grid[row][0];
      const inHouseName = grid[row][0].replace("\n", "").trim();
      if (!inHouseName) continue;
      if (inHouseName === "空白") continue;  // "unused"
      if (!inHouseNames.includes(inHouseName)) {
        doAlert(`In house name '${inHouseName}' not found on row ${row+1}`);
        continue;
      }
      itemInHouses.push({
        key: crypto.randomUUID(),
        name: inHouseName,
        quantity: grid[row][2],
      });
    }
    setItemInHouses(itemInHouses);

    const itemWastageRanges = [];
    let nextEnding = ItemWastageInitialRange().ending;
    for (let row = 21; row <= 30; row++) {
      const starting = Number(grid[row][0]);
      const value = grid[row][1];
      if (!starting) continue;
      itemWastageRanges.push({
        key: crypto.randomUUID(),
        starting: starting,
        ending: nextEnding,
        value: value,
      });
      nextEnding = starting - 1;
    }
    if (nextEnding >= 0) {
      itemWastageRanges.push({
        key: crypto.randomUUID(),
        starting: 0,
        ending: nextEnding,
        value: "1000000",
      });
    }
    setItemWastageRanges(itemWastageRanges);

    const itemOverheadRanges = [];
    nextEnding = ItemOverheadInitialRange().ending;
    for (let row = 21; row <= 30; row++) {
      const starting = Number(grid[row][3]);
      const value = grid[row][4];
      if (!starting) continue;
      itemOverheadRanges.push({
        key: crypto.randomUUID(),
        starting: starting,
        ending: nextEnding,
        value: value,
      });
      nextEnding = starting - 1;
    }
    if (nextEnding >= 0) {
      itemOverheadRanges.push({
        key: crypto.randomUUID(),
        starting: 0,
        ending: nextEnding,
        value: "1000000",
      });
    }
    setItemOverheadRanges(itemOverheadRanges);

    const itemOutsourcings = []
    for (let row = 36; row <= 45; row++) {
      const outsourcingName = grid[row][0];
      const gramsPerUnit = grid[row][1];
      if (!outsourcingName) continue;
      if (outsourcingName.trim() === "空白 unused") continue;
      if (!outsourcingNames.includes(outsourcingName)) {
        doAlert(`Outsourcing name '${outsourcingName}' not found on row ${row+1}`);
        continue;
      }
      itemOutsourcings.push({
        key: crypto.randomUUID(),
        name: outsourcingName,
        gramsPerUnit: gramsPerUnit,
      });
    }
    setItemOutsourcings(itemOutsourcings);
  }

  const administrationFrag = (<>
    <Importer
      instructionsText={importerInstructionsText}
      buttonText="Load to Current Item"
      processorFunc={importerProcessorFunc}
    />
  </>);

  return (
    <Trifold
      top={allItemsFrag}
      middle={currentItemFrag}
      bottom={administrationFrag}
      label={TabLabels.item}
    />
  );

}

export default Items;
