import TabLabels from "./TabLabels";

interface L10nEntry {
  chinese: string;
}

const L10n: Record<string, L10nEntry> = {
  ...TabLabels,
  name: {
    chinese: "名稱",
  },
  description: {
    chinese: "描述",
  },
  createdAt : {
    chinese: "建立時間",
  },
  quantity: {
    chinese: "數量",
  },
  summary: {
    chinese: "總結",
  },
  load: {
    chinese: "下載",
  },
  save: {
    chinese: "儲存",
  },
  unit: {
    chinese: "單位",
  },
  cost: {
    chinese: "成本",
  },
  gram: {
    chinese: "克",
  },
  per: {
    chinese: "每",
  },
  length: {
    chinese: "長度",
  },
  exampleUnitQuantity: {
    chinese: "單位數量範例",
  },
  timestamp: {
    chinese: "時間戳",
  },
  baseUnit: {
    chinese: "單價",
  },
  wastage: {
    chinese: "耗損率",
  },
  wastageIncluded: {
    chinese: "單價含耗損",
  },
  laborIncluded: {
    chinese: "單價含費用(3%)",
  },
  setup: {
    chinese: "校車費用",
  },
  setupCost: {
    chinese: "總校車費用",
  },
  setupIncluded: {
    chinese: "單價含校車費",
  },
  taxIncluded: {
    chinese: "單價含稅(3%)",
  },
  overhead: {
    chinese: "管銷率",
  },
  overheadIncluded: {
    chinese: "單價含管銷",
  },
  profitIncluded: {
    chinese: "單價含利潤(6%)",
  },
  included: {
    chinese: "包括",
  },
  add: {
    chinese: "新增",
  },
  remove: {
    chinese: "移除",
  },
  costPerUnit: {
    chinese: "每單位成本",
  },
  costPerJob: {
    chinese: "每份工作的成本",
  },
  costPerThousand: {
    chinese: "每千秒成本",
  },
  latheCostPerThousand: {
    chinese: "每千秒車床成本",
  },
  gramsPerUnit: {
    chinese: "克每單位",
  },
  starting: {
    chinese: "開始",
  },
  minCostPerKg: {
    chinese: "每公斤最低成本",
  },
  minCostPerUnit: {
    chinese: "每單位最低成本",
  },
  minCostPerJob: {
    chinese: "每份工作的最低成本",
  },
  costcutoverUnitQuantity: {
    chinese: "成本切換單位數量",
  },
  rangeStart: {
    chinese: "範圍開始",
  },
  rangeEnd: {
    chinese: "範圍結束",
  },
  splitRangeAt: {
    chinese: "分割範圍為",
  },
  mergeRangesKeepUpper: {
    chinese: "合併範圍（保持上限）",
  },
  mergeRangesKeepLower: {
    chinese: "合併範圍（保持較低）",
  },
  checkBoxForCustom: {
    chinese: "(自訂名稱複選框)",
  },
  width: {
    chinese: "寬度",
  },
  innerWidth: {
    chinese: "內寬",
  },
  shape: {
    chinese: "形狀",
  },
  gramsPerMm: {
    chinese: "克/毫米",
  },
  pricePerKgManufacturer: {
    chinese: "公斤價格(廠商)",
  },
  pricePerKgSurcharge: {
    chinese: "公斤價格(含加價)",
  },
  surchargePercentage: {
    chinese: "附加費百分比",
  },
  inner: {
    chinese: "內",
  },
  useManualName: {
    chinese: "使用手冊名稱",
  },
  crossSectionArea: {
    chinese: "橫斷面積",
  },
  density: {
    chinese: "密度",
  },
  pricedByUnit: {
    chinese: "按單位定價",
  },
  pricedBy: {
    chinese: "定價由",
  },
  costPerKgUnit: {
    chinese: "每公斤/單位成本",
  },
  filters: {
    chinese: "過濾器",
  },
  noFilter: {
    chinese: "無濾鏡",
  },
  kilogram: {
    chinese: "公斤",
  },
  uncheckForPricedByKg: {
    chinese: "取消勾選按公斤計價",
  },
  numberOfSeconds: {
    chinese: "秒數",
  },
  lathe: {
    chinese: "車床",
  },
  hideLoadedQuote: {
    chinese: "隱藏已載入的報價",
  },
  delete: {
    chinese: "刪除",
  },
  deleteIfUnused: {
    chinese: "如果未使用則刪除",
  },
}

export default L10n;
