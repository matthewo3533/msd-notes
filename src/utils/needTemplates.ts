import type {
  HardshipNeedType,
  NeedData,
  PaymentData,
  DecisionData,
  FoodNeedData,
  ClothingNeedData,
  EmergencyNeedData,
  BedsNeedData,
  BeddingNeedData,
  FurnitureNeedData,
  GlassesNeedData,
  ADSDNeedData,
  WhitewareNeedData,
  ElectricityNeedData,
  DentalNeedData,
  CarRepairsNeedData,
  RentArrearsNeedData,
  BondRentNeedData,
  FuneralAssistanceNeedData,
  StrandedTravelNeedData,
  TransitionToWorkNeedData
} from '../types/multiNeed';

// Blank payment template
export const createBlankPayment = (): PaymentData => ({
  supplierName: '',
  supplierId: '',
  amount: 0,
  recoveryRate: 0,
  directCredit: '',
  paymentReference: '',
  paymentCardNumber: '',
  bankAccount: ''
});

// Blank decision template
export const createBlankDecision = (): DecisionData => ({
  decision: '',
  decisionReason: ''
});

// Need-specific blank templates
const foodTemplate: FoodNeedData = {
  whyNeedFood: '',
  currentFoodBalance: 0,
  foodAmountRequested: 0,
  hardshipUnforeseen: '',
  unforeseenCircumstance: ''
};

const clothingTemplate: ClothingNeedData = {
  whyNeedClothing: '',
  canMeetNeedOtherWay: ''
};

const emergencyTemplate: EmergencyNeedData = {
  whyNeedEmergencyPayment: '',
  canMeetNeedOtherWay: ''
};

const bedsTemplate: BedsNeedData = {
  whyNeedBeds: '',
  canMeetNeedOtherWay: ''
};

const beddingTemplate: BeddingNeedData = {
  whyNeedBedding: '',
  canMeetNeedOtherWay: ''
};

const furnitureTemplate: FurnitureNeedData = {
  whyNeedFurniture: '',
  furnitureType: '',
  canMeetNeedOtherWay: ''
};

const glassesTemplate: GlassesNeedData = {
  whyNeedGlasses: '',
  canMeetNeedOtherWay: ''
};

const adsdTemplate: ADSDNeedData = {
  whyNeedADSD: '',
  canMeetNeedOtherWay: ''
};

const whitewareTemplate: WhitewareNeedData = {
  whyNeedWhiteware: '',
  canMeetNeedOtherWay: '',
  householdSize: '',
  addressContactConfirmed: '',
  spaceMeasured: '',
  specialDeliveryInstructions: '',
  deliveryInstructionsDetails: '',
  applianceModel: '',
  applianceCANumber: ''
};

const electricityTemplate: ElectricityNeedData = {
  whyNeedPower: '',
  canMeetNeedOtherWay: '',
  powerAccountNumber: ''
};

const dentalTemplate: DentalNeedData = {
  whyNeedDental: '',
  canMeetNeedOtherWay: '',
  sngEligible: '',
  sngBalance: 1000
};

const carRepairsTemplate: CarRepairsNeedData = {
  whyNeedCarRepairs: '',
  canMeetNeedOtherWay: '',
  vehicleMakeModel: '',
  licensePlate: '',
  odometer: '',
  vehicleOwner: '',
  nztaVerification: ''
};

const rentArrearsTemplate: RentArrearsNeedData = {
  whyNeedRentArrears: '',
  canMeetNeedOtherWay: '',
  rentArrearsVerification: ''
};

const bondRentTemplate: BondRentNeedData = {
  whyNeedAccommodation: '',
  newAddress: '',
  newAddressData: undefined,
  asZone: 0,
  weeklyRent: 0,
  tenancyStartDate: '',
  bondAmount: 0,
  rentInAdvanceAmount: 0,
  tenancyAffordable: '',
  bondPaymentAmount: 0,
  rentAdvancePaymentAmount: 0
};

const funeralAssistanceTemplate: FuneralAssistanceNeedData = {
  whyNeedFuneralAssistance: '',
  canMeetNeedOtherWay: '',
  petrolAssistance: '',
  startLocation: '',
  destination: '',
  returnTrip: '',
  distance: 0,
  travelCost: 0
};

const strandedTravelTemplate: StrandedTravelNeedData = {
  whyNeedStrandedTravelAssistance: '',
  canMeetNeedOtherWay: '',
  petrolAssistance: '',
  startLocation: '',
  destination: '',
  returnTrip: '',
  distance: 0,
  travelCost: 0
};

const transitionToWorkTemplate: TransitionToWorkNeedData = {
  helpType: '',
  firstPayday: '',
  whyNeedTransitionToWork: '',
  contractUploaded: '',
  petrolAssistance: '',
  startLocation: '',
  destination: '',
  returnTrip: '',
  distance: 0,
  travelCost: 0,
  employerName: '',
  startDate: '',
  hoursPerWeek: 0
};

// Get blank template for a need type
export const getNeedTemplate = (type: HardshipNeedType): NeedData => {
  const templates: Record<HardshipNeedType, NeedData> = {
    'food': { ...foodTemplate },
    'clothing': { ...clothingTemplate },
    'emergency': { ...emergencyTemplate },
    'adsd': { ...adsdTemplate },
    'beds': { ...bedsTemplate },
    'bedding': { ...beddingTemplate },
    'furniture': { ...furnitureTemplate },
    'glasses': { ...glassesTemplate },
    'whiteware': { ...whitewareTemplate },
    'electricity': { ...electricityTemplate },
    'dental': { ...dentalTemplate },
    'car-repairs': { ...carRepairsTemplate },
    'rent-arrears': { ...rentArrearsTemplate },
    'bond-rent': { ...bondRentTemplate },
    'funeral-assistance': { ...funeralAssistanceTemplate },
    'stranded-travel': { ...strandedTravelTemplate },
    'transition-to-work': { ...transitionToWorkTemplate }
  };
  
  return JSON.parse(JSON.stringify(templates[type])); // Deep clone
};

// Special payment defaults for certain need types
export const getNeedPaymentDefaults = (type: HardshipNeedType): Partial<PaymentData> => {
  const defaults: Partial<Record<HardshipNeedType, Partial<PaymentData>>> = {
    'food': {
      supplierName: 'Food Supplier Group'
    },
    'glasses': {
      amount: 280
    },
    'dental': {
      amount: 0
    },
    'electricity': {
      powerAccountNumber: ''
    }
  };
  
  return defaults[type] || {};
};

