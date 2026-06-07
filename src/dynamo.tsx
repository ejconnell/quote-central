// importing from @aws-sdk/credential-provider-cognito-identity instead of @aws-sdk/credential-providers because the latter causes loading errors in Vite.
// import { fromCognitoIdentityPool } from "@aws-sdk/credential-providers";
import { fromCognitoIdentityPool } from "@aws-sdk/credential-provider-cognito-identity";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DeleteCommand,
  DynamoDBDocumentClient,
  paginateScan,
  PutCommand,
} from "@aws-sdk/lib-dynamodb";
import { AuthContextProps } from "react-oidc-context";
import {
  ICustomer,
  IInHouse,
  IItem,
  IItemVersions,
  IMaterial,
  IMetal,
  IMetalFamily,
  IOutsourcing,
  IQuote,
  IStandardSetup,
} from "./Types";

const log = (msg: string) => console.log(`[dynamo] ${msg}`);

interface HasName {
  name: string;
}

function nameSortCompare(a: HasName, b: HasName): number {
  return a.name.localeCompare(b.name);
}

function getAwsCreds(auth: AuthContextProps) {
  const COGNITO_ID: string =
    "cognito-idp.ap-southeast-2.amazonaws.com/ap-southeast-2_VQ0eXINVn";

  return fromCognitoIdentityPool({
    clientConfig: { region: "ap-southeast-2" },
    identityPoolId: "ap-southeast-2:17fb9941-a165-4da3-ba04-66cf16623c07",
    logins: {
      [COGNITO_ID]: String(auth.user?.id_token),
    },
  });
}

export class DynamoDao {
  private readonly ddbDocClient: DynamoDBDocumentClient;

  constructor(auth: AuthContextProps) {
    const client = new DynamoDBClient({
      region: "ap-southeast-2",
      credentials: getAwsCreds(auth),
    });
    this.ddbDocClient = DynamoDBDocumentClient.from(client);
  }

  loadMetalFamilies() {
    return this.loadTable<IMetalFamily>("MetalFamilies");
  }

  loadMetals() {
    return this.loadTable<IMetal>("Metals");
  }

  loadMaterials() {
    return this.loadTable<IMaterial>("Materials");
  }

  loadStandardSetups() {
    return this.loadTable<IStandardSetup>("StandardSetups");
  }

  loadInHouses() {
    return this.loadTable<IInHouse>("InHouses");
  }

  loadOutsourcings() {
    return this.loadTable<IOutsourcing>("Outsourcings");
  }

  loadItems() {
    return this.loadTable<IItem>("Items");
  }

  async loadItemVersions(): Promise<IItemVersions> {
    const paginatedScan = paginateScan(
      { client: this.ddbDocClient },
      {
        TableName: "ItemVersions",
        ConsistentRead: true,
      },
    );
    const acc: IItemVersions = {};
    for await (const page of paginatedScan) {
      for (const item of page.Items as IItem[]) {
        if (!acc[item.name]) {
          acc[item.name] = [];
        }
        acc[item.name].push(item);
      }
    }
    function sortByVersion(a: IItem, b: IItem): number {
      return b.version - a.version;
    }
    for (const itemName in acc) {
      acc[itemName].sort(sortByVersion);
    }
    return acc;
  }

  loadCustomers() {
    return this.loadTable<ICustomer>("Customers");
  }

  loadQuotes() {
    function sortCompare(a: IQuote, b: IQuote): number {
      return b.timestamp - a.timestamp;
    }
    return this.loadTable<IQuote>("Quotes", sortCompare);
  }

  async saveMetalFamily(metalFamily: IMetalFamily) {
    log("saveMetalFamily() " + metalFamily.name);
    const response = await this.ddbDocClient.send(
      new PutCommand({
        TableName: "MetalFamilies",
        Item: {
          name: metalFamily.name,
        },
      }),
    );
    log(JSON.stringify(response));
    return this.loadMetalFamilies();
  }

  async deleteMetalFamily(name: string) {
    const response = await this.deleteByName("MetalFamilies", name);
    log(JSON.stringify(response));
    return this.loadMetalFamilies();
  }

