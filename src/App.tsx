import { useEffect, lazy, Suspense } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navigation from './components/Navigation';
import Home from './components/Home';
import { keepAliveService } from './services/keepAliveService';
import type { IncomeLabels } from './components/IncomeSection';
import { SettingsProvider, useSettings } from './contexts/SettingsContext';
import { useInputActivityListener } from './hooks/useInputActivityListener';
import { initAnalytics, trackPageView } from './utils/analytics';

// Lazy load components for better performance
const FoodPage = lazy(() => import('./components/FoodPage'));
const ClothingPage = lazy(() => import('./components/ClothingPage'));
const EmergencyPage = lazy(() => import('./components/EmergencyPage'));
const TransitionToWorkPage = lazy(() => import('./components/TransitionToWorkPage'));
const RentArrearsPage = lazy(() => import('./components/RentArrearsPage'));
const CarRepairsPage = lazy(() => import('./components/CarRepairsPage'));
const FuneralAssistancePage = lazy(() => import('./components/FuneralAssistancePage'));
const StrandedTravelPage = lazy(() => import('./components/StrandedTravelPage'));
const ElectricityPage = lazy(() => import('./components/ElectricityPage'));
const DentalPage = lazy(() => import('./components/DentalPage'));
const BedsPage = lazy(() => import('./components/BedsPage'));
const BeddingPage = lazy(() => import('./components/BeddingPage'));
const FurniturePage = lazy(() => import('./components/FurniturePage'));
const GlassesPage = lazy(() => import('./components/GlassesPage'));
const WhitewarePage = lazy(() => import('./components/WhitewarePage'));
const BondRentPage = lazy(() => import('./components/BondRentPage'));
const TASGrantPage = lazy(() => import('./components/TASGrantPage'));
const DeclareIncomePage = lazy(() => import('./components/DeclareIncomePage'));
const ADSDPage = lazy(() => import('./components/ADSDPage'));
const PetrolCalculator = lazy(() => import('./components/PetrolCalculator'));
const AbsenceFromNZPage = lazy(() => import('./components/AbsenceFromNZPage'));
const MultiNeedPage = lazy(() => import('./components/MultiNeedPage'));
const ChangeOfAddressPage = lazy(() => import('./components/ChangeOfAddressPage'));
const GenericTemplatePage = lazy(() => import('./components/GenericTemplatePage'));
const BenefitGrantPage = lazy(() => import('./components/BenefitGrantPage'));
const AnalyticsPage = lazy(() => import('./components/AnalyticsPage'));

export interface Service {
  id: string;
  title: string;
  emoji: string;
}

export interface FoodFormData {
  clientId: boolean | null;
  whyNeedFood: string;
  currentFoodBalance: number;
  foodAmountRequested: number;
  hardshipUnforeseen: string;
  unforeseenCircumstance: string;
  reasonableSteps: string;
  supplierName: string;
  supplierId: string;
  amount: number;
  recoveryRate: number;
  directCredit: string;
  paymentReference: string;
  paymentCardNumber: string;
  incomeLabels?: IncomeLabels;
  income: {
    benefit: number;
    employment: number;
    familyTaxCredit: number;
    childSupport: number;
    childDisabilityAllowance: number;
    otherIncome: number;
  };
  costs: Array<{
    amount: number;
    cost: string;
  }>;
  decision: string;
  decisionReason: string;
}

export interface ClothingFormData {
  clientId: boolean | null;
  whyNeedClothing: string;
  reasonableSteps: string;
  canMeetNeedOtherWay: string;
  supplierName: string;
  supplierId: string;
  amount: number;
  recoveryRate: number;
  directCredit: string;
  paymentReference: string;
  paymentCardNumber: string;
  incomeLabels?: IncomeLabels;
  income: {
    benefit: number;
    employment: number;
    familyTaxCredit: number;
    childSupport: number;
    childDisabilityAllowance: number;
    otherIncome: number;
  };
  costs: Array<{
    amount: number;
    cost: string;
  }>;
  decision: string;
  decisionReason: string;
}

export interface EmergencyFormData {
  clientId: boolean | null;
  whyNeedEmergencyPayment: string;
  reasonableSteps: string;
  canMeetNeedOtherWay: string;
  petrolAssistance: string;
  startLocation: string;
  destination: string;
  returnTrip: string;
  distance: number;
  travelCost: number;
  supplierName: string;
  supplierId: string;
  amount: number;
  recoveryRate: number;
  directCredit: string;
  paymentReference: string;
  paymentCardNumber: string;
  incomeLabels?: IncomeLabels;
  income: {
    benefit: number;
    employment: number;
    familyTaxCredit: number;
    childSupport: number;
    childDisabilityAllowance: number;
    otherIncome: number;
  };
  costs: Array<{
    amount: number;
    cost: string;
  }>;
  decision: string;
  decisionReason: string;
}

