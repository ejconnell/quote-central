/* eslint-disable react-refresh/only-export-components */

import { useState } from "react";
import Table from 'react-bootstrap/Table';
import Importer from "./Importer";
import L10n from './L10n';
import { MaterialModel } from "./MaterialModel";
import { Shapes } from "./Shapes";
import { TabLabels } from "./TabLabels";
import Trifold from "./Trifold";
import { IMaterial, IMetal, IMetalFamily, IItem } from "./Types";

export function blankMaterial(): IMaterial {
  return {
    name: "",
    isNameManual: false,
    metalName: "",
    shapeName: "",
    width: "",
    innerWidth: "",
    rawCost: "",
    markup: "",
  };
}

const CylindricalShape = Shapes[0];

function Materials({materials, metals, metalFamilies, items, saveMaterial, deleteMaterial}: {materials: IMaterial[], metals: IMetal[], metalFamilies: IMetalFamily[], items: IItem[], saveMaterial: (material: IMaterial) => void, deleteMaterial: (name: string) => void}) {
  const [isNameManual, setIsNameManual] = useState<boolean>(false);
  const [name, setName] = useState<string>("");
  const [metalName, setMetalName] = useState<string>("");
  const [shapeName, setShapeName] = useState<string>(CylindricalShape.name);
  const [width, setWidth] = useState<string>("");
  const [innerWidth, setInnerWidth] = useState<string>("");
  const [rawCost, setRawCost] = useState<string>("");
  const [markup, setMarkup] = useState<string>("6.5");
  const [filterMetalFamilyName, setFilterMetalFamilyName] = useState<string>("");
  const [filterMetalName, setFilterMetalName] = useState<string>("");
  const [filterShapeName, setFilterShapeName] = useState<string>("");

  const itemCounts: { [key: string]: number } = {};
  items.forEach((item) => {
    itemCounts[item.materialName] = (itemCounts[item.materialName] || 0) + 1;
  });

  const materialModel = new MaterialModel({
    metals: metals,
    metalName: metalName,
    shapeName: shapeName,
    width: width,
    innerWidth: innerWidth,
    rawCost: rawCost,
    markup: markup,
  });
  const mergedName = isNameManual ? name : materialModel.autoName;

  const filteredMaterials = materials.filter(material => {
    if (filterMetalName && material.metalName !== filterMetalName) {
      return false;
    }
    const metal = metals.find(metal => metal.name === material.metalName);
    if (!metal) {
      return true;
    }
    if (filterMetalFamilyName && metal.metalFamilyName !== filterMetalFamilyName) {
      return false;
    }
    if (filterShapeName && material.shapeName !== filterShapeName) {
      return false;
    }
    return true;
  });

  const materialsModels = filteredMaterials.map(material => {
    return new MaterialModel({
      metals: metals,
      ...material,
    });
  });

  function handleSaveMaterial() {
    if (!mergedName) {
      alert("Need a Name");
      return;
    }
    if (!metalName) {
      alert("Need a Metal");
      return;
    }
    if (!shapeName) {
      alert("Need a Shape");
      return;
    }
    if (!width || isNaN(Number(width))) {
      alert("Need a numeric Width");
      return;
    }
    if (!rawCost || isNaN(Number(rawCost))) {
      alert("Need a numeric Manufacturer Cost");
      return;
    }
    if (!markup || isNaN(Number(markup))) {
      alert("Need a numeric Markup");
      return;
    }
    if (materialModel.hasInnerWidth && (!innerWidth || isNaN(Number(innerWidth)))) {
      alert("Need a numeric Inner Width");
      return;
    }
    if (isNaN(materialModel.weightPerMm)) {
      alert("There is a problem with the weight per mm");
      return
    }

    const material: IMaterial = {
      name: mergedName,
      isNameManual: isNameManual,
      metalName: metalName,
      shapeName: shapeName,
      width: width,
      innerWidth: materialModel.hasInnerWidth ? innerWidth : "",
      rawCost: rawCost,
      markup: markup,
    };
    saveMaterial(material);
  }

  function importerProcessorFunc(grid: string[][]) {
    const metalNames = metals.map(m => m.name);

    grid.forEach((row, i) => {
      if (row.length !== 4) {
        alert(`Import failed on row ${i+1}.  Expected exactly 4 columns`);
        return;
      }
      const [metalName, width, rawCost, markup] = row;
      if (!metalName || !metalNames.includes(metalName)) {
        alert(`Import failed on row ${i+1}.  Metal ${metalName} not found.`);
        return;
      }
      if (!width || isNaN(Number(width))) {
        alert(`Import failed on row ${i+1}.  Need a numeric width.`);
        return;
      }
      if (isNaN(Number(rawCost))) {
        alert(`Import failed on row ${i+1}.  Need a numeric raw cost.`);
        return;
      }
      if (isNaN(Number(markup))) {
        alert(`Import failed on row ${i+1}.  Need a numeric markup.`);
        return;
      }
      const materialModel = new MaterialModel({
        metals: metals,
        metalName: metalName,
        shapeName: CylindricalShape.name,
        width: width,
        innerWidth: "0",
        rawCost: rawCost,
        markup: markup,
      });
      saveMaterial({
        name: materialModel.autoName,
        isNameManual: false,
        metalName: metalName,
        shapeName: CylindricalShape.name,
        width: width,
        innerWidth: "",
        rawCost: rawCost,
        markup: markup,
      });
    });
  }

  function handleLoadMaterial(index: number) {
     const material = filteredMaterials[index];
     setName(material.name);
     setIsNameManual(material.isNameManual);
     setMetalName(material.metalName);
     setShapeName(material.shapeName);
     setWidth(material.width);
     setInnerWidth(material.innerWidth);
     setRawCost(material.rawCost);
     setMarkup(material.markup);
  }

  const tableRows = filteredMaterials.map((m, i) => {
    const deleteMaterialButton = <button type="button" onClick={() => deleteMaterial(m.name)}>{L10n.delete.chinese}Delete</button>;
    return <tr key={m.name}>
      <td>{m.name}</td>
      <td>{m.metalName}</td>
      <td>{m.shapeName}</td>
      <td style={{textAlign: "right"}}>{Number(m.width).toFixed(1)}</td>
      <td style={{textAlign: "right"}}>{m.innerWidth ? Number(m.innerWidth).toFixed(1) : "---"}</td>
      <td style={{textAlign: "right"}}>{materialsModels[i].weightPerMm.toFixed(4)}</td>
      <td style={{textAlign: "right"}}>{Number(m.rawCost).toFixed(4)}</td>
      <td style={{textAlign: "right"}}>{m.markup}</td>
      <td style={{textAlign: "right"}}>{materialsModels[i].effectiveCost.toFixed(4)}</td>
      <td><button type="button" onClick={() => handleLoadMaterial(i)}>{L10n.load.chinese}Load</button></td>
      <td>{itemCounts[m.name] || 0}</td>
      <td>{!itemCounts[m.name] && deleteMaterialButton}</td>
    </tr>
});

  const innerWidthFragment = (
   <>
    <label>{L10n.inner.chinese}{materialModel.chineseWidth} Inner {materialModel.widthLabel} (mm):</label>
    <input
      value={innerWidth}
      onChange={(e) => setInnerWidth(e.target.value)}
    />
   </>);

  const metalSelectOptions = metals.map(m => {
     return <option value={m.name} key={m.name}>{m.name}</option>;
  });

  const metalFamilySelectOptions = metalFamilies.map(mf => {
    return <option value={mf.name} key={mf.name}>{mf.name}</option>;
  });

  const shapeSelectOptions = Shapes.map(s => {
     return <option value={s.name} key={s.name}>{s.name}</option>;
  });

  const allMaterialsFrag = (<>
    <div className="filterBox">
      <label><b>{L10n.filters.chinese} Filters</b> </label>
      <div className="filterItem">
        <label>{L10n.metalFamily.chinese} Metal Family:</label>
        <select
          value={filterMetalFamilyName}
          onChange={e => setFilterMetalFamilyName(e.target.value)}
        >
          <option value="" key="">{} </option>;
          {metalFamilySelectOptions}
        </select>
      </div>
      <div className="filterItem">
        <label>{L10n.metal.chinese} Metal:</label>
        <select
          value={filterMetalName}
          onChange={e => setFilterMetalName(e.target.value)}
        >
          <option value="" key=""></option>;
          {metalSelectOptions}
        </select>
      </div>
      <div className="filterItem">
        <label>{L10n.shape.chinese} Shape:</label>
        <select
          value={filterShapeName}
          onChange={e => setFilterShapeName(e.target.value)}
        >
          <option value="" key=""></option>;
          {shapeSelectOptions}
        </select>
      </div>
    </div>
    <Table bordered striped>
      <thead>
        <tr>
          <th>{L10n.wastage.chinese} Name</th>
          <th>{L10n.metal.chinese} Metal</th>
          <th>{L10n.shape.chinese} Shape</th>
          <th>{L10n.width.chinese} Width (mm)</th>
          <th>{L10n.innerWidth.chinese} Inner Width (mm)</th>
          <th>{L10n.gramsPerMm.chinese}<br/>Weight per mm (g/mm)</th>
          <th>{L10n.pricePerKgManufacturer.chinese}<br/>Manufacturer Cost ($/kg)</th>
          <th>{L10n.surchargePercentage.chinese} Markup %</th>
          <th>{L10n.pricePerKgSurcharge.chinese}<br/>Effective Cost ($/kg)</th>
          <th>{L10n.load.chinese} Load</th>
          <th>{L10n.item.chinese}{L10n.quantity.chinese} Num Items</th>
          <th>{L10n.deleteIfUnused.chinese}Delete if unused</th>
        </tr>
      </thead>
      <tbody>
        {tableRows}
      </tbody>
    </Table>
  </>);

  const currentMaterialFrag = (<>
    <label>{L10n.name.chinese} Name:</label>
    <input
      value={mergedName}
      onChange={(e) => setName(e.target.value)}
      disabled={!isNameManual}
    />
    &nbsp;
    <label>{L10n.useManualName.chinese} Use Manual Name:</label>
    <input
      type="checkbox"
      name="isNameManual"
      checked={isNameManual}
      onChange={() => setIsNameManual(!isNameManual) }
    />
    <br/>

    <label>{L10n.metal.chinese} Metal:</label>
    <select
      value={metalName}
      onChange={e => setMetalName(e.target.value)}
    >
      <option value="" key=""></option>;
      {metalSelectOptions}
    </select>
    &nbsp;
    <label>{L10n.density.chinese} Density: {materialModel.density || "-"} g/mm<sup>3</sup></label>
    <br/>

    <label>{L10n.shape.chinese} Shape:</label>
    <select
      value={shapeName}
      onChange={e => setShapeName(e.target.value)}
    >
      {shapeSelectOptions}
    </select>
    <br/>

    <label>{materialModel.chineseWidth} {materialModel.widthLabel} (mm):</label>
    <input
      value={width}
      onChange={(e) => setWidth(e.target.value)}
    />
    {materialModel.hasInnerWidth && innerWidthFragment}
    &nbsp; &nbsp;
    <label>{L10n.crossSectionArea.chinese} Cross section area (mm<sup>2</sup>): {materialModel.crossSectionArea.toFixed(4)}</label>
    &nbsp; &nbsp;
    <label>{L10n.gramsPerMm.chinese} Weight per mm (g/mm): {materialModel.weightPerMm.toFixed(4)}</label>
    <br/>

    <label>{L10n.pricePerKgManufacturer.chinese} Manufacturer Cost:</label>
    <input
      value={rawCost}
      onChange={(e) => setRawCost(e.target.value)}
    />
    <label>{L10n.surchargePercentage.chinese} Markup %:</label>
    <input
      value={markup}
      onChange={(e) => setMarkup(e.target.value)}
    />
    <label>{L10n.pricePerKgSurcharge.chinese} Effective Cost: {materialModel.effectiveCost}</label>
    <br/>

    <button type="submit" onClick={handleSaveMaterial}>
      {L10n.save.chinese}{L10n.material.chinese} Save Material
    </button>
  </>);

  const importerInstructionsText = `This importer only supports cylindrical shaped
materials.  Manual material names are not supported.
Paste 4 columns with no header:
  Column 1: metal name
  Column 2: diameter
  Column 3: raw cost
  Column 4: markup %

    -----------------------------|
    | C3604B | 1.8 | 291  | 6.5  |
    | GS5A-B | 5.0 | 317  | 6.5  |
    | 1215MS | 2.0 | 77.5 | 35   |
    | ...    |
  `;

  const administrationFrag = (<>
    <Importer 
      instructionsText={importerInstructionsText}
      buttonText="Save Materials"
      processorFunc={importerProcessorFunc}
    />
  </>);

  return (
    <Trifold
      top={allMaterialsFrag}
      middle={currentMaterialFrag}
      bottom={administrationFrag}
      label={TabLabels.material}
    />
  );
}

export default Materials;
