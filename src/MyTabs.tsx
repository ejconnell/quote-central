import { useEffect, useState } from "react";
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

// importing from @aws-sdk/credential-provider-cognito-identity instead of @aws-sdk/credential-providers because the latter causes loading errors in Vite.
// import { fromCognitoIdentityPool } from "@aws-sdk/credential-providers";
import { fromCognitoIdentityPool } from "@aws-sdk/credential-provider-cognito-identity";

const log = (msg: string) => console.log(`[MyTabs] ${msg}`);

import {
  DynamoDBClient,
} from "@aws-sdk/client-dynamodb";

import {
  DynamoDBDocumentClient,
  PutCommand,
  DeleteCommand,
  paginateScan,
} from "@aws-sdk/lib-dynamodb";

import { AuthContextProps, useAuth } from "react-oidc-context";
import { IInHouse, IItem, IMaterial, IMetal, IMetalFamily, IOutsourcing, IQuote, IStandardSetup, ICustomer } from "./Types";

async function loadMetalFamilies(ddbDocClient: DynamoDBDocumentClient, setMetalFamilies: (metalFamilies: IMetalFamily[]) => void) {
  await loadTable(ddbDocClient, setMetalFamilies, "MetalFamilies")
};

async function loadMetals(ddbDocClient: DynamoDBDocumentClient, setMetals: (metals: IMetal[]) => void) {
  await loadTable(ddbDocClient, setMetals, "Metals")
};

async function loadMaterials(
  ddbDocClient: DynamoDBDocumentClient,
  setMaterials: (materials: IMaterial[]) => void
) {
  await loadTable(ddbDocClient, setMaterials, "Materials");
};

async function loadStandardSetups(
  ddbDocClient: DynamoDBDocumentClient,
  setStandardSetups: (standardSetups: IStandardSetup[]) => void
) {
  await loadTable(ddbDocClient, setStandardSetups, "StandardSetups");
};

async function loadInHouses(
  ddbDocClient: DynamoDBDocumentClient,
  setInHouses: (inHouses: IInHouse[]) => void
) {
  await loadTable(ddbDocClient, setInHouses, "InHouses");
};

async function loadOutsourcings(
  ddbDocClient: DynamoDBDocumentClient,
  setOutsourcings: (outsourcings: IOutsourcing[]) => void
) {
  await loadTable(ddbDocClient, setOutsourcings, "Outsourcings");
};

async function loadItems(
  ddbDocClient: DynamoDBDocumentClient,
  setItems: (items: IItem[]) => void
) {
  await loadTable(ddbDocClient, setItems, "Items");
};

async function loadCustomers(
  ddbDocClient: DynamoDBDocumentClient,
  setCustomers: (customers: ICustomer[]) => void
) {
  await loadTable(ddbDocClient, setCustomers, "Customers");
};

async function loadQuotes(
  ddbDocClient: DynamoDBDocumentClient,
  setQuotes: (quotes: IQuote[]) => void
) {
  function sortCompare(a: IQuote, b: IQuote): number {
    return b.timestamp - a.timestamp;
  }
  await loadTable(ddbDocClient, setQuotes, "Quotes", sortCompare);
};

interface hasName {
  name: string;
}

function nameSortCompare(a: hasName, b: hasName): number {
  return a.name.localeCompare(b.name)
}

async function loadTable<T>(ddbDocClient: DynamoDBDocumentClient, setter: (things: T[]) => void, tableName: string, sortCompare: (a: any, b: any) => number = nameSortCompare) {
  log(`loadTable("${tableName}")`)
  const paginatedScan = paginateScan(
    { client: ddbDocClient },
    {
      TableName: tableName,
      ConsistentRead: true,
    },
  );
  const acc: T[] = [];
  for await (const page of paginatedScan) {
    acc.push(...(page.Items as T[]));
  }
  acc.sort(sortCompare);
  setter(acc);
}