export interface TransitionToWorkFormData {
  clientId: boolean | null;
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
  supplierName: string;
  supplierId: string;
  amount: number;
  recoveryRate: number;
  directCredit: string;
  paymentReference: string;
  paymentCardNumber: string;
  incomeLabels?: IncomeLabels;
  income: {
    benefit: number;
    employment: number;
    familyTaxCredit: number;
    childSupport: number;
    childDisabilityAllowance: number;
    otherIncome: number;
  };
  costs: Array<{
    amount: number;
    cost: string;
  }>;
  decision: string;
  decisionReason: string;
}

export interface ADSDFormData {
  clientId: boolean | null;
  whyNeedADSD: string;
  reasonableSteps: string;
  canMeetNeedOtherWay: string;
  bankAccount: string;
  amount: number;
  recoveryRate: number;
  directCredit: string;
  paymentReference: string;
  paymentCardNumber: string;
  incomeLabels?: IncomeLabels;
  income: {
    benefit: number;
    employment: number;
    familyTaxCredit: number;
    childSupport: number;
    childDisabilityAllowance: number;
    otherIncome: number;
  };
  costs: Array<{
    amount: number;
    cost: string;
  }>;
  decision: string;
  decisionReason: string;
}

export interface RentArrearsFormData {
  clientId: boolean | null;
  whyNeedRentArrears: string;
  reasonableSteps: string;
  canMeetNeedOtherWay: string;
  rentArrearsVerification: string;
  supplierName: string;
  supplierId: string;
  amount: number;
  recoveryRate: number;
  directCredit: string;
  paymentReference: string;
  paymentCardNumber: string;
  incomeLabels?: IncomeLabels;
  income: {
    benefit: number;
    employment: number;
    familyTaxCredit: number;
    childSupport: number;
    childDisabilityAllowance: number;
    otherIncome: number;
  };
  costs: Array<{
    amount: number;
    cost: string;
  }>;
  decision: string;
  decisionReason: string;
}

export interface CarRepairsFormData {
  clientId: boolean | null;
  whyNeedCarRepairs: string;
  reasonableSteps: string;
  canMeetNeedOtherWay: string;
  vehicleMakeModel: string;
  licensePlate: string;
  odometer: string;
  vehicleOwner: string;
  nztaVerification: string;
  supplierName: string;
  supplierId: string;
  amount: number;
  recoveryRate: number;
  directCredit: string;
  paymentReference: string;
  paymentCardNumber: string;
  incomeLabels?: IncomeLabels;
  income: {
    benefit: number;
    employment: number;
    familyTaxCredit: number;
    childSupport: number;
    childDisabilityAllowance: number;
    otherIncome: number;
  };
  costs: Array<{
    amount: number;
    cost: string;
  }>;
  decision: string;
  decisionReason: string;
}

export interface FuneralAssistanceFormData {
  clientId: boolean | null;
  whyNeedFuneralAssistance: string;
  reasonableSteps: string;
  canMeetNeedOtherWay: string;
  petrolAssistance: string;
  // Travel details (from petrol calculator)
  startLocation: string;
  destination: string;
  returnTrip: string;
  distance: number;
  travelCost: number;
  supplierName: string;
  supplierId: string;
  amount: number;
  recoveryRate: number;
  directCredit: string;
  paymentReference: string;
  paymentCardNumber: string;
  incomeLabels?: IncomeLabels;
  income: {
    benefit: number;
    employment: number;
    familyTaxCredit: number;
    childSupport: number;
    childDisabilityAllowance: number;
    otherIncome: number;
  };
  costs: Array<{
    amount: number;
    cost: string;
  }>;
  decision: string;
  decisionReason: string;
}

export interface StrandedTravelFormData {
  clientId: boolean | null;
  whyNeedStrandedTravelAssistance: string;
  reasonableSteps: string;
  canMeetNeedOtherWay: string;
  petrolAssistance: string;
  // Travel details (from petrol calculator)
  startLocation: string;
  destination: string;
  returnTrip: string;
  distance: number;
  travelCost: number;
  supplierName: string;
  supplierId: string;
  amount: number;
  recoveryRate: number;
  directCredit: string;
  paymentReference: string;
  paymentCardNumber: string;
  incomeLabels?: IncomeLabels;
  income: {
    benefit: number;
    employment: number;
    familyTaxCredit: number;
    childSupport: number;
    childDisabilityAllowance: number;
    otherIncome: number;
  };
  costs: Array<{
    amount: number;
    cost: string;
  }>;
  decision: string;
  decisionReason: string;
}

