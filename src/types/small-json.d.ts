interface SmallJson {
  type: 'smalljson';
  id: '0';
  data: any;
  included: readonly SmallJsonIncludedItem[];
  meta: {
    randomString: string;
  };
}

interface SmallJsonOptions {
  extractKeys?: Set<string>;
  randomString?: string;
}

interface SmallJsonIncludedItem {
  type: string;
  id: string;
  data: any;
}
