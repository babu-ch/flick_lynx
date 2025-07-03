type DirectionKeys = 'left' | 'right' | 'up' | 'down';

export type Key = {
  center: string;
  isCommand: boolean
  isConvertKey?:boolean;
} &{
  [key in DirectionKeys]?: string;
}

export const keyboard: Key[][] = [
  [
    {center: "あ", left: "い", up: "う", right: "え", down: "お", isCommand:false},
    {center: "か", left: "き", up: "く", right: "け", down: "こ", isCommand:false},
    {center: "さ", left: "し", up: "す", right: "せ", down: "そ", isCommand:false},
    {center: "✗", isCommand:true},
  ],
  [
    {center: "た", left: "ち", up: "つ", right: "て", down: "と", isCommand:false},
    {center: "な", left: "に", up: "ぬ", right: "ね", down: "の", isCommand:false},
    {center: "は", left: "ひ", up: "ふ", right: "へ", down: "ほ", isCommand:false},
    {center: "→", isCommand:true},
  ], [
    {center: "ま", left: "み", up: "む", right: "め", down: "も", isCommand:false},
    {center: "や", left: "", up: "ゆ", right: "", down: "よ", isCommand:false},
    {center: "ら", left: "り", up: "る", right: "れ", down: "ろ", isCommand:false},
    {center: "_", isCommand:true},
  ], [
    {center: "゛゜", isCommand:true, isConvertKey: true, left:"゛", right:"゜"},
    {center: "わ", left: "を", up: "ん", right: "ー", down: "〜", isCommand:false},
    {center: "、", left: "。", up: "？", right: "！", down: "...", isCommand:false},
    {center: "↵", isCommand:true},
  ]
] as const;

