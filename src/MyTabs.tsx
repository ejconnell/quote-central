import { useEffect, useMemo, useState } from "react";
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import InHouses from './InHouses.tsx';
import Items from './Items.tsx';
import Materials from './Materials.tsx';
import MetalFamilies from './MetalFamilies.tsx';
import Metals from './Metals.tsx';
import Outsourcings from './Outsourcings.tsx';
import Quotes from './Quotes.tsx';
import StandardSetups from './StandardSetups.tsx';
import Customers from "./Customers.tsx";
import { ITabLabel, TabLabels } from "./TabLabels.tsx";
import { useAuth } from "react-oidc-context";
import { IInHouse, IItem, IMaterial, IMetal, IMetalFamily, IOutsourcing, IQuote, IStandardSetup, ICustomer } from "./Types";
import { DynamoDao } from "./dynamo.tsx";
import { IItemVersions } from "./Types.ts";

function MyTabs() {
  const [loadsComplete, setLoadsComplete] = useState<boolean>(false);
  const [customers, setCustomers] = useState<Array<ICustomer>>([]);
  const [materials, setMaterials] = useState<Array<IMaterial>>([]);
  const [metals, setMetals] = useState<Array<IMetal>>([]);
  const [metalFamilies, setMetalFamilies] = useState<Array<IMetalFamily>>([]);
  const [standardSetups, setStandardSetups] = useState<Array<IStandardSetup>>([]);
  const [inHouses, setInHouses] = useState<Array<IInHouse>>([]);
  const [outsourcings, setOutsourcings] = useState<Array<IOutsourcing>>([]);
  const [items, setItems] = useState<Array<IItem>>([]);
  const [itemVersions, setItemVersions] = useState<IItemVersions>({});
  const [quotes, setQuotes] = useState<Array<IQuote>>([]);

  const auth = useAuth();
  const email = auth.user?.profile.email || "unknown";

  const dynamoDao = useMemo(() => new DynamoDao(auth), [auth]);

  useEffect(() => {
    Promise.all([
      dynamoDao.loadCustomers().then(setCustomers),
      dynamoDao.loadMetalFamilies().then(setMetalFamilies),
      dynamoDao.loadMetals().then(setMetals),
      dynamoDao.loadMaterials().then(setMaterials),
      dynamoDao.loadStandardSetups().then(setStandardSetups),
      dynamoDao.loadInHouses().then(setInHouses),
      dynamoDao.loadOutsourcings().then(setOutsourcings),
      dynamoDao.loadItems().then(setItems),
      dynamoDao.loadItemVersions().then(setItemVersions),
      dynamoDao.loadQuotes().then(setQuotes),
    ]).then(() => setLoadsComplete(true));
  }, [dynamoDao])

  async function saveMetalFamily(metalFamily: IMetalFamily) {
    setMetalFamilies(await dynamoDao.saveMetalFamily(metalFamily));
  }

  async function deleteMetalFamily(name: string) {
    setMetalFamilies(await dynamoDao.deleteMetalFamily(name));
  }

  async function saveMetal(metal: IMetal) {
    setMetals(await dynamoDao.saveMetal(metal));
  }

  async function deleteMetal(name: string) {
    setMetals(await dynamoDao.deleteMetal(name));
  }

  async function saveMaterial(material: IMaterial) {
    setMaterials(await dynamoDao.saveMaterial(material));
  }

  async function deleteMaterial(name: string) {
    setMaterials(await dynamoDao.deleteMaterial(name));
  }

  async function saveStandardSetup(standardSetup: IStandardSetup) {
    setStandardSetups(await dynamoDao.saveStandardSetup(standardSetup));
  }

  async function deleteStandardSetup(name: string) {
    setStandardSetups(await dynamoDao.deleteStandardSetup(name));
  }

  async function saveCustomer(customer: ICustomer) {
    setCustomers(await dynamoDao.saveCustomer(customer));
  }

  async function deleteCustomer(name: string) {
    setCustomers(await dynamoDao.deleteCustomer(name));
  }

  async function saveInHouse(inHouse: IInHouse) {
    setInHouses(await dynamoDao.saveInHouse(inHouse));
  }

  async function deleteInHouse(name: string) {
    setInHouses(await dynamoDao.deleteInHouse(name));
  }

  async function saveOutsourcing(outsourcing: IOutsourcing) {
    setOutsourcings(await dynamoDao.saveOutsourcing(outsourcing));
  }

  async function deleteOutsourcing(name: string) {
    setOutsourcings(await dynamoDao.deleteOutsourcing(name));
  }

  async function saveItem(item: IItem) {
    setItems(await dynamoDao.saveItem(item));
  }

  async function deleteItem(name: string) {
    setItems(await dynamoDao.deleteItem(name));
  }

  async function saveItemVersion(item: IItem) {
    setItemVersions(await dynamoDao.saveItemVersion(item));
  }

  async function saveQuote(quote: IQuote) {
    setQuotes(await dynamoDao.saveQuote(quote));
  }

  if (!loadsComplete) {
    return <h1>載入中 Loading...</h1>
  }

  function tabTitle(label: ITabLabel) {
    return `${label.chinese} ${label.plural}`;
  }

  return (<>
    <Tabs
      defaultActiveKey="quotes"
    >
      <Tab eventKey="quotes" title={tabTitle(TabLabels.quote)}>
        <Quotes
          quotes={quotes}
          items={items}
          materials={materials}
          metals={metals}
          inHouses={inHouses}
          outsourcings={outsourcings}
          customers={customers}
          saveQuote={saveQuote}
          email={email}
        />
      </Tab>
      <Tab eventKey="items" title={tabTitle(TabLabels.item)}>
        <Items
          items={items}
          itemVersions={itemVersions}
          materials={materials}
          metals={metals}
          standardSetups={standardSetups}
          inHouses={inHouses}
          outsourcings={outsourcings}
          customers={customers}
          quotes={quotes}
          saveItem={saveItem}
          deleteItem={deleteItem}
          saveItemVersion={saveItemVersion}
          email={email}
        />
      </Tab>
      <Tab eventKey="materials" title={tabTitle(TabLabels.material)}>
        <Materials
          materials={materials}
          metals={metals}
          metalFamilies={metalFamilies}
          items={items}
          saveMaterial={saveMaterial}
          deleteMaterial={deleteMaterial}
        />
      </Tab>
      <Tab eventKey="metals" title={tabTitle(TabLabels.metal)}>
        <Metals
          metals={metals}
          metalFamilies={metalFamilies}
          materials={materials}
          saveMetal={saveMetal}
          deleteMetal={deleteMetal}
        />
      </Tab>
      <Tab eventKey="metalFamilies" title={tabTitle(TabLabels.metalFamily)}>
        <MetalFamilies
          metalFamilies={metalFamilies}
          metals={metals}
          saveMetalFamily={saveMetalFamily}
          deleteMetalFamily={deleteMetalFamily}
        />
      </Tab>
      <Tab eventKey="inHouses" title={tabTitle(TabLabels.inHouse)}>
        <InHouses
          inHouses={inHouses}
          items={items}
          saveInHouse={saveInHouse}
          deleteInHouse={deleteInHouse}
        />
      </Tab>
      <Tab eventKey="outsourcings" title={tabTitle(TabLabels.outsourcing)}>
        <Outsourcings
          outsourcings={outsourcings}
          items={items}
          saveOutsourcing={saveOutsourcing}
          deleteOutsourcing={deleteOutsourcing}
        />
      </Tab>
      <Tab eventKey="standardSetups" title={tabTitle(TabLabels.standardSetup)}>
        <StandardSetups
          standardSetups={standardSetups}
          items={items}
          saveStandardSetup={saveStandardSetup}
          deleteStandardSetup={deleteStandardSetup}
        />
      </Tab>
      <Tab eventKey="customers" title={tabTitle(TabLabels.customer)}>
        <Customers
          customers={customers}
          quotes={quotes}
          items={items}
          saveCustomer={saveCustomer}
          deleteCustomer={deleteCustomer}
        />
      </Tab>
      <Tab title={`你好 Hello ${email}`}>
          <></>
      </Tab>
    </Tabs>
  </>);
}

export default MyTabs;
