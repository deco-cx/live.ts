export interface LegacySearchArgs {
  query?: string;
  page: number;
  count: number;
  type: "product_search" | "facets";
  selectedFacets?: SelectedFacet[];
  // fuzzy?: "0" | "1" | "auto";
  // hideUnavailableItems?: boolean;
  // locale?: string;
  sort?: LegacySort;
}

export type LegacySort =
  | "OrderByPriceDESC"
  | "OrderByPriceASC"
  | "OrderByTopSaleDESC"
  | "OrderByReviewRateDESC"
  | "OrderByNameASC"
  | "OrderByNameDESC"
  | "OrderByReleaseDateDESC"
  | "OrderByBestDiscountDESC"
  | "OrderByScoreDESC"
  | "";

export interface SearchArgs {
  /**
   * @description VTEX Account name.
   */
  account: string;
  query?: string;
  page: number;
  count: number;
  type: "product_search" | "facets";
  sort?: Sort;
  selectedFacets?: SelectedFacet[];
  fuzzy?: "0" | "1" | "auto";
  hideUnavailableItems?: boolean;
  locale?: string;
  salesChannel?: string;
}

export interface SelectedFacet {
  key: string;
  value: string;
}

export type Sort =
  | "price:desc"
  | "price:asc"
  | "orders:desc"
  | "name:desc"
  | "name:asc"
  | "release:desc"
  | "discount:desc"
  | "";

export interface Suggestion {
  searches: Search[];
}

export interface Search {
  term: string;
  count: number;
}

export interface ProductSearchResult {
  /**
   * @description Total of products.
   */
  recordsFiltered: number;
  products: Product[];
  pagination: Pagination;
  sampling: boolean;
  options: Options;
  translated: boolean;
  locale: string;
  query: string;
  operator: "and" | "or";
  fuzzy: string;
  correction?: Correction;
}
// ---------- VTEX LEGACY SEARCH RESPONSE
// export interface VTEXLegacyProduct{
//   productId: string;
//   productName: string;
//   brand: string;
//   brandId: number;
//   brandImageUrl: null;
//   linkText: string;
//   productReference: string;
//   productReferenceCode: string;
//   categoryId: string;
//   productTitle: string;
//   metaTagDescription: string;
//   releaseDate: Date;
//   clusterHighlights: ClusterHighlights;
//   productClusters: { [key: string]: string };
//   searchableClusters: { [key: string]: string };
//   categories: string[];
//   categoriesIds: string[];
//   link: string;
//   Marca: string[];
//   "Tipo de Produto": string[];
//   SALE: string[];
//   Coleção: string[];
//   "ID Coleção": string[];
//   "Coleção Atual": string[];
//   "Tabela de Medidas": string[];
//   Tamanho: string[];
//   Composição: string[];
//   Cor: string[];
//   "Cores Filtráveis": string[];
//   allSpecifications: string[];
//   allSpecificationsGroups: string[];
//   description: string;
//   items: Item[];
//   skuSpecifications: SkuSpecification[];
// }

// export interface ClusterHighlights {
//   "1249": string;
// }

// export interface Item {
//   itemId: string;
//   name: string;
//   nameComplete: string;
//   complementName: string;
//   ean: string;
//   referenceId: ReferenceID[];
//   measurementUnit: string;
//   unitMultiplier: number;
//   modalType: null;
//   isKit: boolean;
//   images: Image[];
//   Tamanho: string[];
//   variations: string[];
//   sellers: Seller[];
//   Videos: any[];
//   estimatedDateArrival: null;
// }

// export interface Image {
//   imageId: string;
//   imageLabel: string;
//   imageTag: string;
//   imageUrl: string;
//   imageText: ImageText;
//   imageLastModified: Date;
// }

// export enum ImageText {
//   The52104418_5361_10TopDeLinhoRosaFucsia =
//     "52104418_5361_10-TOP-DE-LINHO-ROSA-FUCSIA",
//   The52104418_5361_1TopDeLinhoRosaFucsia =
//     "52104418_5361_1-TOP-DE-LINHO-ROSA-FUCSIA",
//   The52104418_5361_2TopDeLinhoRosaFucsia =
//     "52104418_5361_2-TOP-DE-LINHO-ROSA-FUCSIA",
//   The52104418_5361_3TopDeLinhoRosaFucsia =
//     "52104418_5361_3-TOP-DE-LINHO-ROSA-FUCSIA",
//   The52104418_5361_4TopDeLinhoRosaFucsia =
//     "52104418_5361_4-TOP-DE-LINHO-ROSA-FUCSIA",
// }

// export interface ReferenceID {
//   Key: string;
//   Value: string;
// }