  async saveMetal(metal: IMetal) {
    log("saveMetal() " + metal.name);
    const response = await this.putItem("Metals", metal);
    log(JSON.stringify(response));
    return this.loadMetals();
  }

  async deleteMetal(name: string) {
    const response = await this.deleteByName("Metals", name);
    log(JSON.stringify(response));
    return this.loadMetals();
  }

  async saveMaterial(material: IMaterial) {
    log("saveMaterial() " + material.name);
    const response = await this.putItem("Materials", material);
    log(JSON.stringify(response));
    return this.loadMaterials();
  }

  async deleteMaterial(name: string) {
    const response = await this.deleteByName("Materials", name);
    log(JSON.stringify(response));
    return this.loadMaterials();
  }

  async saveStandardSetup(standardSetup: IStandardSetup) {
    log("saveStandardSetup() " + standardSetup.name);
    const response = await this.putItem("StandardSetups", standardSetup);
    log(JSON.stringify(response));
    return this.loadStandardSetups();
  }

  async deleteStandardSetup(name: string) {
    const response = await this.deleteByName("StandardSetups", name);
    log(JSON.stringify(response));
    return this.loadStandardSetups();
  }

  async saveCustomer(customer: ICustomer) {
    log("saveCustomers() " + customer.name);
    const response = await this.putItem("Customers", customer);
    log(JSON.stringify(response));
    return this.loadCustomers();
  }

  async deleteCustomer(name: string) {
    const response = await this.deleteByName("Customers", name);
    log(JSON.stringify(response));
    return this.loadCustomers();
  }

  async saveInHouse(inHouse: IInHouse) {
    log("saveInHouse() " + inHouse.name);
    const response = await this.putItem("InHouses", inHouse);
    log(JSON.stringify(response));
    return this.loadInHouses();
  }

  async deleteInHouse(name: string) {
    const response = await this.deleteByName("InHouses", name);
    log(JSON.stringify(response));
    return this.loadInHouses();
  }

  async saveOutsourcing(outsourcing: IOutsourcing) {
    log("saveOutsourcing() " + outsourcing.name);
    const response = await this.putItem("Outsourcings", outsourcing);
    log(JSON.stringify(response));
    return this.loadOutsourcings();
  }

  async deleteOutsourcing(name: string) {
    const response = await this.deleteByName("Outsourcings", name);
    log(JSON.stringify(response));
    return this.loadOutsourcings();
  }

  async saveItem(item: IItem) {
    log("saveItem() " + item.name);
    const response = await this.putItem("Items", item);
    log(JSON.stringify(response));
    return this.loadItems();
  }

  async deleteItem(name: string) {
    const response = await this.deleteByName("Items", name);
    log(JSON.stringify(response));
    return this.loadItems();
  }

  async saveItemVersion(item: IItem) {
    log("saveItemVersion() " + item.name);
    const response = await this.putItem("ItemVersions", item);
    log(JSON.stringify(response));
    return this.loadItemVersions();
  }

  async saveQuote(quote: IQuote) {
    log(`saveQuote() ${quote.customerName} - ${quote.timestamp}`);
    const response = await this.putItem("Quotes", quote);
    log(JSON.stringify(response));
    return this.loadQuotes();
  }

  private async loadTable<T>(
    tableName: string,
    sortCompare?: (a: T, b: T) => number,
  ): Promise<T[]> {
    log(`loadTable("${tableName}")`);
    const paginatedScan = paginateScan(
      { client: this.ddbDocClient },
      {
        TableName: tableName,
        ConsistentRead: true,
      },
    );
    const acc: T[] = [];
    for await (const page of paginatedScan) {
      acc.push(...(page.Items as T[]));
    }
    acc.sort(sortCompare ?? ((a, b) => nameSortCompare(a as HasName, b as HasName)));
    return acc;
  }

  private putItem<T>(tableName: string, item: T) {
    return this.ddbDocClient.send(
      new PutCommand({
        TableName: tableName,
        Item: item as Record<string, unknown>,
      }),
    );
  }

  private deleteByName(tableName: string, name: string) {
    return this.ddbDocClient.send(
      new DeleteCommand({
        TableName: tableName,
        Key: {
          name: name,
        },
      }),
    );
  }
}
