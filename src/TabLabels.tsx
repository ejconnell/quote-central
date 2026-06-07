/* eslint-disable react-refresh/only-export-components */

export interface ITabLabel {
  chinese: string;
  plural: string;
  singular: string;
}

export const TabLabels: Record<string, ITabLabel> = {
  quote: {
    singular: "Quote",
    plural: "Quotes",
    chinese: "報價",
  },
  item: {
    singular: "Item",
    plural: "Items",
    chinese: "物品",
  },
  material: {
    singular: "Material",
    plural: "Materials",
    chinese: "材料",
  },
  metal: {
    singular: "Metal",
    plural: "Metals",
    chinese: "金屬",
  },
  metalFamily: {
    singular: "Metal Family",
    plural: "Metal Families",
    chinese: "金屬類型",
  },
  inHouse: {
    singular: "In House",
    plural: "In Houses",
    chinese: "加工成本",
  },
  outsourcing: {
    singular: "Outsourcing",
    plural: "Outsourcings",
    chinese: "外加工",
  },
  standardSetup: {
    singular: "Standard Setup",
    plural: "Standard Setups",
    chinese: "校車",
  },
  customer: {
    singular: "Customer",
    plural: "Customers",
    chinese: "客戶",
  },
};

export default TabLabels;