export interface BondRentFormData {
  clientId: boolean | null;
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
  reasonableSteps: string;
  tenancyAffordable: string;
  supplierName: string;
  supplierId: string;
  bondPaymentAmount: number;
  rentAdvancePaymentAmount: number;
  recoveryRate: number;
  directCredit: string;
  paymentReference: string;
  paymentCardNumber: string;
  incomeLabels?: IncomeLabels;
  income: {
    benefit: number;
    employment: number;
    familyTaxCredit: number;
    childSupport: number;
    childDisabilityAllowance: number;
    otherIncome: number;
  };
  costs: Array<{
    amount: number;
    cost: string;
  }>;
  decision: string;
  decisionReason: string;
}

export interface GlassesFormData {
  clientId: boolean | null;
  whyNeedGlasses: string;
  reasonableSteps: string;
  canMeetNeedOtherWay: string;
  supplierName: string;
  supplierId: string;
  amount: number;
  recoveryRate: number;
  directCredit: string;
  paymentReference: string;
  paymentCardNumber: string;
  incomeLabels?: IncomeLabels;
  income: {
    benefit: number;
    employment: number;
    familyTaxCredit: number;
    childSupport: number;
    childDisabilityAllowance: number;
    otherIncome: number;
  };
  costs: Array<{
    amount: number;
    cost: string;
  }>;
  decision: string;
  decisionReason: string;
}

export interface WhitewareFormData {
  clientId: boolean | null;
  whyNeedWhiteware: string;
  reasonableSteps: string;
  canMeetNeedOtherWay: string;
  supplierName: string;
  supplierId: string;
  amount: number;
  recoveryRate: number;
  directCredit: string;
  paymentReference: string;
  paymentCardNumber: string;
  incomeLabels?: IncomeLabels;
  // Whiteware Info section
  householdSize: string;
  addressContactConfirmed: string;
  spaceMeasured: string;
  specialDeliveryInstructions: string;
  deliveryInstructionsDetails: string;
  applianceModel: string;
  applianceCANumber: string;
  income: {
    benefit: number;
    employment: number;
    familyTaxCredit: number;
    childSupport: number;
    childDisabilityAllowance: number;
    otherIncome: number;
  };
  costs: Array<{
    amount: number;
    cost: string;
  }>;
  decision: string;
  decisionReason: string;
}

export interface BedsFormData {
  clientId: boolean | null;
  whyNeedBeds: string;
  reasonableSteps: string;
  canMeetNeedOtherWay: string;
  supplierName: string;
  supplierId: string;
  amount: number;
  recoveryRate: number;
  directCredit: string;
  paymentReference: string;
  paymentCardNumber: string;
  incomeLabels?: IncomeLabels;
  income: {
    benefit: number;
    employment: number;
    familyTaxCredit: number;
    childSupport: number;
    childDisabilityAllowance: number;
    otherIncome: number;
  };
  costs: Array<{
    amount: number;
    cost: string;
  }>;
  decision: string;
  decisionReason: string;
}

export interface BeddingFormData {
  clientId: boolean | null;
  whyNeedBedding: string;
  reasonableSteps: string;
  canMeetNeedOtherWay: string;
  supplierName: string;
  supplierId: string;
  amount: number;
  recoveryRate: number;
  directCredit: string;
  paymentReference: string;
  paymentCardNumber: string;
  incomeLabels?: IncomeLabels;
  income: {
    benefit: number;
    employment: number;
    familyTaxCredit: number;
    childSupport: number;
    childDisabilityAllowance: number;
    otherIncome: number;
  };
  costs: Array<{
    amount: number;
    cost: string;
  }>;
  decision: string;
  decisionReason: string;
}

export interface FurnitureFormData {
  clientId: boolean | null;
  whyNeedFurniture: string;
  furnitureType: string;
  reasonableSteps: string;
  canMeetNeedOtherWay: string;
  supplierName: string;
  supplierId: string;
  amount: number;
  recoveryRate: number;
  directCredit: string;
  paymentReference: string;
  paymentCardNumber: string;
  incomeLabels?: IncomeLabels;
  income: {
    benefit: number;
    employment: number;
    familyTaxCredit: number;
    childSupport: number;
    childDisabilityAllowance: number;
    otherIncome: number;
  };
  costs: Array<{
    amount: number;
    cost: string;
  }>;
  decision: string;
  decisionReason: string;
}

