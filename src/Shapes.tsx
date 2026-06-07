/* eslint-disable react-refresh/only-export-components */

export interface IShape {
  name: string;
  hasInnerWidth: boolean;
  abbreviation: string;
  widthLabel: string;
  chineseWidth: string;
  area: (width: number, innerWidth: number) => number;
}

export const Shapes: IShape[] = [
  {
    name: "圓柱 Cylindrical",
    hasInnerWidth: false,
    abbreviation: "",
    widthLabel: "Diameter",
    chineseWidth: "直徑",
    area: (width: number) => Math.PI * width * width / 4,
  },
  {
    name: "圓管 Hollow Cylindrical",
    hasInnerWidth: true,
    abbreviation: "",
    widthLabel: "Diameter",
    chineseWidth: "直徑",
    area: (width: number, innerWidth: number) => (Math.PI * width * width / 4) - (Math.PI * innerWidth * innerWidth / 4),
  },
  {
    name: "四角 Square",
    hasInnerWidth: false,
    abbreviation: "四角",
    widthLabel: "Side",
    chineseWidth: "角",
    area: (width: number) => width * width,
  },
  {
    name: "空心四角 Hollow Square",
    hasInnerWidth: true,
    abbreviation: "四角",
    widthLabel: "Side",
    chineseWidth: "角",
    area: (width: number, innerWidth: number) => (width * width) - (innerWidth * innerWidth),
  },
  {
    name: "六角 Hexagonal",
    hasInnerWidth: false,
    abbreviation: "六角",
    widthLabel: "Side",
    chineseWidth: "角",
    area: (width: number) => Math.sqrt(3) / 2 * width * width,
  },
];

export default Shapes;
