import Table from 'react-bootstrap/Table';
import L10n from './L10n';
import { IItemOutsourcing, IItemOutsourcingModelRow, IOutsourcing } from './Types';

export class ItemOutsourcingsModel {
  totalCostPerUnit: number;
  totalCostPerJob: number;
  rows: IItemOutsourcingModelRow[];
  constructor(outsourcings: IOutsourcing[], itemOutsourcings: IItemOutsourcing[], unitQuantity: number) {
    this.totalCostPerUnit = 0;
    this.totalCostPerJob = 0;
    this.rows = itemOutsourcings.map(io => {
      const outsourcing = outsourcings.find(o => o.name === io.name);

      let minCostPerUnit: number;
      let minCostPerKilogram: number;
      let costCutoverUnitQuantity: number;
      if (outsourcing?.isPricedByUnit) {
        minCostPerUnit = Number(outsourcing?.variableCost);
        costCutoverUnitQuantity = Number(outsourcing?.minCostPerJob) / minCostPerUnit;
        minCostPerKilogram = Number.NaN
      } else {
        minCostPerKilogram = Number(outsourcing?.variableCost);
        minCostPerUnit = minCostPerKilogram / 1000 * Number(io.gramsPerUnit);
        costCutoverUnitQuantity = Number(outsourcing?.minCostPerJob) / minCostPerUnit;
      }

      let costPerUnit: number;
      let costPerJob: number;
      if (unitQuantity > costCutoverUnitQuantity) {
        costPerUnit = minCostPerUnit;
        costPerJob = costPerUnit * unitQuantity;
      } else {
        costPerJob = Number(outsourcing?.minCostPerJob);
        costPerUnit = costPerJob / unitQuantity;
      }
      if (!minCostPerUnit) {
        costPerJob = Number.NaN;
        costPerUnit = Number.NaN;
      }

      this.totalCostPerUnit += costPerUnit;
      this.totalCostPerJob += costPerJob;

      return {
        minCostPerUnit: minCostPerUnit || Number.NaN,
        minCostPerKilogram: minCostPerKilogram || Number.NaN,
        costCutoverUnitQuantity: costCutoverUnitQuantity || Number.NaN,
        costPerUnit: costPerUnit || Number.NaN,
        costPerJob: costPerJob || Number.NaN,
      }
    });
  }
}

