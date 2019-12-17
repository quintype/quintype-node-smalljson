interface SmallJson {
  type: 'smalljson';
  id: '0';
  data: any;
  included: readonly IncludedItem[];
  meta: {
    packingOptions: SmallJsonOptions;
  };
}

interface SmallJsonOptions {}

interface IncludedItem {
  type: 'included';
  id: string;
  data: any;
}