export interface DentalFormData {
  clientId: boolean | null;
  whyNeedDental: string;
  reasonableSteps: string;
  canMeetNeedOtherWay: string;
  sngEligible: string;
  sngBalance: number;
  supplierName: string;
  supplierId: string;
  amount: number;
  recoveryRate: number;
  directCredit: string;
  paymentReference: string;
  paymentCardNumber: string;
  incomeLabels?: IncomeLabels;
  income: {
    benefit: number;
    employment: number;
    familyTaxCredit: number;
    childSupport: number;
    childDisabilityAllowance: number;
    otherIncome: number;
  };
  costs: Array<{
    amount: number;
    cost: string;
  }>;
  decision: string;
  decisionReason: string;
}

export interface ElectricityFormData {
  clientId: boolean | null;
  whyNeedPower: string;
  reasonableSteps: string;
  canMeetNeedOtherWay: string;
  supplierName: string;
  supplierId: string;
  amount: number;
  recoveryRate: number;
  directCredit: string;
  paymentReference: string;
  paymentCardNumber: string;
  powerAccountNumber: string;
  incomeLabels?: IncomeLabels;
  income: {
    benefit: number;
    employment: number;
    familyTaxCredit: number;
    childSupport: number;
    childDisabilityAllowance: number;
    otherIncome: number;
  };
  costs: Array<{
    amount: number;
    cost: string;
  }>;
  decision: string;
  decisionReason: string;
  emailYourName: string;
  emailPaymentDate: string;
  emailAccountName: string;
  emailAccountNumber: string;
  emailAmount: number;
}

export interface TASGrantFormData {
  dateOfFirstContact: string;
  clientConsent: string;
  childSupportLiableCosts: string;
  childSupportAPIConsent: string;
  addressDetailsCorrect: string;
  contactDetailsCorrect: string;
  accommodationCosts: number;
  rentBoardIncludesUtilities: string;
  homeOwnershipCostsChanged: string;
  disabilityCostsChanged: string;
  tasCostsChanged: string;
  familyTaxCreditsCorrect: string;
  incomeCorrect: string;
  assetsCorrect: string;
  relationshipDetailsCorrect: string;
  verificationReceived: string;
  landlordDetailsCorrect: string;
  landlordType: string;
  landlordFirstName: string;
  landlordLastNameInitial: string;
  landlordOrganisationName: string;
  deficiency: number;
  tasRatePayable: number;
  necessaryReasonableSteps: string;
  clientUnderstandsObligations: string;
  outcome: string;
  regrantDate: string;
  furtherActionNeeded: string;
  lsumSent: string;
  arrearsIssued: number;
}

export interface DeclareIncomeFormData {
  weeks: Array<{
    id: string;
    weekBeginning: string;
    incomeSources: Array<{
      id: string;
      type: 'hourly' | 'lump-sum';
      description: string;
      hoursWorked?: number;
      hourlyRate?: number;
      lumpSumAmount?: number;
    }>;
  }>;
}

export interface AbsenceFromNZFormData {
  leavingDate: string;
  returnDate: string;
  reasonForTravel: string;
  benefitToContinue: boolean | null;
  arrearsIssued: boolean | null;
  arrearsAmount: number;
}

export interface ChangeOfAddressFormData {
  generalComments: string;
  newAddress: string;
  dateOfMove: string;
  dateNotified: string;
  asZone: string;
  accommodationType: string;
  accommodationCosts: Array<{
    label: string;
    amount: number;
    frequency: 'daily' | 'weekly' | 'fortnightly' | 'monthly';
  }>;
  tenancyAgreementProvided: string;
  landlordType: string;
  landlordFirstName: string;
  landlordLastNameInitial: string;
  landlordOrganisationName: string;
  newASRate: number;
  clientEligibleForTAS: string;
  arrearsCreated: string;
  arrearsAmount: number;
  debtCreated: string;
  debtAmount: number;
}

export type BenefitGrantDocumentStatus = 'unassigned' | 'provided' | 'not-provided';

export interface BenefitGrantDocument {
  name: string;
  status: BenefitGrantDocumentStatus;
}

