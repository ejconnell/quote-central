export interface IMetal {
  name: string;
  density: string;
  metalFamilyName: string;
  latheCostPerThousand: string;
}

export interface IMetalFamily {
  name: string;
}

export interface IMaterial {
  name: string;
  isNameManual: boolean;
  metalName: string;
  shapeName: string;
  width: string;
  innerWidth: string;
  rawCost: string;
  markup: string;
}

export interface IStandardSetup {
  name: string;
}

export interface IInHouse {
  name: string;
  cost: string;
}

export interface IOutsourcing {
  name: string;
  isPricedByUnit: boolean;
  minCostPerJob: string;
  variableCost: string;
}

export interface ICustomer {
  name: string;
}

export interface IItem {
  name: string;
  createdBy: string;
  timestamp: number;
  version: number;
  customerName: string;
  materialName: string;
  unitLength: string;
  itemInHouses: IItemInHouse[];
  itemOutsourcings: IItemOutsourcing[];
  itemOverheadRanges: IItemOverheadRange[];
  itemSetups: IItemSetup[];
  itemWastageRanges: IItemWastageRange[];
}

export interface IItemInHouse {
  name: string;
  key: string;
  quantity: string;
}

export interface IItemOutsourcing {
  name: string;
  key: string;
  gramsPerUnit: string;
}

export interface ILookupRange {
  key: string;
  starting: number;
  ending: number;
  value: string;
}

export interface IItemOverheadRange extends ILookupRange {}

export interface IItemWastageRange extends ILookupRange {}

export interface IItemSetup {
  key: string;
  standardName: string;
  customName: string;
  isCustomName: boolean;
  costPerJob: string;
}

export interface IItemInHouseModelRow {
  costPer1k: number;
  costPerUnit: number;
}

export interface IItemOutsourcingModelRow {
  minCostPerUnit: number;
  minCostPerKilogram: number;
  costCutoverUnitQuantity: number;
  costPerUnit: number;
  costPerJob: number;
}

export interface IQuote {
  customerName: string;
  timestamp: number;
  createdBy: string;
  quoteItems: IQuoteItem[];
  quoteItemsModelResults: IQuoteItemModelResult[];
}

export interface IQuoteItem {
  name: string;
  quantity: string;
  key: string
}

export interface IQuoteItemModelResult {
  materialCostPerUnit: number;
  inHouseCostPerUnit: number;
  outsourcingCostPerUnit: number;
  baseCostPerUnit: number;
  wastagePercent: number;
  postWastageCostPerUnit: number;
  postLaborCostPerUnit: number;
  setupCostPerUnit: number;
  postSetupCostPerUnit: number;
  postTaxCostPerUnit: number;
  overheadPercent: number;
  postOverheadCostPerUnit: number;
  postProfitCostPerUnit: number;
}
export type IItemVersions = { [itemName: string]: IItem[]; };