function getAwsCreds(auth: AuthContextProps) {
  //const auth = useAuth();
  const COGNITO_ID: string = "cognito-idp.ap-southeast-2.amazonaws.com/ap-southeast-2_VQ0eXINVn";

  return fromCognitoIdentityPool({
    clientConfig: { region: "ap-southeast-2"},
    identityPoolId: 'ap-southeast-2:17fb9941-a165-4da3-ba04-66cf16623c07',
    logins: {
       [COGNITO_ID]: String(auth.user?.id_token),
    },
  })
}



function MyTabs() {
  const [loadsComplete, setFetchesComplete] = useState<boolean>(false);
  const [customers, setCustomers] = useState<Array<ICustomer>>([]);
  const [materials, setMaterials] = useState<Array<IMaterial>>([]);
  const [metals, setMetals] = useState<Array<IMetal>>([]);
  const [metalFamilies, setMetalFamilies] = useState<Array<IMetalFamily>>([]);
  const [standardSetups, setStandardSetups] = useState<Array<IStandardSetup>>([]);
  const [inHouses, setInHouses] = useState<Array<IInHouse>>([]);
  const [outsourcings, setOutsourcings] = useState<Array<IOutsourcing>>([]);
  const [items, setItems] = useState<Array<IItem>>([]);
  const [quotes, setQuotes] = useState<Array<IQuote>>([]);

  const auth = useAuth();

  const client = new DynamoDBClient({
    region: "ap-southeast-2",
    credentials: getAwsCreds(auth),
  });
  const ddbDocClient = DynamoDBDocumentClient.from(client);

  useEffect(() => {
    Promise.all([
      loadCustomers(ddbDocClient, setCustomers),
      loadMetalFamilies(ddbDocClient, setMetalFamilies),
      loadMetals(ddbDocClient, setMetals),
      loadMaterials(ddbDocClient, setMaterials),
      loadStandardSetups(ddbDocClient, setStandardSetups),
      loadInHouses(ddbDocClient, setInHouses),
      loadOutsourcings(ddbDocClient, setOutsourcings),
      loadItems(ddbDocClient, setItems),
      loadQuotes(ddbDocClient, setQuotes),
    ]).then(() => setFetchesComplete(true));
  }, [])

  async function saveMetalFamily(metalFamily: IMetalFamily) {
    log("saveMetalFamily() " + metalFamily.name)
    const response = await ddbDocClient.send(new PutCommand({
      TableName: "MetalFamilies",
      Item: {
         name: metalFamily.name,
      },
    }));
    log(JSON.stringify(response));
    loadMetalFamilies(ddbDocClient, setMetalFamilies);
  }

  async function deleteMetalFamily(name: string) {
    const response = await ddbDocClient.send(new DeleteCommand({
      TableName: "MetalFamilies",
      Key: {
        name: name,
      },
    }));
    log(JSON.stringify(response));
    loadMetalFamilies(ddbDocClient, setMetalFamilies);
  }

  async function saveMetal(metal: IMetal) {
    log("saveMetal() " + metal.name)
    const response = await ddbDocClient.send(new PutCommand({
      TableName: "Metals",
      Item: metal,
    }));
    log(JSON.stringify(response));
    loadMetals(ddbDocClient, setMetals)
  }

  async function deleteMetal(name: string) {
    const response = await ddbDocClient.send(new DeleteCommand({
      TableName: "Metals",
      Key: {
        name: name,
      },
    }));
    log(JSON.stringify(response));
    loadMetals(ddbDocClient, setMetals);
  }

  async function saveMaterial(material: IMaterial) {
    log("saveMaterial() " + material.name)
    const response = await ddbDocClient.send(new PutCommand({
      TableName: "Materials",
      Item: material,
    }));
    log(JSON.stringify(response));
    loadMaterials(ddbDocClient, setMaterials)
  }

  async function deleteMaterial(name: string) {
    const response = await ddbDocClient.send(new DeleteCommand({
      TableName: "Materials",
      Key: {
        name: name,
      },
    }));
    log(JSON.stringify(response));
    loadMaterials(ddbDocClient, setMaterials);
  }

  async function saveStandardSetup(standardSetup: IStandardSetup) {
    log("saveStandardSetup() " + standardSetup.name)
    const response = await ddbDocClient.send(new PutCommand({
      TableName: "StandardSetups",
      Item: standardSetup,
    }));
    log(JSON.stringify(response));
    loadStandardSetups(ddbDocClient, setStandardSetups);
  }

  async function deleteStandardSetup(name: string) {
    const response = await ddbDocClient.send(new DeleteCommand({
      TableName: "StandardSetups",
      Key: {
        name: name,
      },
    }));
    log(JSON.stringify(response));
    loadStandardSetups(ddbDocClient, setStandardSetups);
  }

  async function saveCustomer(customer: ICustomer) {
    log("saveCustomers() " + customer.name)
    const response = await ddbDocClient.send(new PutCommand({
      TableName: "Customers",
      Item: customer,
    }));
    log(JSON.stringify(response));
    loadCustomers(ddbDocClient, setCustomers);
  }

  async function deleteCustomer(name: string) {
    const response = await ddbDocClient.send(new DeleteCommand({
      TableName: "Customers",
      Key: {
        name: name,
      },
    }));
    log(JSON.stringify(response));
    loadCustomers(ddbDocClient, setCustomers);
  }

  async function saveInHouse(inHouse: IInHouse) {
    log("saveInHouse() " + inHouse.name)
    const response = await ddbDocClient.send(new PutCommand({
      TableName: "InHouses",
      Item: inHouse,
    }));
    log(JSON.stringify(response));
    loadInHouses(ddbDocClient, setInHouses);
  }

  async function deleteInHouse(name: string) {
    const response = await ddbDocClient.send(new DeleteCommand({
      TableName: "InHouses",
      Key: {
        name: name,
      },
    }));
    log(JSON.stringify(response));
    loadInHouses(ddbDocClient, setInHouses);
  }

  async function saveOutsourcing(outsourcing: IOutsourcing) {
    log("saveOutsourcing() " + outsourcing.name)
    const response = await ddbDocClient.send(new PutCommand({
      TableName: "Outsourcings",
      Item: outsourcing,
    }));
    log(JSON.stringify(response));
    loadOutsourcings(ddbDocClient, setOutsourcings);
  }

  async function deleteOutsourcing(name: string) {
    const response = await ddbDocClient.send(new DeleteCommand({
      TableName: "Outsourcings",
      Key: {
        name: name,
      },
    }));
    log(JSON.stringify(response));
    loadOutsourcings(ddbDocClient, setOutsourcings);
  }

  async function saveItem(item: IItem) {
    log("saveItem() " + item.name)
    const response = await ddbDocClient.send(new PutCommand({
      TableName: "Items",
      Item: item,
    }));
    log(JSON.stringify(response));
    loadItems(ddbDocClient, setItems);
  }

  async function deleteItem(name: string) {
    const response = await ddbDocClient.send(new DeleteCommand({
      TableName: "Items",
      Key: {
        name: name,
      },
    }));
    log(JSON.stringify(response));
    loadItems(ddbDocClient, setItems);
  }

  async function saveQuote(quote: IQuote) {
    log(`saveQuote() ${quote.customerName} - ${quote.timestamp}`);
    const response = await ddbDocClient.send(new PutCommand({
      TableName: "Quotes",
      Item: quote,
    }));
    log(JSON.stringify(response));
    loadQuotes(ddbDocClient, setQuotes);
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
        />
      </Tab>
      <Tab eventKey="items" title={tabTitle(TabLabels.item)}>
        <Items
          items={items}
          materials={materials}
          metals={metals}
          standardSetups={standardSetups}
          inHouses={inHouses}
          outsourcings={outsourcings}
          customers={customers}
          quotes={quotes}
          saveItem={saveItem}
          deleteItem={deleteItem}
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
    </Tabs>
  </>);
}

export default MyTabs;
