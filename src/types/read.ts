export type IReadItem = {
  id: string;
  title: string;
  author: string;
  content: string;
  topics: string[];
  genre: string[];
  year: number;
  yearStr: string;
  intro: string;
  curator: string;
  comment: string;
  region: string;
  publish: string;
  createdAt: {
    $date: string;
  };
  __v: number;
  age: number;
};

export type IReadTableFilters = {
  region: string[];
  curator: string[];
};