// export interface Seller {
//   sellerId: string;
//   sellerName: string;
//   addToCartLink: string;
//   sellerDefault: boolean;
//   commertialOffer: CommertialOffer;
// }

// export interface CommertialOffer {
//   DeliverySlaSamplesPerRegion: DeliverySlaSamplesPerRegion;
//   Installments: Installment[];
//   DiscountHighLight: any[];
//   GiftSkuIds: any[];
//   Teasers: any[];
//   BuyTogether: any[];
//   ItemMetadataAttachment: any[];
//   Price: number;
//   ListPrice: number;
//   PriceWithoutDiscount: number;
//   RewardValue: number;
//   PriceValidUntil: Date;
//   AvailableQuantity: number;
//   IsAvailable: boolean;
//   Tax: number;
//   DeliverySlaSamples: DeliverySlaSample[];
//   GetInfoErrorMessage: null | string;
//   CacheVersionUsedToCallCheckout: string;
//   PaymentOptions: PaymentOptions;
// }

// export interface DeliverySlaSample {
//   DeliverySlaPerTypes: any[];
//   Region: null;
// }

// export interface DeliverySlaSamplesPerRegion {
//   "0"?: DeliverySlaSample;
// }

// export interface Installment {
//   Value: number;
//   InterestRate: number;
//   TotalValuePlusInterestRate: number;
//   NumberOfInstallments: number;
//   PaymentSystemName: Name;
//   PaymentSystemGroupName: GroupName;
//   Name: string;
// }

// export enum GroupName {
//   CreditCardPaymentGroup = "creditCardPaymentGroup",
//   GiftCardPaymentGroup = "giftCardPaymentGroup",
//   InstantPaymentPaymentGroup = "instantPaymentPaymentGroup",
// }

// export enum Name {
//   AmericanExpress = "American Express",
//   Diners = "Diners",
//   Elo = "Elo",
//   Hipercard = "Hipercard",
//   Mastercard = "Mastercard",
//   Pix = "Pix",
//   Vale = "Vale",
//   Visa = "Visa",
// }

// export interface PaymentOptions {
//   installmentOptions: InstallmentOption[];
//   paymentSystems: PaymentSystem[];
//   payments: any[];
//   giftCards: any[];
//   giftCardMessages: any[];
//   availableAccounts: any[];
//   availableTokens: any[];
// }

// export interface InstallmentOption {
//   paymentSystem: string;
//   bin: null;
//   paymentName: Name;
//   paymentGroupName: GroupName;
//   value: number;
//   installments: InstallmentElement[];
// }

// export interface InstallmentElement {
//   count: number;
//   hasInterestRate: boolean;
//   interestRate: number;
//   value: number;
//   total: number;
//   sellerMerchantInstallments?: InstallmentElement[];
//   id?: ID;
// }

// export enum ID {
//   Lojaoffpremium = "LOJAOFFPREMIUM",
// }

// export interface PaymentSystem {
//   id: number;
//   name: Name;
//   groupName: GroupName;
//   validator: null;
//   stringId: string;
//   template: Template;
//   requiresDocument: boolean;
//   isCustom: boolean;
//   description: null;
//   requiresAuthentication: boolean;
//   dueDate: Date;
//   availablePayments: null;
// }

// export enum Template {
//   CreditCardPaymentGroupTemplate = "creditCardPaymentGroup-template",
//   GiftCardPaymentGroupTemplate = "giftCardPaymentGroup-template",
//   InstantPaymentPaymentGroupTemplate = "instantPaymentPaymentGroup-template",
// }

// export interface SkuSpecification {
//   field: Field;
//   values: Value[];
// }

// export interface Field {
//   id: number;
//   name: string;
//   isActive: boolean;
//   position: number;
//   type: string;
// }

// export interface Value {
//   id: string;
//   name: string;
//   position: number;
// }
// FINAL ------- VTEX LEGACY SEARCH RESPONSE

interface Correction {
  misspelled: boolean;
}

interface Options {
  sorts: {
    field: string;
    order: string;
    active?: boolean;
    proxyURL: string;
  }[];
  counts: Count[];
}

interface Count {
  count: number;
  proxyURL: string;
}

interface Pagination {
  count: number;
  current: Page;
  before: Page[];
  after: Page[];
  perPage: number;
  next: Page;
  previous: Page;
  first: Page;
  last: Page;
}

interface Page {
  index: number;
  proxyURL: string;
}

export interface First {
  index: number;
}

export interface Suggestion {
  searches: Search[];
}

export interface Search {
  term: string;
  count: number;
}