export interface BenefitGrantFormData {
  benefitType: string;
  // Section 1: Identity
  onlineIdentityCheck: string;
  documentsSighted: string;
  documents: BenefitGrantDocument[];
  irdValidated: string;
  irdRequired: string;
  irdRequiredDetail: string;
  irdEvidenceRequired: string;
  irdEvidenceRequiredDetail: string;
  irdEvidenceLetterSent: string;
  evidenceReceived: string;
  // Section 2: Entitlement
  dateOfReps: string;
  dateOfEvent: string;
  reasonForEvent: string;
  holidayPay: string;
  income4Weeks: number;
  income26Weeks: number;
  income52Weeks: number;
  entitlementDate: string;
  standDown: string;
  commencementDate: string;
  // Section 3: Payment
  benefitRate: number;
  asRate: number;
  tasRate: number;
  daRate: number;
  wepRate: number;
  bankAccount: string;
  accommodationCost: number;
  hirePurchaseCosts: number;
  daCosts: number;
  // Section 4: Employment
  jsProfileUpdated: string;
  cvStatus: string;
  driversLicense: string;
  employmentDiscussion: string;
  barriersToEmployment: string;
  roiCompleted: string;
  arrears: number;
  arrearsPeriodFrom: string;
  arrearsPeriodTo: string;
  // Notes
  applicationNotes: string;
}

export const BENEFIT_GRANT_DOCUMENT_NAMES = [
  'Benefit application',
  '4x Payslips',
  'Final Payslip',
  'Bank Account Verification',
  'Asset Verification',
  'Tenancy Agreement',
  'CV',
  'Medical certificate',
  'IRD income summary',
];

export const createBenefitGrantDocuments = (): BenefitGrantDocument[] =>
  BENEFIT_GRANT_DOCUMENT_NAMES.map((name) => ({ name, status: 'unassigned' as const }));

function AppContent() {
  const { currentTheme, setCurrentTheme, customHeadingFormat, setCustomHeadingFormat } = useSettings();
  const location = useLocation();
  useInputActivityListener();

  // Initialize keep-alive service
  useEffect(() => {
    // Start the keep-alive service when the app mounts
    keepAliveService.start();
    
    // Initialize analytics tracking
    initAnalytics();
    
    // Cleanup: stop the service when the app unmounts
    return () => {
      keepAliveService.stop();
    };
  }, []);

  // Track page views on route changes
  useEffect(() => {
    trackPageView(location.pathname);
  }, [location.pathname]);

  return (
    <>
      <Navigation 
        currentTheme={currentTheme} 
        onThemeChange={setCurrentTheme}
        customHeadingFormat={customHeadingFormat}
        onCustomHeadingFormatChange={setCustomHeadingFormat}
      />
      <Suspense fallback={<div className="loading">Loading...</div>}>
        <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/food" element={<FoodPage />} />
        <Route path="/clothing" element={<ClothingPage />} />
        <Route path="/emergency" element={<EmergencyPage />} />
        <Route path="/work" element={<TransitionToWorkPage />} />
        <Route path="/rent-arrears" element={<RentArrearsPage />} />
        <Route path="/car" element={<CarRepairsPage />} />
        <Route path="/funeral" element={<FuneralAssistancePage />} />
        <Route path="/stranded-travel" element={<StrandedTravelPage />} />
        <Route path="/electricity" element={<ElectricityPage />} />
        <Route path="/dental" element={<DentalPage />} />
        <Route path="/beds" element={<BedsPage />} />
        <Route path="/bedding" element={<BeddingPage />} />
        <Route path="/furniture" element={<FurniturePage />} />
        <Route path="/glasses" element={<GlassesPage />} />
        <Route path="/whiteware" element={<WhitewarePage />} />
        <Route path="/bond" element={<BondRentPage />} />
        <Route path="/tas-grant" element={<TASGrantPage />} />
        <Route path="/declare-income" element={<DeclareIncomePage />} />
        <Route path="/adsd" element={<ADSDPage />} />
                  <Route path="/petrol-calculator" element={<PetrolCalculator />} />
        <Route path="/absence-from-nz" element={<AbsenceFromNZPage />} />
        <Route path="/multi-need" element={<MultiNeedPage />} />
        <Route path="/generic-template" element={<GenericTemplatePage />} />
        <Route path="/benefit-grant" element={<BenefitGrantPage />} />
        <Route path="/change-of-address" element={<ChangeOfAddressPage />} />
        <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
      
      {/* Footer */}
      <footer className="page-footer">
        <div className="page-footer-content">
          <p className="page-footer-text">Designed by Matt O'Connor</p>
          <p className="page-footer-email">
            <a href="mailto:Matt.O'Connor012@msd.govt.nz" className="page-footer-link">
              Any Questions? Email me 🙂
            </a>
          </p>
        </div>
      </footer>
    </>
  );
}

function App() {
  return (
    <SettingsProvider>
      <AppContent />
    </SettingsProvider>
  );
}

export default App; 