function ItemOutsourcings({outsourcings, itemOutsourcings, exampleUnitQuantity, startingGramsPerUnit, setItemOutsourcings}:{outsourcings: IOutsourcing[], itemOutsourcings: IItemOutsourcing[], exampleUnitQuantity: string, startingGramsPerUnit: number, setItemOutsourcings: (itemOutsourcings: IItemOutsourcing[]) => void}) {

  const ioModel = new ItemOutsourcingsModel(outsourcings, itemOutsourcings, Number(exampleUnitQuantity));

  function addItemOutsourcing(index: number) {
    const nextItemOutsourcings = [
      ...itemOutsourcings.slice(0, index+1),
      {
        key: crypto.randomUUID(),
        name: "",
        gramsPerUnit: "",
      },
      ...itemOutsourcings.slice(index+1),
    ];
    setItemOutsourcings(nextItemOutsourcings);
  }

  function deleteItemOutsourcing(index: number) {
    const nextItemOutsourcings = [
      ...itemOutsourcings.slice(0, index),
      ...itemOutsourcings.slice(index+1),
    ];
    setItemOutsourcings(nextItemOutsourcings);
  }

  function handleNameChange(value: string, index: number) {
    const nextItemOutsourcings = itemOutsourcings.map((io, i) => {
      if (i === index) {
        return {
          key: io.key,
          name: value,
          gramsPerUnit: io.gramsPerUnit,
        }
      } else {
        return {...io};
      }
    });
    setItemOutsourcings(nextItemOutsourcings);
  }

  function handleGramsPerUnitChange(value: string, index: number) {
    const nextItemOutsourcings = itemOutsourcings.map((io, i) => {
      if (i === index) {
        return {
          key: io.key,
          name: io.name,
          gramsPerUnit: value,
        }
      } else {
        return {...io};
      }
    });
    setItemOutsourcings(nextItemOutsourcings);
  }

  const itemOutsourcingsEmptyRowFrag = <tr key="empty row">
    <td>&rarr;</td>
    <td>&rarr;</td>
    <td>&rarr;</td>
    <td>&rarr;</td>
    <td>&rarr;</td>
    <td>&rarr;</td>
    <td>&rarr;</td>
    <td>&rarr;</td>
    <td>&rarr;</td>
    <td><button type="button" onClick={() => addItemOutsourcing(-1)}> + </button></td>
  </tr>;

  const outsourcingsSelectOptions = outsourcings.map(os =>
    <option value={os.name} key={os.name}>{os.name}</option>
  );

  const itemOutsourcingsRowsFrag = itemOutsourcings.map((io, i) => {
    const outsourcing = outsourcings.find(o => o.name === io.name);
    const modelRow = ioModel.rows[i];

    const nameSelectFrag = <select
      value={io.name}
      onChange={e => handleNameChange(e.target.value, i)}
    >
      <option value=""></option>
      {outsourcingsSelectOptions}
    </select>

    const gramsPerUnitInputFrag = outsourcing?.isPricedByUnit ? "---" : <input
      value={io.gramsPerUnit}
      onChange={e => handleGramsPerUnitChange(e.target.value, i)}
      style={{width: "90px"}}
    />

    return <tr key={io.key}>
      <td>{nameSelectFrag}</td>
      <td>{gramsPerUnitInputFrag}</td>
      <td>{modelRow.minCostPerKilogram ? modelRow.minCostPerKilogram.toFixed(2) : "--"}</td>
      <td>{modelRow.minCostPerUnit.toFixed(4)}</td>
      <td>{outsourcing?.minCostPerJob}</td>
      <td>{modelRow.costCutoverUnitQuantity.toFixed(1)}</td>
      <td>{modelRow.costPerUnit.toFixed(4)}</td>
      <td>{modelRow.costPerJob.toFixed(1)}</td>
      <td><button type="button" onClick={() => deleteItemOutsourcing(i)}> - </button></td>
      <td><button type="button" onClick={() => addItemOutsourcing(i)}> + </button></td>
    </tr>
  });

  const itemOutsourcingsTotalRowFrag = <tr key="total row">
    <td><b>Total</b></td>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
    <td></td>
    <td><b>{ioModel.totalCostPerUnit.toFixed(4)}</b></td>
    <td>{ioModel.totalCostPerJob.toFixed(1)}</td>
    <td></td>
    <td></td>
  </tr>;

  return (
    <>
      <h4>{L10n.outsourcing.chinese} Outsourcing:</h4>
      <p>{L10n.exampleUnitQuantity.chinese} Example unit quantity: {exampleUnitQuantity || 0} &rarr; {L10n.costPerUnit.chinese} Cost per unit: {ioModel.totalCostPerUnit.toFixed(2)}</p>
      <p>{L10n.starting.chinese}{L10n.gramsPerUnit.chinese} Starting grams per unit: {startingGramsPerUnit.toFixed(4)}</p>
      <Table bordered striped>
        <thead>
          <tr>
            <th>{L10n.name.chinese} Name</th>
            <th>{L10n.gramsPerUnit.chinese} Grams per Unit</th>
            <th>{L10n.minCostPerKg.chinese} Minimum Cost per kg</th>
            <th>{L10n.minCostPerUnit.chinese} Minimum Cost per unit</th>
            <th>{L10n.minCostPerJob.chinese} Minimum Cost per job</th>
            <th>{L10n.costcutoverUnitQuantity.chinese} Cost cutover unit quantity</th>
            <th>{L10n.costPerUnit.chinese} Cost per unit</th>
            <th>{L10n.cost.chinese} / {exampleUnitQuantity || 0} {L10n.unit.chinese} Cost per {exampleUnitQuantity || 0}<br/>unit job</th>
            <th>{L10n.remove.chinese} Delete</th>
            <th>{L10n.add.chinese} Add</th>
          </tr>
        </thead>
        <tbody>
          {itemOutsourcings.length === 0 ? itemOutsourcingsEmptyRowFrag : itemOutsourcingsRowsFrag}
          {itemOutsourcingsTotalRowFrag}
        </tbody>
      </Table>
    </>
  );
}

export default ItemOutsourcings;
