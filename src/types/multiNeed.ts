import type { IncomeLabels } from '../components/IncomeSection';

// Hardship service types that support multi-need
export type HardshipNeedType = 
  | 'food'
  | 'clothing'
  | 'emergency'
  | 'adsd'
  | 'beds'
  | 'bedding'
  | 'furniture'
  | 'glasses'
  | 'whiteware'
  | 'electricity'
  | 'dental'
  | 'car-repairs'
  | 'rent-arrears'
  | 'bond-rent'
  | 'funeral-assistance'
  | 'stranded-travel'
  | 'transition-to-work';

// Shared data structures
export interface IncomeData {
  benefit: number;
  employment: number;
  familyTaxCredit: number;
  childSupport: number;
  childDisabilityAllowance: number;
  otherIncome: number;
}

export interface CostData {
  amount: number;
  cost: string;
}

export interface PaymentData {
  supplierName: string;
  supplierId: string;
  amount: number;
  recoveryRate: number;
  directCredit: string;
  paymentReference: string;
  paymentCardNumber: string;
  // Need-specific payment fields
  powerAccountNumber?: string; // for electricity
  bankAccount?: string; // for ADSD
}

export interface DecisionData {
  decision: 'approved' | 'declined' | '';
  decisionReason: string;
}

// Need-specific data types (only the "Need" section fields)
export interface FoodNeedData {
  whyNeedFood: string;
  currentFoodBalance: number;
  foodAmountRequested: number;
  hardshipUnforeseen: string;
  unforeseenCircumstance: string;
}

export interface ClothingNeedData {
  whyNeedClothing: string;
  canMeetNeedOtherWay: string;
}

export interface EmergencyNeedData {
  whyNeedEmergencyPayment: string;
  canMeetNeedOtherWay: string;
}

export interface BedsNeedData {
  whyNeedBeds: string;
  canMeetNeedOtherWay: string;
}

export interface BeddingNeedData {
  whyNeedBedding: string;
  canMeetNeedOtherWay: string;
}

export interface FurnitureNeedData {
  whyNeedFurniture: string;
  furnitureType: string;
  canMeetNeedOtherWay: string;
}

export interface GlassesNeedData {
  whyNeedGlasses: string;
  canMeetNeedOtherWay: string;
}

export interface ADSDNeedData {
  whyNeedADSD: string;
  canMeetNeedOtherWay: string;
}

export interface WhitewareNeedData {
  whyNeedWhiteware: string;
  canMeetNeedOtherWay: string;
  householdSize: string;
  addressContactConfirmed: string;
  spaceMeasured: string;
  specialDeliveryInstructions: string;
  deliveryInstructionsDetails: string;
  applianceModel: string;
  applianceCANumber: string;
}

export interface ElectricityNeedData {
  whyNeedPower: string;
  canMeetNeedOtherWay: string;
  powerAccountNumber: string;
}

export interface DentalNeedData {
  whyNeedDental: string;
  canMeetNeedOtherWay: string;
  sngEligible: string;
  sngBalance: number;
}

export interface CarRepairsNeedData {
  whyNeedCarRepairs: string;
  canMeetNeedOtherWay: string;
  vehicleMakeModel: string;
  licensePlate: string;
  odometer: string;
  vehicleOwner: string;
  nztaVerification: string;
}

export interface RentArrearsNeedData {
  whyNeedRentArrears: string;
  canMeetNeedOtherWay: string;
  rentArrearsVerification: string;
}

export interface BondRentNeedData {
  whyNeedAccommodation: string;
  newAddress: string;
  newAddressData?: {
    placeId: string;
    description: string;
  };
  asZone: number;
  weeklyRent: number;
  tenancyStartDate: string;
  bondAmount: number;
  rentInAdvanceAmount: number;
  tenancyAffordable: string;
  bondPaymentAmount: number;
  rentAdvancePaymentAmount: number;
}

export interface FuneralAssistanceNeedData {
  whyNeedFuneralAssistance: string;
  canMeetNeedOtherWay: string;
  petrolAssistance: string;
  startLocation: string;
  destination: string;
  returnTrip: string;
  distance: number;
  travelCost: number;
}

export interface StrandedTravelNeedData {
  whyNeedStrandedTravelAssistance: string;
  canMeetNeedOtherWay: string;
  petrolAssistance: string;
  startLocation: string;
  destination: string;
  returnTrip: string;
  distance: number;
  travelCost: number;
}

export interface TransitionToWorkNeedData {
  helpType: string;
  firstPayday: string;
  whyNeedTransitionToWork: string;
  contractUploaded: string;
  petrolAssistance: string;
  startLocation: string;
  destination: string;
  returnTrip: string;
  distance: number;
  travelCost: number;
  employerName: string;
  startDate: string;
  hoursPerWeek: number;
}

// Union type for all need data
export type NeedData = 
  | FoodNeedData
  | ClothingNeedData
  | EmergencyNeedData
  | BedsNeedData
  | BeddingNeedData
  | FurnitureNeedData
  | GlassesNeedData
  | ADSDNeedData
  | WhitewareNeedData
  | ElectricityNeedData
  | DentalNeedData
  | CarRepairsNeedData
  | RentArrearsNeedData
  | BondRentNeedData
  | FuneralAssistanceNeedData
  | StrandedTravelNeedData
  | TransitionToWorkNeedData;

// Individual need item
export interface NeedItem {
  id: string;
  type: HardshipNeedType;
  data: NeedData;
  payment: PaymentData;
  decision: DecisionData;
}

// Multi-need form data structure
export interface MultiNeedFormData {
  // Shared across all needs
  clientId: boolean | null;
  incomeLabels?: IncomeLabels;
  income: IncomeData;
  costs: CostData[];
  reasonableSteps: string;
  
  // Array of needs
  needs: NeedItem[];
}

// Helper to get need type label
export const getNeedTypeLabel = (type: HardshipNeedType): string => {
  const labels: Record<HardshipNeedType, string> = {
    'food': 'Food',
    'clothing': 'Clothing',
    'emergency': 'Emergency Payment',
    'adsd': 'ADSD',
    'beds': 'Beds',
    'bedding': 'Bedding',
    'furniture': 'Furniture',
    'glasses': 'Glasses',
    'whiteware': 'Whiteware',
    'electricity': 'Electricity',
    'dental': 'Dental',
    'car-repairs': 'Car Repairs',
    'rent-arrears': 'Rent Arrears',
    'bond-rent': 'Bond/Rent in Advance',
    'funeral-assistance': 'Funeral Assistance',
    'stranded-travel': 'Stranded Travel',
    'transition-to-work': 'Transition to Work'
  };
  return labels[type];
};

// Helper to check if need type has extra sections
export const hasExtraSection = (type: HardshipNeedType): boolean => {
  return [
    'car-repairs',
    'whiteware',
    'bond-rent',
    'funeral-assistance',
    'stranded-travel',
    'transition-to-work',
    'dental'
  ].includes(type);
};

// Helper to get extra section title
export const getExtraSectionTitle = (type: HardshipNeedType): string => {
  const titles: Partial<Record<HardshipNeedType, string>> = {
    'car-repairs': 'Car Details',
    'whiteware': 'Whiteware Info',
    'bond-rent': 'Tenancy Details',
    'funeral-assistance': 'Travel Details',
    'stranded-travel': 'Travel Details',
    'transition-to-work': 'Employment Info',
    'dental': 'Dental Info'
  };
  return titles[type] || '';
};

