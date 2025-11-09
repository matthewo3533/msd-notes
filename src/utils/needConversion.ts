import type { 
  FoodFormData, 
  ClothingFormData, 
  EmergencyFormData,
  BedsFormData,
  BeddingFormData,
  FurnitureFormData,
  GlassesFormData,
  ADSDFormData,
  WhitewareFormData,
  ElectricityFormData,
  DentalFormData,
  CarRepairsFormData,
  RentArrearsFormData,
  BondRentFormData,
  FuneralAssistanceFormData,
  StrandedTravelFormData,
  TransitionToWorkFormData
} from '../App';
import type { MultiNeedFormData, NeedItem, HardshipNeedType, NeedData, BondRentNeedData } from '../types/multiNeed';
import { getNeedTemplate, createBlankPayment, getNeedPaymentDefaults } from './needTemplates';

const roundToNearest50Cents = (value: number) => Math.ceil(value * 2) / 2;

// Convert single-need form data to multi-need format
export const convertToMultiNeed = (
  formData: any,
  needType: HardshipNeedType
): MultiNeedFormData => {
  // Extract need-specific data based on type
  let needData: NeedData;

  switch (needType) {
    case 'food':
      const f = formData as FoodFormData;
      needData = {
        whyNeedFood: f.whyNeedFood,
        currentFoodBalance: f.currentFoodBalance,
        foodAmountRequested: f.foodAmountRequested,
        hardshipUnforeseen: f.hardshipUnforeseen,
        unforeseenCircumstance: f.unforeseenCircumstance
      };
      break;

    case 'clothing':
      const c = formData as ClothingFormData;
      needData = {
        whyNeedClothing: c.whyNeedClothing,
        canMeetNeedOtherWay: c.canMeetNeedOtherWay
      };
      break;

    case 'emergency':
      const e = formData as EmergencyFormData;
      needData = {
        whyNeedEmergencyPayment: e.whyNeedEmergencyPayment,
        canMeetNeedOtherWay: e.canMeetNeedOtherWay
      };
      break;

    case 'beds':
      const b = formData as BedsFormData;
      needData = {
        whyNeedBeds: b.whyNeedBeds,
        canMeetNeedOtherWay: b.canMeetNeedOtherWay
      };
      break;

    case 'bedding':
      const bd = formData as BeddingFormData;
      needData = {
        whyNeedBedding: bd.whyNeedBedding,
        canMeetNeedOtherWay: bd.canMeetNeedOtherWay
      };
      break;

    case 'furniture':
      const fu = formData as FurnitureFormData;
      needData = {
        whyNeedFurniture: fu.whyNeedFurniture,
        furnitureType: fu.furnitureType,
        canMeetNeedOtherWay: fu.canMeetNeedOtherWay
      };
      break;

    case 'glasses':
      const g = formData as GlassesFormData;
      needData = {
        whyNeedGlasses: g.whyNeedGlasses,
        canMeetNeedOtherWay: g.canMeetNeedOtherWay
      };
      break;

    case 'adsd':
      const adsd = formData as ADSDFormData;
      needData = {
        whyNeedADSD: adsd.whyNeedADSD,
        canMeetNeedOtherWay: adsd.canMeetNeedOtherWay
      };
      break;

    case 'whiteware':
      const ww = formData as WhitewareFormData;
      needData = {
        whyNeedWhiteware: ww.whyNeedWhiteware,
        canMeetNeedOtherWay: ww.canMeetNeedOtherWay,
        householdSize: ww.householdSize,
        addressContactConfirmed: ww.addressContactConfirmed,
        spaceMeasured: ww.spaceMeasured,
        specialDeliveryInstructions: ww.specialDeliveryInstructions,
        deliveryInstructionsDetails: ww.deliveryInstructionsDetails,
        applianceModel: ww.applianceModel,
        applianceCANumber: ww.applianceCANumber
      };
      break;

    case 'electricity':
      const el = formData as ElectricityFormData;
      needData = {
        whyNeedPower: el.whyNeedPower,
        canMeetNeedOtherWay: el.canMeetNeedOtherWay,
        powerAccountNumber: el.powerAccountNumber
      };
      break;

    case 'dental':
      const d = formData as DentalFormData;
      needData = {
        whyNeedDental: d.whyNeedDental,
        canMeetNeedOtherWay: d.canMeetNeedOtherWay,
        sngEligible: d.sngEligible,
        sngBalance: d.sngBalance
      };
      break;

    case 'car-repairs':
      const car = formData as CarRepairsFormData;
      needData = {
        whyNeedCarRepairs: car.whyNeedCarRepairs,
        canMeetNeedOtherWay: car.canMeetNeedOtherWay,
        vehicleMakeModel: car.vehicleMakeModel,
        licensePlate: car.licensePlate,
        odometer: car.odometer,
        vehicleOwner: car.vehicleOwner,
        nztaVerification: car.nztaVerification
      };
      break;

    case 'rent-arrears':
      const ra = formData as RentArrearsFormData;
      needData = {
        whyNeedRentArrears: ra.whyNeedRentArrears,
        canMeetNeedOtherWay: ra.canMeetNeedOtherWay,
        rentArrearsVerification: ra.rentArrearsVerification
      };
      break;

    case 'bond-rent':
      const br = formData as BondRentFormData;
      needData = {
        whyNeedAccommodation: br.whyNeedAccommodation,
        newAddress: br.newAddress,
        newAddressData: br.newAddressData,
        asZone: br.asZone,
        weeklyRent: br.weeklyRent,
        tenancyStartDate: br.tenancyStartDate,
        bondAmount: br.bondAmount,
        rentInAdvanceAmount: br.rentInAdvanceAmount,
        tenancyAffordable: br.tenancyAffordable,
        bondPaymentAmount: br.bondPaymentAmount,
        rentAdvancePaymentAmount: br.rentAdvancePaymentAmount
      };
      break;

    case 'funeral-assistance':
      const fa = formData as FuneralAssistanceFormData;
      needData = {
        whyNeedFuneralAssistance: fa.whyNeedFuneralAssistance,
        canMeetNeedOtherWay: fa.canMeetNeedOtherWay,
        petrolAssistance: fa.petrolAssistance,
        startLocation: fa.startLocation,
        destination: fa.destination,
        returnTrip: fa.returnTrip,
        distance: fa.distance,
        travelCost: fa.travelCost
      };
      break;

    case 'stranded-travel':
      const st = formData as StrandedTravelFormData;
      needData = {
        whyNeedStrandedTravelAssistance: st.whyNeedStrandedTravelAssistance,
        canMeetNeedOtherWay: st.canMeetNeedOtherWay,
        petrolAssistance: st.petrolAssistance,
        startLocation: st.startLocation,
        destination: st.destination,
        returnTrip: st.returnTrip,
        distance: st.distance,
        travelCost: st.travelCost
      };
      break;

    case 'transition-to-work':
      const ttw = formData as TransitionToWorkFormData;
      needData = {
        helpType: ttw.helpType,
        firstPayday: ttw.firstPayday,
        whyNeedTransitionToWork: ttw.whyNeedTransitionToWork,
        contractUploaded: ttw.contractUploaded,
        petrolAssistance: ttw.petrolAssistance,
        startLocation: ttw.startLocation,
        destination: ttw.destination,
        returnTrip: ttw.returnTrip,
        distance: ttw.distance,
        travelCost: ttw.travelCost,
        employerName: ttw.employerName,
        startDate: ttw.startDate,
        hoursPerWeek: ttw.hoursPerWeek
      };
      break;

    default:
      needData = getNeedTemplate(needType);
  }

  const paymentDefaults = getNeedPaymentDefaults(needType);
  const blankPayment = { ...createBlankPayment(), ...paymentDefaults };

  const need: NeedItem = {
    id: `need-${Date.now()}`,
    type: needType,
    data: needData,
    payment: {
      ...blankPayment,
      supplierName: formData.supplierName || blankPayment.supplierName || '',
      supplierId: formData.supplierId || blankPayment.supplierId || '',
      amount: formData.amount !== undefined ? formData.amount : (blankPayment.amount ?? 0),
      recoveryRate: formData.recoveryRate !== undefined ? formData.recoveryRate : (blankPayment.recoveryRate ?? 0),
      directCredit: formData.directCredit || blankPayment.directCredit || '',
      paymentReference: formData.paymentReference || blankPayment.paymentReference || '',
      paymentCardNumber: formData.paymentCardNumber || blankPayment.paymentCardNumber || '',
      powerAccountNumber: formData.powerAccountNumber || blankPayment.powerAccountNumber,
      bankAccount: formData.bankAccount || blankPayment.bankAccount
    },
    decision: {
      decision: formData.decision || '',
      decisionReason: formData.decisionReason || ''
    }
  };

  if (needType === 'bond-rent') {
    const bondData = needData as BondRentNeedData;
    const totalPayment =
      (bondData.bondPaymentAmount || 0) + (bondData.rentAdvancePaymentAmount || 0);
    need.payment.amount = totalPayment;
    if (!need.payment.recoveryRate && totalPayment > 0) {
      need.payment.recoveryRate = roundToNearest50Cents(totalPayment / 104);
    }
  }

  return {
    clientId: formData.clientId,
    incomeLabels: formData.incomeLabels,
    income: formData.income,
    costs: formData.costs || [],
    reasonableSteps: formData.reasonableSteps || '',
    needs: [need]
  };
};

