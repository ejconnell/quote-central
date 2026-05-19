import { ItemInHousesModel } from "./ItemInHouses";
import { ItemOutsourcingsModel } from "./ItemOutsourcings";
import { ItemOverheadModel } from "./ItemOverhead";
import { ItemSetupsModel } from "./ItemSetups";
import { ItemWastageModel } from "./ItemWastage";
import { MaterialModel } from "./MaterialModel";
import { blankMaterial } from "./Materials";
import { IInHouse, IItemInHouse, IItemOutsourcing, IItemOverheadRange, IItemSetup, IItemWastageRange, IMaterial, IMetal, IOutsourcing } from "./Types";


export class ItemModel {
  gramsPerUnit: number;
  gramsPerUnitIncludingWastage: number;
  materialCostPerUnit: number;
  inHouseCostPerUnit: number;
  outsourcingCostPerUnit: number;
  setupCostPerUnit: number;
  wastagePercent: number;
  overheadPercent: number;
  metalName: string;
  latheCostPerThousand: number;
  constructor({ materials, metals, inHouses, outsourcings, materialName, unitLength, itemSetups, itemInHouses, itemWastageRanges, itemOverheadRanges, itemOutsourcings, unitQuantity }:{ materials: IMaterial[], metals: IMetal[], inHouses: IInHouse[], outsourcings: IOutsourcing[], materialName: string, unitLength: string, itemSetups: IItemSetup[], itemInHouses: IItemInHouse[], itemWastageRanges: IItemWastageRange[], itemOverheadRanges: IItemOverheadRange[], itemOutsourcings: IItemOutsourcing[], unitQuantity: number }) {
    const material = materials.find(m => m.name === materialName) || blankMaterial();
    const materialModel = new MaterialModel({ metals: metals, ...material });
    this.metalName = material?.metalName || "";
    this.latheCostPerThousand = Number(metals.find(m => m.name === this.metalName)?.latheCostPerThousand) || 0;

    const itemInHousesModel = new ItemInHousesModel(inHouses, itemInHouses, this.latheCostPerThousand);
    const itemOutsourcingsModel = new ItemOutsourcingsModel(outsourcings, itemOutsourcings, unitQuantity);
    const itemWastageModel = new ItemWastageModel(itemWastageRanges, unitQuantity);
    const lowQuantityItemWastageModel = new ItemWastageModel(itemWastageRanges, 1 /* single unit */);
    const itemSetupsModel = new ItemSetupsModel(itemSetups, unitQuantity);
    const itemOverheadModel = new ItemOverheadModel(itemOverheadRanges, unitQuantity);
    this.gramsPerUnit = unitLength === "" ? Number.NaN : Number(unitLength) * materialModel.weightPerMm;
    this.gramsPerUnitIncludingWastage = this.gramsPerUnit * (1 + lowQuantityItemWastageModel.value / 100);
    this.materialCostPerUnit = this.gramsPerUnit * materialModel.effectiveCost / 1000;
    this.inHouseCostPerUnit = itemInHousesModel.totalCostPerUnit;
    this.outsourcingCostPerUnit = itemOutsourcingsModel.totalCostPerUnit;
    this.wastagePercent = itemWastageModel.value;
    this.setupCostPerUnit = itemSetupsModel.totalCostPerUnit;
    this.overheadPercent = itemOverheadModel.value;
  }
}
