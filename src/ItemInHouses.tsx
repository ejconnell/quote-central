import Table from 'react-bootstrap/Table';
import L10n from './L10n'
import { IInHouse, IItemInHouse, IItemInHouseModelRow } from './Types';

const Lathe = "lathe";

export class ItemInHousesModel {
  totalCostPerUnit: number;
  rows: IItemInHouseModelRow[];
  constructor(inHouses: IInHouse[], itemInHouses: IItemInHouse[], latheCostPerThousand: number) {
    this.rows = itemInHouses.map(iih => {
      const quantity = Number(iih.quantity);
      const costPer1k = iih.name === Lathe ? latheCostPerThousand : Number(inHouses.find(ih => ih.name === iih.name)?.cost);
      const costPerUnit = iih.quantity === "" ? Number.NaN : costPer1k * quantity / 1000;
      return {
        costPer1k: costPer1k,
        costPerUnit: costPerUnit,
      }
    });

    this.totalCostPerUnit = this.rows.map(row => row.costPerUnit).reduce((acc, cost) => acc+cost, 0);
  }
}

function ItemInHouses({inHouses, itemInHouses, metalName, latheCostPerThousand, setItemInHouses}: {inHouses: IInHouse[], itemInHouses: IItemInHouse[], metalName: string, latheCostPerThousand: number, setItemInHouses: (itemInHouses: IItemInHouse[]) => void}) {
  const iihModel = new ItemInHousesModel(inHouses, itemInHouses, latheCostPerThousand);

  function handleItemInHouseNameChange(value: string, index: number) {
    const nextItemInHouses = itemInHouses.map((iih, i) => {
      if (i === index) {
        return {
          key: iih.key,
          name: value,
          quantity: iih.quantity,
        }
      } else {
        return {...iih};
      }
    });
    setItemInHouses(nextItemInHouses);
  }

  function handleItemInHouseQuantityChange(value: string, index: number) {
    const nextItemInHouses = itemInHouses.map((iih, i) => {
      if (i === index) {
        return {
          key: iih.key,
          name: iih.name,
          quantity: value,
        }
      } else {
        return {...iih};
      }
    });
    setItemInHouses(nextItemInHouses);
  }

  function addItemInHouse(index: number) {
    const nextItemInHouses: IItemInHouse[] = [
      ...itemInHouses.slice(0, index+1),
      {
        key: crypto.randomUUID(),
        name: "",
        quantity: "",
      },
      ...itemInHouses.slice(index+1),
    ];
    setItemInHouses(nextItemInHouses);
  }

  function deleteItemInHouse(index: number) {
    const nextItemInHouses = [
      ...itemInHouses.slice(0, index),
      ...itemInHouses.slice(index+1),
    ];
    setItemInHouses(nextItemInHouses);
  }

  function itemInHouseSelectFrag(index: number) {
    const inHousesSelectOptions = inHouses.map(ih => {
      return <option value={ih.name} key={ih.name}>{ih.name}</option>;
    });
    return <>
      <select
        value={itemInHouses[index].name}
        onChange={e => handleItemInHouseNameChange(e.target.value, index)}
        style={{width: "157px"}}
      >
        <option value=""></option>
        <option value={Lathe}>{L10n.lathe.chinese} Lathe ({metalName})</option>
        {inHousesSelectOptions}
      </select>
    </>;
  }

  const itemInHousesRowsFrag = itemInHouses.map((iih, i) => {
    return <tr key={iih.key}>
      <td>
        {itemInHouseSelectFrag(i)}
      </td>
      <td><input
        name="quantity"
        value={iih.quantity}
        onChange={(e) => handleItemInHouseQuantityChange(e.target.value, i)}
      /></td>
      <td>{iihModel.rows[i].costPer1k}</td>
      <td>{iihModel.rows[i].costPerUnit.toFixed(2)}</td>
      <td><button type="button" onClick={() => deleteItemInHouse(i)}> - </button></td>
      <td><button type="button" onClick={() => addItemInHouse(i)}> + </button></td>
    </tr>
  });
  const itemInHousesEmptyRowFrag = <tr key="empty row">
    <td>&rarr;</td>
    <td>&rarr;</td>
    <td>&rarr;</td>
    <td>&rarr;</td>
    <td>&rarr;</td>
    <td><button type="button" onClick={() => addItemInHouse(-1)}> + </button></td>
  </tr>;
  const itemInHousesTotalRowFrag = <tr key="total row">
    <td><b>Total</b></td>
    <td></td>
    <td></td>
    <td><b>{iihModel.totalCostPerUnit.toFixed(2)}</b></td>
    <td></td>
    <td></td>
  </tr>;

  return (
   <>
    <h4>{L10n.inHouse.chinese} In House:</h4>
    <Table bordered striped>
      <thead>
        <tr>
          <th>{L10n.name.chinese} Name</th>
          <th>{L10n.numberOfSeconds.chinese} Number of Seconds</th>
          <th>{L10n.costPerThousand.chinese} Cost Per 1k Seconds</th>
          <th>{L10n.costPerUnit.chinese} Cost Per Unit</th>
          <th>{L10n.remove.chinese} Delete</th>
          <th>{L10n.add.chinese} Add</th>
        </tr>
      </thead>
      <tbody>
        {itemInHouses.length === 0 ? itemInHousesEmptyRowFrag : itemInHousesRowsFrag}
        {itemInHousesTotalRowFrag}
      </tbody>
    </Table>
   </>
  );
}

export default ItemInHouses;
