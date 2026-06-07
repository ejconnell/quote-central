import { useState } from "react";
import Table from 'react-bootstrap/Table';
import Trifold from "./Trifold";
import L10n from "./L10n";
import { TabLabels } from "./TabLabels";
import { ICustomer, IItem, IQuote } from "./Types";

function Customers({customers, quotes, items, saveCustomer, deleteCustomer}: {customers: ICustomer[], quotes: IQuote[], items: IItem[], saveCustomer: (customer: ICustomer) => void, deleteCustomer: (name: string) => void}) {
  const [name, setName] = useState<string>("");

  const quoteCounts: { [key: string]: number } = {};
  quotes.forEach((quote) => {
    quoteCounts[quote.customerName] = (quoteCounts[quote.customerName] || 0) + 1;
  });
  const itemCounts: { [key: string]: number } = {};
  items.forEach((item) => {
    itemCounts[item.customerName] = (itemCounts[item.customerName] || 0) + 1;
  });

  function handleSaveCustomer() {
    if (!name) {
      alert("Need a name");
      return;
    }
    saveCustomer({
      name: name,
    });
  }

  function handleLoadCustomer(index: number) {
    const customer = customers[index];
    setName(customer.name);
  }

  const tableRows = customers.map((customer, i) => {
    const deleteCustomerButton = <button type="button" onClick={() => deleteCustomer(customer.name)}>{L10n.delete.chinese}Delete</button>;
    return <tr key={customer.name}>
      <td>{customer.name}</td>
      <td><button type="button" onClick={() => handleLoadCustomer(i)}>{L10n.load.chinese}Load</button></td>
      <td>{quoteCounts[customer.name] || 0}</td>
      <td>{itemCounts[customer.name] || 0}</td>
      <td>{(!(quoteCounts[customer.name] || itemCounts[customer.name])) &&deleteCustomerButton}</td>
    </tr>
  });

  const allCustomersFrag = (<>
    <Table bordered striped>
      <thead>
        <tr>
          <th>{L10n.name.chinese} Name</th>
          <th>{L10n.load.chinese} Load</th>
          <th>{L10n.quote.chinese}{L10n.quantity.chinese} Num Quotes</th>
          <th>{L10n.item.chinese}{L10n.quantity.chinese} Num Items</th>
          <th>{L10n.deleteIfUnused.chinese} Delete If Unused</th>
        </tr>
      </thead>
      <tbody>
        {tableRows}
      </tbody>
    </Table>
  </>);

  const currentCustomerFrag = (<>
    <label>{L10n.name.chinese} Name:</label>
    <input value={name} onChange={(e) => setName(e.target.value)}/>
    <br/>
    <button type="submit" onClick={handleSaveCustomer}>
      {L10n.save.chinese}{L10n.customer.chinese} Save Customer
    </button>
  </>);

  return (<>
    <Trifold
      top={allCustomersFrag}
      middle={currentCustomerFrag}
      bottom={<></>}
      label={TabLabels.customer}
    />
  </>);
}
export default Customers;