export type category = {
  _id?: string;
  name: string;
  image: string;
  tags: {
    tag: string;
    values: string[];
  }[];
};

type SectionCategory = {
  _id: string;
  section: string;
  categoriesId: string[];
};

type TitleCategory = {
  _id: string;
  name: string;
  categories: string[];
};

type FeaturedCategory = {
  _id?: string;
  type: {
    type: string;
    enum: ["categoriesWithProducts", "multipleCategories"];
    required: true;
  };
  name?: string;
  section?: string;
  categories?: string[];
  categoriesId?: string[];
};

type FeaturedCategories = FeaturedCategory[];

export const tShirtCategory: category = {
  _id: "2mfomofm2fmewmcdf43043fpodmc3534m",
  name: "T-Shirts",
  image: "/items/cut-leaf-navy-shirt2.jpg",
  tags: [
    {
      tag: "size",
      values: ["S", "M", "L", "XL", "XXL"],
    },
    {
      tag: "color",
      values: ["red", "blue", "green"],
    },
    {
      tag: "material",
      values: ["cotton", "polyester"],
    },
    {
      tag: "gender",
      values: ["men", "women", "unisex"],
    },
    {
      tag: "season",
      values: ["spring", "summer", "autumn", "winter"],
    },
    {
      tag: "style",
      values: ["casual", "sport", "formal"],
    },
    {
      tag: "fit",
      values: ["slim", "regular", "oversize"],
    },
  ],
};