export interface Product {
  productId: string;
  productName: string;
  brand: string;
  brandId: number;
  cacheId?: string;
  linkText: string;
  productReference: string;
  categoryId: string;
  clusterHighlights: Record<string, unknown>;
  productClusters: Record<string, string>;
  categories: string[];
  categoriesIds: string[];
  link: string;
  description: string;
  /**
   * @description Product SKUs.
   */
  items: Item[];
  skuSpecifications?: SkuSpecification[];
  priceRange: PriceRange;
  specificationGroups: SpecificationGroup[];
  properties: Array<{ name: string; values: string[] }>;
  selectedProperties: Array<{ key: string; value: string }>;
  releaseDate: string;
}

interface Image {
  imageId: string;
  imageLabel: string | null;
  imageTag: string;
  imageUrl: string;
  imageText: string;
}

interface Installment {
  Value: number;
  InterestRate: number;
  TotalValuePlusInterestRate: number;
  NumberOfInstallments: number;
  PaymentSystemName: string;
  PaymentSystemGroupName: string;
  Name: string;
}

export interface LegacyItem {
  itemId: string;
  name: string;
  nameComplete: string;
  complementName: string;
  ean: string;
  referenceId: Array<{ Key: string; Value: string }>;
  measurementUnit: string;
  unitMultiplier: number;
  modalType: unknown | null;
  images: Image[];
  Videos: string[];
  variations: Array<string>;
  sellers: Seller[];
  attachments: Array<{
    id: number;
    name: string;
    required: boolean;
    domainValues: string;
  }>;
  isKit: boolean;
  kitItems?: Array<{
    itemId: string;
    amount: number;
  }>;
}

export interface Item {
  itemId: string;
  name: string;
  nameComplete: string;
  complementName: string;
  ean: string;
  referenceId: Array<{ Key: string; Value: string }>;
  measurementUnit: string;
  unitMultiplier: number;
  modalType: unknown | null;
  images: Image[];
  Videos: string[];
  variations: Array<{
    name: string;
    values: string[];
  }>;
  sellers: Seller[];
  attachments: Array<{
    id: number;
    name: string;
    required: boolean;
    domainValues: string;
  }>;
  isKit: boolean;
  kitItems?: Array<{
    itemId: string;
    amount: number;
  }>;
}

export interface CommertialOffer {
  DeliverySlaSamplesPerRegion: Record<
    string,
    { DeliverySlaPerTypes: unknown[]; Region: unknown | null }
  >;
  Installments: Installment[];
  DiscountHighLight: unknown[];
  GiftSkuIds: string[];
  Teasers: Array<Record<string, unknown>>;
  teasers?: Array<Record<string, unknown>>;
  BuyTogether: unknown[];
  ItemMetadataAttachment: unknown[];
  Price: number;
  ListPrice: number;
  spotPrice: number;
  PriceWithoutDiscount: number;
  RewardValue: number;
  PriceValidUntil: string;
  AvailableQuantity: number;
  Tax: number;
  DeliverySlaSamples: Array<{
    DeliverySlaPerTypes: unknown[];
    Region: unknown | null;
  }>;
  GetInfoErrorMessage: unknown | null;
  CacheVersionUsedToCallCheckout: string;
}

export interface Seller {
  sellerId: string;
  sellerName: string;
  addToCartLink: string;
  sellerDefault: boolean;
  commertialOffer: CommertialOffer;
}

export interface SkuSpecification {
  field: SKUSpecificationField;
  values: SKUSpecificationValue[];
}
export interface SKUSpecificationValue {
  name: string;
  id?: string;
  fieldId?: string;
  originalName?: string;
}

export interface SKUSpecificationField {
  name: string;
  originalName?: string;
  id?: string;
}

export interface Price {
  highPrice: number | null;
  lowPrice: number | null;
}

export interface PriceRange {
  sellingPrice: Price;
  listPrice: Price;
}

export interface SpecificationGroup {
  name: string;
  originalName: string;
  specifications: Array<{
    name: string;
    originalName: string;
    values: string[];
  }>;
}

export type FilterType = "PRICERANGE" | "TEXT" | "NUMBER" | "CATEGORYTREE";

export interface FacetSearchResult {
  facets: Facet[];
  breadcrumb: Breadcrumb;
}

export interface Facet<T = FacetValueBoolean | FacetValueRange> {
  type: FilterType;
  name: string;
  hidden: boolean;
  values: T[];
  quantity: number;
  key: string;
}

export interface FacetValueBoolean {
  quantity: number;
  name: string;
  key: string;
  value: string;
  selected: boolean;
  href: string;
}

export interface FacetValueRange {
  range: {
    from: number;
    to: number;
  };
}

export interface Breadcrumb {
  href: string;
  name: string;
}
