import React from 'react';
import { Link } from 'react-router-dom';
import { FoodFormData, ClothingFormData, RentArrearsFormData, CarRepairsFormData, FuneralAssistanceFormData, StrandedTravelFormData, TASGrantFormData, DeclareIncomeFormData, ADSDFormData, EmergencyFormData, TransitionToWorkFormData, AbsenceFromNZFormData, ChangeOfAddressFormData } from '../App';
import { DEFAULT_INCOME_LABELS, IncomeLabels } from './IncomeSection';
import { formatHeading, CustomHeadingFormat } from '../utils/headingFormatter';
import type { MultiNeedFormData, NeedItem } from '../types/multiNeed';
import { getNeedTypeLabel, hasExtraSection, getExtraSectionTitle } from '../types/multiNeed';

interface NoteOutputProps {
  formData: any;
  service?: 'food' | 'clothing' | 'electricity' | 'dental' | 'beds' | 'bedding' | 'furniture' | 'glasses' | 'whiteware' | 'tas-grant' | 'declare-income' | 'bond-rent' | 'rent-arrears' | 'car-repairs' | 'funeral-assistance' | 'stranded-travel' | 'adsd' | 'emergency' | 'transition-to-work' | 'petrol-calculator' | 'absence-from-nz' | 'multi-need' | 'generic-template' | 'change-of-address';
  onReset?: () => void;
  customHeadingFormat?: CustomHeadingFormat;
}

const NoteOutput: React.FC<NoteOutputProps> = ({ formData, service = 'food', onReset, customHeadingFormat = { useTildes: true, useCapitals: false, useBold: false } }) => {
  type IncomeKey = keyof IncomeLabels;
  type IncomeRecord = Record<IncomeKey, number>;
  type IncomeLabelsInput = Partial<IncomeLabels> | undefined;

  const INCOME_KEYS: IncomeKey[] = [
    'benefit',
    'employment',
    'familyTaxCredit',
    'childSupport',
    'childDisabilityAllowance',
    'otherIncome'
  ];

  const formatIncomeLines = (income: IncomeRecord, incomeLabels?: IncomeLabelsInput): string => {
    return INCOME_KEYS.reduce((lines, key) => {
      const amount = income[key] || 0;
      if (amount > 0) {
        const label =
          incomeLabels && incomeLabels[key] !== undefined
            ? incomeLabels[key]
            : DEFAULT_INCOME_LABELS[key];
        if (label) {
          return `${lines}$${amount.toFixed(2)} ${label}\n`;
        }
      }
      return lines;
    }, '');
  };

  // Helper functions to check if sections have data
  const hasPaymentData = (data: any): boolean => {
    return !!(
      (data.supplierName && data.supplierName.trim()) ||
      (data.supplierId && data.supplierId.trim()) ||
      (data.paymentCardNumber && data.paymentCardNumber.trim()) ||
      (data.amount && data.amount > 0) ||
      (data.recoveryRate && data.recoveryRate > 0) ||
      (data.directCredit === 'yes' && data.paymentReference) ||
      (data.bankAccount && data.bankAccount.trim()) ||
      (data.bondAmount && data.bondAmount > 0) ||
      (data.rentInAdvanceAmount && data.rentInAdvanceAmount > 0) ||
      (data.powerAccountNumber && data.powerAccountNumber.trim())
    );
  };

  const hasIncomeData = (income: IncomeRecord): boolean => {
    return Object.values(income).some(value => (value || 0) > 0);
  };

  const hasReasonableStepsData = (reasonableSteps?: string): boolean => {
    return !!(reasonableSteps && reasonableSteps.trim());
  };

  const hasOutcomeData = (decision?: string, decisionReason?: string): boolean => {
    return !!(decision || decisionReason);
  };

  const freqToWeeklyMultiplier = (freq?: 'daily' | 'weekly' | 'fortnightly' | 'monthly'): number => {
    switch (freq) {
      case 'daily':
        return 7;
      case 'fortnightly':
        return 1 / 2;
      case 'monthly':
        return 1 / 4.345; // average weeks per month
      case 'weekly':
      default:
        return 1;
    }
  };

  const formatFreq = (freq?: 'daily' | 'weekly' | 'fortnightly' | 'monthly'): string => {
    switch (freq) {
      case 'daily':
        return 'per day';
      case 'fortnightly':
        return 'per fortnight';
      case 'monthly':
        return 'per month';
      case 'weekly':
      default:
        return 'per week';
    }
  };

  // Helper function to format dates from Calendar component (DD/MM/YYYY format)
  const formatCalendarDate = (dateString: string): string => {
    if (!dateString) return '';
    
    // Handle DD/MM/YYYY format from Calendar component
    const parts = dateString.split('/');
    if (parts.length === 3) {
      return dateString; // Already in correct format
    } else {
      // Fallback for other date formats
      const date = new Date(dateString);
      if (!isNaN(date.getTime())) {
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
      } else {
        return dateString; // Return as-is if can't parse
      }
    }
  };

  // Generate note content for a single need
  const generateNeedContent = (need: NeedItem): string => {
    let content = '';
    const data = need.data as any;

    // Common fields
    if (data.whyNeedFood) content += `${data.whyNeedFood}\n\n`;
    if (data.whyNeedClothing) content += `${data.whyNeedClothing}\n\n`;
    if (data.whyNeedEmergencyPayment) content += `${data.whyNeedEmergencyPayment}\n\n`;
    if (data.whyNeedBeds) content += `${data.whyNeedBeds}\n\n`;
    if (data.whyNeedBedding) content += `${data.whyNeedBedding}\n\n`;
    if (data.whyNeedFurniture) content += `${data.whyNeedFurniture}\n\n`;
    if (data.whyNeedGlasses) content += `${data.whyNeedGlasses}\n\n`;
    if (data.whyNeedADSD) content += `${data.whyNeedADSD}\n\n`;
    if (data.whyNeedWhiteware) content += `${data.whyNeedWhiteware}\n\n`;
    if (data.whyNeedPower) content += `${data.whyNeedPower}\n\n`;
    if (need.type === 'electricity' && data.powerAccountNumber) {
      content += `Power account number: ${data.powerAccountNumber}\n`;
    }
    if (data.whyNeedDental) content += `${data.whyNeedDental}\n\n`;
    if (data.whyNeedCarRepairs) content += `${data.whyNeedCarRepairs}\n\n`;
    if (data.whyNeedRentArrears) content += `${data.whyNeedRentArrears}\n\n`;
    if (data.whyNeedAccommodation) content += `${data.whyNeedAccommodation}\n\n`;
    if (data.whyNeedFuneralAssistance) content += `${data.whyNeedFuneralAssistance}\n\n`;
    if (data.whyNeedStrandedTravelAssistance) content += `${data.whyNeedStrandedTravelAssistance}\n\n`;
    if (data.whyNeedTransitionToWork) content += `${data.whyNeedTransitionToWork}\n\n`;

    if (data.canMeetNeedOtherWay) {
      content += `Can meet need other way: ${data.canMeetNeedOtherWay}\n\n`;
    }

    if (data.rentArrearsVerification) {
      content += `Rent arrears verification: ${data.rentArrearsVerification}\n\n`;
    }

    // Food-specific
    if (data.foodAmountRequested > 0) {
      content += `Amount requested: $${data.foodAmountRequested.toFixed(2)}\n`;
    }
    if (data.currentFoodBalance !== undefined) {
      content += `Current food balance: $${data.currentFoodBalance.toFixed(2)}\n`;
    }
    if (data.hardshipUnforeseen) {
      content += `Hardship unforeseen: ${data.hardshipUnforeseen}\n`;
    }
    if (data.unforeseenCircumstance) {
      content += `Unforeseen circumstance: ${data.unforeseenCircumstance}\n`;
    }

    // Furniture-specific
    if (data.furnitureType) {
      content += `Furniture type: ${data.furnitureType}\n`;
    }

    return content;
  };

  // Generate extra section content (car details, whiteware info, etc.)
  const generateExtraSectionContent = (need: NeedItem): string => {
    let content = '';
    const data = need.data as any;

    if (need.type === 'car-repairs') {
      content += `${formatHeading(getExtraSectionTitle(need.type), 'custom', customHeadingFormat)}\n`;
      if (data.vehicleMakeModel) content += `Vehicle: ${data.vehicleMakeModel}\n`;
      if (data.licensePlate) content += `License plate: ${data.licensePlate}\n`;
      if (data.odometer) content += `Odometer: ${data.odometer}\n`;
      if (data.vehicleOwner) content += `Owner: ${data.vehicleOwner}\n`;
      if (data.nztaVerification) content += `NZTA verification: ${data.nztaVerification}\n`;
      content += '\n';
    } else if (need.type === 'whiteware') {
      content += `${formatHeading(getExtraSectionTitle(need.type), 'custom', customHeadingFormat)}\n`;
      if (data.householdSize) content += `Household size: ${data.householdSize}\n`;
      content += '\n';
    } else if (need.type === 'dental') {
      content += `${formatHeading(getExtraSectionTitle(need.type), 'custom', customHeadingFormat)}\n`;
      if (data.sngEligible) content += `SNG eligible: ${data.sngEligible}\n`;
      if (data.sngBalance !== undefined) content += `SNG balance: $${data.sngBalance.toFixed(2)}\n`;
      content += '\n';
    } else if (need.type === 'bond-rent') {
      content += `${formatHeading(getExtraSectionTitle(need.type), 'custom', customHeadingFormat)}\n`;
      if (data.newAddress) content += `New address: ${data.newAddress}\n`;
      if (data.asZone) content += `AS Zone: ${data.asZone}\n`;
      if (data.weeklyRent) content += `Weekly rent: $${data.weeklyRent.toFixed(2)}\n`;
      if (data.tenancyStartDate) content += `Tenancy start: ${data.tenancyStartDate}\n`;
      if (data.bondAmount) content += `Bond amount: $${data.bondAmount.toFixed(2)}\n`;
      if (data.rentInAdvanceAmount) content += `Rent in advance: $${data.rentInAdvanceAmount.toFixed(2)}\n`;
      if (data.bondPaymentAmount) content += `Bond payment amount: $${data.bondPaymentAmount.toFixed(2)}\n`;
      if (data.rentAdvancePaymentAmount)
        content += `Rent in advance payment amount: $${data.rentAdvancePaymentAmount.toFixed(2)}\n`;
      if (data.tenancyAffordable) content += `Tenancy affordable: ${data.tenancyAffordable}\n`;
      content += '\n';
    } else if (need.type === 'funeral-assistance' || need.type === 'stranded-travel') {
      content += `${formatHeading(getExtraSectionTitle(need.type), 'custom', customHeadingFormat)}\n`;
      if (data.petrolAssistance) content += `Petrol assistance: ${data.petrolAssistance}\n`;
      if (data.startLocation) content += `From: ${data.startLocation}\n`;
      if (data.destination) content += `To: ${data.destination}\n`;
      if (data.returnTrip) content += `Return trip: ${data.returnTrip}\n`;
      if (data.distance) content += `Distance: ${data.distance} km\n`;
      if (data.travelCost) content += `Travel cost: $${data.travelCost.toFixed(2)}\n`;
      content += '\n';
    } else if (need.type === 'transition-to-work') {
      content += `${formatHeading(getExtraSectionTitle(need.type), 'custom', customHeadingFormat)}\n`;
      if (data.helpType) content += `Help type: ${data.helpType}\n`;
      if (data.employerName) content += `Employer: ${data.employerName}\n`;
      if (data.startDate) content += `Start date: ${data.startDate}\n`;
      if (data.hoursPerWeek) content += `Hours per week: ${data.hoursPerWeek}\n`;
      if (data.firstPayday) content += `First payday: ${data.firstPayday}\n`;
      if (data.contractUploaded) content += `Contract uploaded: ${data.contractUploaded}\n`;
      if (data.petrolAssistance) {
        content += `Petrol assistance: ${data.petrolAssistance}\n`;
        if (data.startLocation) content += `From: ${data.startLocation}\n`;
        if (data.destination) content += `To: ${data.destination}\n`;
        if (data.distance) content += `Distance: ${data.distance} km\n`;
        if (data.travelCost) content += `Travel cost: $${data.travelCost.toFixed(2)}\n`;
      }
      content += '\n';
    }

    return content;
  };

  // Generate multi-need note
  const generateMultiNeedNote = (data: MultiNeedFormData): string => {
    let note = '';

    // CCID
    note += `CCID: ${data.clientId ? 'Yes' : 'No'}\n\n`;

    // All Needs
    data.needs.forEach((need, index) => {
      note += `${formatHeading(`Need ${index + 1} - ${getNeedTypeLabel(need.type)}`, 'custom', customHeadingFormat)}\n`;
      note += generateNeedContent(need);
      
      note += '\n\n';
      
      // Add extra sections if applicable
      if (hasExtraSection(need.type)) {
        note += generateExtraSectionContent(need);
        note += '\n';
      }
    });

    // Reasonable Steps (once, after all needs)
    if (data.reasonableSteps && data.reasonableSteps.trim()) {
      note += `${formatHeading('Reasonable Steps', 'custom', customHeadingFormat)}\n`;
      note += `${data.reasonableSteps}\n\n`;
    }

    // Shared Income
    if (hasIncomeData(data.income)) {
      note += `${formatHeading('Income', 'custom', customHeadingFormat)}\n`;
      note += formatIncomeLines(data.income, data.incomeLabels);

      // Costs
      const totalCosts = data.costs.reduce((sum, cost) => sum + cost.amount, 0);
      if (totalCosts > 0) {
        data.costs.forEach(cost => {
          if (cost.amount > 0) {
            note += `$${cost.amount.toFixed(2)} ${cost.cost}\n`;
          }
        });
      }

      // Calculate remaining
      const totalIncome = Object.values(data.income).reduce((sum, val) => sum + val, 0);
      const remaining = totalIncome - totalCosts;
      note += `\nClient is left with: $${remaining.toFixed(2)}\n\n`;
    }

    // All Payments
    data.needs.forEach((need) => {
      if (hasPaymentData(need.payment)) {
        note += `${formatHeading(`Payment - ${getNeedTypeLabel(need.type)}`, 'custom', customHeadingFormat)}\n`;
        if (need.payment.supplierName) note += `Supplier Name: ${need.payment.supplierName}\n`;
        if (need.payment.supplierId) note += `Supplier ID: ${need.payment.supplierId}\n`;
        if (need.payment.paymentCardNumber) note += `Payment card number: ${need.payment.paymentCardNumber}\n`;
        if (need.payment.amount > 0) note += `Amount: $${need.payment.amount.toFixed(2)}\n`;
        if (need.payment.recoveryRate > 0) note += `Recovery rate: $${need.payment.recoveryRate.toFixed(2)}\n`;
        if (need.payment.bankAccount) note += `Bank account: ${need.payment.bankAccount}\n`;
        if (need.payment.directCredit) note += `Direct credit: ${need.payment.directCredit}\n`;
        if (need.payment.paymentReference) note += `Payment reference: ${need.payment.paymentReference}\n`;
        if (need.payment.powerAccountNumber) note += `Power account number: ${need.payment.powerAccountNumber}\n`;
        note += '\n';
      }
    });

    // Per-Need Decisions
    const hasAnyDecision = data.needs.some((need) => need.decision.decision || need.decision.decisionReason);
    if (hasAnyDecision) {
      note += `${formatHeading('Decision', 'custom', customHeadingFormat)}\n`;
      data.needs.forEach((need) => {
        if (need.decision.decision) {
          const decisionText = need.decision.decision.charAt(0).toUpperCase() + need.decision.decision.slice(1);
          note += `${getNeedTypeLabel(need.type)} - ${decisionText}\n`;
          if (need.decision.decisionReason) {
            note += `${need.decision.decisionReason}\n`;
          }
        }
      });
    }

    return note;
  };

  const generateNote = () => {
    // Check if this is a multi-need form
    if (service === 'multi-need' || (formData.needs && Array.isArray(formData.needs))) {
      return generateMultiNeedNote(formData as MultiNeedFormData);
    }

    if (service === 'absence-from-nz') {
      // Absence from NZ note output
      const a: AbsenceFromNZFormData = formData;
      let note = '';
      
      if (a.leavingDate) {
        note += `Leaving date: ${formatCalendarDate(a.leavingDate)}\n`;
      }
      
      if (a.returnDate) {
        note += `Return date: ${formatCalendarDate(a.returnDate)}\n`;
      }
      
      if (a.reasonForTravel && a.reasonForTravel.trim()) {
        note += `Reason for travel: ${a.reasonForTravel}\n`;
      }
      
      // Calculate total days between leaving and return date
      if (a.leavingDate && a.returnDate) {
        const parseDateDDMMYYYY = (dateStr: string) => {
          const parts = dateStr.split('/');
          if (parts.length === 3) {
            const day = parseInt(parts[0]);
            const month = parseInt(parts[1]) - 1; // JavaScript months are 0-indexed
            const year = parseInt(parts[2]);
            return new Date(year, month, day);
          }
          return null;
        };
        
        const leavingDateObj = parseDateDDMMYYYY(a.leavingDate);
        const returnDateObj = parseDateDDMMYYYY(a.returnDate);
        
        if (leavingDateObj && returnDateObj) {
          const diffTime = returnDateObj.getTime() - leavingDateObj.getTime();
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          note += `Total days: ${diffDays}\n`;
        }
      }
      
      if (a.benefitToContinue !== null) {
        note += `Benefit to continue: ${a.benefitToContinue ? 'Yes' : 'No'}\n`;
      }
      
      if (a.arrearsIssued !== null && a.arrearsIssued) {
        note += `Arrears issued: Yes\n`;
        if (a.arrearsAmount && a.arrearsAmount > 0) {
          note += `Arrears amount: $${a.arrearsAmount.toFixed(2)}\n`;
        }
      } else if (a.arrearsIssued === false) {
        note += `Arrears issued: No\n`;
      }
      
      return note;
    } else if (service === 'change-of-address') {
      // Change of Address note output
      const c: ChangeOfAddressFormData = formData;
      let note = '';
      
      // General comments
      if (c.generalComments && c.generalComments.trim()) {
        note += `${formatHeading('General Comments', 'custom', customHeadingFormat)}\n`;
        note += `${c.generalComments.trim()}\n\n`;
      }
      
      // Address and Dates
      if ((c.newAddress && c.newAddress.trim()) || c.dateOfMove || c.dateNotified) {
        note += `${formatHeading('Address and Dates', 'custom', customHeadingFormat)}\n`;
        if (c.newAddress && c.newAddress.trim()) {
          note += `New address: ${c.newAddress}\n`;
        }
        if (c.dateOfMove) {
          note += `Date of move: ${formatCalendarDate(c.dateOfMove)}\n`;
        }
        if (c.dateNotified) {
          note += `Date notified: ${formatCalendarDate(c.dateNotified)}\n`;
        }
        note += '\n';
      }
      
      // Accommodation Details
      const hasCosts = c.accommodationCosts && c.accommodationCosts.length > 0;

      if (
        c.asZone ||
        c.accommodationType ||
        hasCosts ||
        c.tenancyAgreementProvided ||
        (c.newASRate && c.newASRate > 0) ||
        c.clientEligibleForTAS
      ) {
        note += `${formatHeading('Accommodation Details', 'custom', customHeadingFormat)}\n`;
        if (c.asZone) {
          note += `AS zone: ${c.asZone}\n`;
        }
        if (c.accommodationType) {
          note += `Accommodation type: ${c.accommodationType}\n`;
        }

        if (hasCosts) {
          let weeklyTotal = 0;
          let filledCount = 0;
          c.accommodationCosts.forEach((cost) => {
            if (cost.amount && cost.amount > 0) {
              filledCount += 1;
              weeklyTotal += cost.amount * freqToWeeklyMultiplier(cost.frequency);
              note += `${cost.label || 'Cost'}: $${cost.amount.toFixed(2)} ${formatFreq(cost.frequency)}\n`;
            }
          });
          if (weeklyTotal > 0 && filledCount > 1) {
            note += '--------------\n';
            note += `Total: $${weeklyTotal.toFixed(2)} per week\n`;
          }
        }
        if (c.tenancyAgreementProvided) {
          note += `Tenancy agreement provided: ${c.tenancyAgreementProvided === 'yes' ? 'Yes' : 'No'}\n`;
        }
        if (c.newASRate && c.newASRate > 0) {
          note += `New AS rate: $${c.newASRate.toFixed(2)}\n`;
        }
        if (c.clientEligibleForTAS) {
          note += `Client is eligible for TAS: ${c.clientEligibleForTAS === 'yes' ? 'Yes' : 'No'}\n`;
        }
        note += '\n';
      }
      
      // Arrears and Debt
      if (c.arrearsCreated || c.debtCreated) {
        note += `${formatHeading('Arrears and Debt', 'custom', customHeadingFormat)}\n`;
        if (c.arrearsCreated) {
          note += `Arrears created: ${c.arrearsCreated === 'yes' ? 'Yes' : 'No'}\n`;
          if (c.arrearsCreated === 'yes' && c.arrearsAmount && c.arrearsAmount > 0) {
            note += `Arrears amount: $${c.arrearsAmount.toFixed(2)}\n`;
          }
        }
        if (c.debtCreated) {
          note += `Debt created: ${c.debtCreated === 'yes' ? 'Yes' : 'No'}\n`;
          if (c.debtCreated === 'yes' && c.debtAmount && c.debtAmount > 0) {
            note += `Debt amount: $${c.debtAmount.toFixed(2)}\n`;
          }
        }
      }
      
      return note;
    } else if (service === 'declare-income') {
      // Declare Income note output
      const d: DeclareIncomeFormData = formData;
      let note = '';
      
      if (d.weeks.length === 0) {
        note += 'No income declared.\n';
        return note;
      }

      d.weeks.forEach((week) => {
        note += `Week Beginning ${week.weekBeginning || 'Not specified'}:\n`;
        
        if (week.incomeSources.length === 0) {
          note += 'No income sources declared for this week.\n';
        } else {
          let weekTotal = 0;
          week.incomeSources.forEach((source) => {
            note += `${source.description || 'No description'}\n`;
            
            if (source.type === 'hourly') {
              const hours = source.hoursWorked || 0;
              const rate = source.hourlyRate || 0;
              const calculated = hours * rate;
              weekTotal += calculated;
              note += `- Type: Hourly Rate\n`;
              note += `- Hours Worked: ${hours}\n`;
              note += `- Hourly Rate: $${rate.toFixed(2)}\n`;
              note += `- Calculated Income: $${calculated.toFixed(2)}\n`;
            } else if (source.type === 'lump-sum') {
              const amount = source.lumpSumAmount || 0;
              weekTotal += amount;
              note += `- Type: Lump Sum\n`;
              note += `- Amount: $${amount.toFixed(2)}\n`;
            }
          });
          
          note += `Total weekly income: $${weekTotal.toFixed(2)}\n`;
        }
        
        note += '\n';
      });

      return note;
    } else if (service === 'tas-grant') {
      // TAS Grant/Reapplication note output
      const t: TASGrantFormData = formData;
      let note = '';
      
      // Only show fields that have been filled in
      if (t.dateOfFirstContact) {
        note += `Date of first contact: ${t.dateOfFirstContact}\n`;
      }
      
      if (t.clientConsent) {
        note += `Client consented to re-application being completed on their behalf: ${t.clientConsent === 'yes' ? 'Yes' : 'No'}\n`;
      }
      
      if (t.addressDetailsCorrect) {
        note += `Address details correct: ${t.addressDetailsCorrect === 'yes' ? 'Yes' : 'No'}\n`;
      }
      
      if (t.contactDetailsCorrect) {
        note += `Contact details correct: ${t.contactDetailsCorrect === 'yes' ? 'Yes' : 'No'}\n`;
      }
      
      if (t.accommodationCosts && t.accommodationCosts > 0) {
        note += `SWIFTT Accommodation costs: $${t.accommodationCosts.toFixed(2)}\n`;
      }
      
      if (t.rentBoardIncludesUtilities) {
        note += `Checked if Rent/Board costs include utilities: ${t.rentBoardIncludesUtilities === 'yes' ? 'Yes' : 'No'}\n`;
      }
      
      if (t.homeOwnershipCostsChanged) {
        note += `Checked if Home Ownership costs have changed: ${t.homeOwnershipCostsChanged === 'yes' ? 'Yes' : 'No'}\n`;
      }
      
      if (t.verificationReceived) {
        note += `If allowable costs are updated has verification been received? ${t.verificationReceived === 'yes' ? 'Yes' : 'No'}\n`;
      }
      
      if (t.disabilityCostsChanged) {
        note += `SWIFTT Disability costs: $ [${t.disabilityCostsChanged === 'yes' ? 'updated' : 'no change'}]\n`;
      }
      
      if (t.tasCostsChanged) {
        note += `SWIFTT TAS costs: ${t.tasCostsChanged === 'yes' ? 'Yes' : 'No'}\n`;
      }
      
      if (t.familyTaxCreditsCorrect) {
        note += `If FTC is paid by IRD is SWIFTT amount correct: ${t.familyTaxCreditsCorrect === 'yes' ? 'Yes' : 'No'}\n`;
      }
      
      if (t.incomeCorrect) {
        note += `SWIFTT Income is correct: ${t.incomeCorrect === 'yes' ? 'Yes' : 'No'}\n`;
      }
      
      if (t.assetsCorrect) {
        note += `SWIFTT Assets are correct: ${t.assetsCorrect === 'yes' ? 'Yes' : 'No'}\n`;
      }
      
      if (t.relationshipDetailsCorrect) {
        note += `Relationship details are correct: ${t.relationshipDetailsCorrect === 'yes' ? 'Yes' : 'No'}\n`;
      }
      
      if (t.childSupportLiableCosts) {
        note += `Does the client have Child Support liable costs? ${t.childSupportLiableCosts === 'yes' ? 'Yes' : 'No'}\n`;
        if (t.childSupportLiableCosts === 'yes' && t.childSupportAPIConsent) {
          note += `Child Support API consent given? ${t.childSupportAPIConsent === 'yes' ? 'Yes' : 'No'}\n`;
        }
      }
      
      if (t.deficiency && t.deficiency > 0) {
        note += `Deficiency: $${t.deficiency.toFixed(2)}\n`;
      }
      
      if (t.tasRatePayable && t.tasRatePayable > 0) {
        note += `TAS rate payable: $${t.tasRatePayable.toFixed(2)}\n`;
      }
      
      if (t.necessaryReasonableSteps && t.necessaryReasonableSteps.trim()) {
        note += `Necessary and reasonable steps discussed: ${t.necessaryReasonableSteps}\n`;
      }
      
      if (t.clientUnderstandsObligations) {
        note += `Read obligations to client, client understands: ${t.clientUnderstandsObligations === 'yes' ? 'Yes' : 'No'}\n`;
      }
      
      // Outcome section
      if (t.outcome) {
        let outcomeText = '';
        if (t.outcome === 'granted') {
          outcomeText = `granted from ${t.regrantDate || t.dateOfFirstContact}`;
        } else if (t.outcome === 'regranted') {
          outcomeText = `re-granted from ${t.regrantDate || t.dateOfFirstContact}`;
        } else if (t.outcome === 'no-entitlement') {
          outcomeText = 'no entitlement';
        } else if (t.outcome === 'client-declined') {
          outcomeText = 'client declined to re-apply';
        } else if (t.outcome === 'not-regranted') {
          outcomeText = 'not re-granted - further action needed';
        }
        if (outcomeText) {
          note += `Outcome: ${outcomeText}\n`;
        }
      }
      
      if (t.outcome === 'not-regranted' && t.furtherActionNeeded && t.furtherActionNeeded.trim()) {
        note += `Further action needed: ${t.furtherActionNeeded}\n`;
      }
      
      if (t.lsumSent) {
        note += `LSUM sent: ${t.lsumSent === 'yes' ? 'Yes' : 'No'}\n`;
      }
      
      // Only show Arrears issued if it has a value greater than 0
      if (t.arrearsIssued && t.arrearsIssued > 0) {
        note += `Arrears issued: $${t.arrearsIssued.toFixed(2)}\n`;
      }
      
      return note;
    } else if (service === 'clothing') {
      // Clothing note output
      const c: ClothingFormData = formData;
      let note = '';
      note += `CCID: ${c.clientId === false ? 'No' : 'Yes'}\n\n`;
      note += `${formatHeading('Need', 'custom', customHeadingFormat)}\n`;
      if (c.whyNeedClothing) {
        note += `${c.whyNeedClothing}\n`;
      }

      if (hasPaymentData(c)) {
        note += `\n${formatHeading('Payment', 'custom', customHeadingFormat)}\n`;
        if (c.supplierName && c.supplierName.trim()) {
          note += `Supplier Name: ${c.supplierName}\n`;
        }
        if (c.supplierId && c.supplierId.trim()) {
          note += `Supplier ID: ${c.supplierId}\n`;
        }
        if (c.paymentCardNumber && c.paymentCardNumber.trim()) {
          note += `Payment card number: ${c.paymentCardNumber}\n`;
        }
        if (c.amount && c.amount > 0) {
          note += `Amount: $${c.amount.toFixed(2)}\n`;
        }
        if (c.recoveryRate && c.recoveryRate > 0) {
          note += `Recovery rate: $${c.recoveryRate.toFixed(2)}\n`;
        }
        if (c.directCredit === 'yes' && c.paymentReference) {
          note += `Reference number: ${c.paymentReference}\n`;
        }
      }
      if (hasIncomeData(c.income)) {
        note += `\n${formatHeading('Income', 'custom', customHeadingFormat)}\n`;
        note += formatIncomeLines(c.income, c.incomeLabels);
        c.costs.forEach((cost: { amount: number; cost: string }) => {
          if (cost.amount > 0) note += `-$${cost.amount.toFixed(2)} ${cost.cost}\n`;
        });
        if (c.costs.length > 0) {
          const totalIncome = (Object.values(c.income) as number[]).reduce((sum: number, value: number) => sum + (value || 0), 0);
          const totalCosts = c.costs.reduce((sum: number, cost: { amount: number; cost: string }) => sum + (cost.amount || 0), 0);
          const remainingIncome = totalIncome - totalCosts;
          note += '--------------\n';
          note += `Client is left with $${remainingIncome.toFixed(2)}\n`;
        }
      }
      if (hasReasonableStepsData(c.reasonableSteps)) {
        note += `\n${formatHeading('Reasonable Steps', 'custom', customHeadingFormat)}\n`;
        note += `${c.reasonableSteps}\n`;
      }
      if (hasOutcomeData(c.decision, c.decisionReason)) {
        note += `\n${formatHeading('Outcome', 'custom', customHeadingFormat)}\n`;
        if (c.decision === 'approved') note += 'APPLICATION APPROVED\n';
        else if (c.decision === 'declined') note += 'APPLICATION DECLINED\n';
        if (c.decisionReason) note += `${c.decisionReason}\n`;
      }
      return note;
    } else if (service === 'emergency') {
      // Emergency Payment note output (same template as clothing)
      const e: EmergencyFormData = formData;
      let note = '';
      note += `CCID: ${e.clientId === false ? 'No' : 'Yes'}\n\n`;
      note += `${formatHeading('Need', 'custom', customHeadingFormat)}\n`;
      if (e.whyNeedEmergencyPayment) {
        note += `${e.whyNeedEmergencyPayment}\n`;
      }

      if (hasPaymentData(e)) {
        note += `\n${formatHeading('Payment', 'custom', customHeadingFormat)}\n`;
        if (e.supplierName && e.supplierName.trim()) {
          note += `Supplier Name: ${e.supplierName}\n`;
        }
        if (e.supplierId && e.supplierId.trim()) {
          note += `Supplier ID: ${e.supplierId}\n`;
        }
        if (e.paymentCardNumber && e.paymentCardNumber.trim()) {
          note += `Payment card number: ${e.paymentCardNumber}\n`;
        }
        if (e.amount && e.amount > 0) {
          note += `Amount: $${e.amount.toFixed(2)}\n`;
        }
        if (e.recoveryRate && e.recoveryRate > 0) {
          note += `Recovery rate: $${e.recoveryRate.toFixed(2)}\n`;
        }
        if (e.directCredit === 'yes' && e.paymentReference) {
          note += `Reference number: ${e.paymentReference}\n`;
        }
      }
      if (hasIncomeData(e.income)) {
        note += `\n${formatHeading('Income', 'custom', customHeadingFormat)}\n`;
        note += formatIncomeLines(e.income, e.incomeLabels);
        e.costs.forEach((cost: { amount: number; cost: string }) => {
          if (cost.amount > 0) note += `-$${cost.amount.toFixed(2)} ${cost.cost}\n`;
        });
        if (e.costs.length > 0) {
          const totalIncome = (Object.values(e.income) as number[]).reduce((sum: number, value: number) => sum + (value || 0), 0);
          const totalCosts = e.costs.reduce((sum: number, cost: { amount: number; cost: string }) => sum + (cost.amount || 0), 0);
          const remainingIncome = totalIncome - totalCosts;
          note += '--------------\n';
          note += `Client is left with $${remainingIncome.toFixed(2)}\n`;
        }
      }
      if (hasReasonableStepsData(e.reasonableSteps)) {
        note += `\n${formatHeading('Reasonable Steps', 'custom', customHeadingFormat)}\n`;
        note += `${e.reasonableSteps}\n`;
      }
      if (hasOutcomeData(e.decision, e.decisionReason)) {
        note += `\n${formatHeading('Outcome', 'custom', customHeadingFormat)}\n`;
        if (e.decision === 'approved') note += 'APPLICATION APPROVED\n';
        else if (e.decision === 'declined') note += 'APPLICATION DECLINED\n';
        if (e.decisionReason) note += `${e.decisionReason}\n`;
      }
      return note;
    } else if (service === 'generic-template') {
      // Generic Template note output (same template as emergency)
      const e: EmergencyFormData = formData;
      let note = '';
      note += `CCID: ${e.clientId === false ? 'No' : 'Yes'}\n\n`;
      note += `${formatHeading('Need', 'custom', customHeadingFormat)}\n`;
      if (e.whyNeedEmergencyPayment) {
        note += `${e.whyNeedEmergencyPayment}\n`;
      }

      if (hasPaymentData(e)) {
        note += `\n${formatHeading('Payment', 'custom', customHeadingFormat)}\n`;
        if (e.supplierName && e.supplierName.trim()) {
          note += `Supplier Name: ${e.supplierName}\n`;
        }
        if (e.supplierId && e.supplierId.trim()) {
          note += `Supplier ID: ${e.supplierId}\n`;
        }
        if (e.paymentCardNumber && e.paymentCardNumber.trim()) {
          note += `Payment card number: ${e.paymentCardNumber}\n`;
        }
        if (e.amount && e.amount > 0) {
          note += `Amount: $${e.amount.toFixed(2)}\n`;
        }
        if (e.recoveryRate && e.recoveryRate > 0) {
          note += `Recovery rate: $${e.recoveryRate.toFixed(2)}\n`;
        }
        if (e.directCredit === 'yes' && e.paymentReference) {
          note += `Reference number: ${e.paymentReference}\n`;
        }
      }
      if (hasIncomeData(e.income)) {
        note += `\n${formatHeading('Income', 'custom', customHeadingFormat)}\n`;
        note += formatIncomeLines(e.income, e.incomeLabels);
        e.costs.forEach((cost: { amount: number; cost: string }) => {
          if (cost.amount > 0) note += `-$${cost.amount.toFixed(2)} ${cost.cost}\n`;
        });
        if (e.costs.length > 0) {
          const totalIncome = (Object.values(e.income) as number[]).reduce((sum: number, value: number) => sum + (value || 0), 0);
          const totalCosts = e.costs.reduce((sum: number, cost: { amount: number; cost: string }) => sum + (cost.amount || 0), 0);
          const remainingIncome = totalIncome - totalCosts;
          note += '--------------\n';
          note += `Client is left with $${remainingIncome.toFixed(2)}\n`;
        }
      }
      if (hasReasonableStepsData(e.reasonableSteps)) {
        note += `\n${formatHeading('Reasonable Steps', 'custom', customHeadingFormat)}\n`;
        note += `${e.reasonableSteps}\n`;
      }
      if (hasOutcomeData(e.decision, e.decisionReason)) {
        note += `\n${formatHeading('Outcome', 'custom', customHeadingFormat)}\n`;
        if (e.decision === 'approved') note += 'APPLICATION APPROVED\n';
        else if (e.decision === 'declined') note += 'APPLICATION DECLINED\n';
        if (e.decisionReason) note += `${e.decisionReason}\n`;
      }
      return note;
    } else if (service === 'transition-to-work') {
      // Transition to Work Grant note output
      const t: TransitionToWorkFormData = formData;
      let note = '';
      note += `CCID: ${t.clientId === false ? 'No' : 'Yes'}\n\n`;
      
      note += `${formatHeading('Need', 'custom', customHeadingFormat)}\n`;
      if (t.helpType) {
        note += `Client is requesting help with ${t.helpType}\n`;
      }
      
      if (t.helpType.includes('Bridging costs') && t.firstPayday) {
        note += `\nDate of first payday: ${formatCalendarDate(t.firstPayday)}\n`;
      }
      
      if (t.whyNeedTransitionToWork) {
        note += `\n${t.whyNeedTransitionToWork}\n`;
      }
      
      if (t.contractUploaded) {
        note += `\nContract uploaded: ${t.contractUploaded === 'yes' ? 'Yes' : 'No'}\n`;
      }

      if (t.employerName || t.startDate || t.hoursPerWeek > 0) {
        note += `\n${formatHeading('Employment Info', 'custom', customHeadingFormat)}\n`;
        if (t.employerName) note += `Employer: ${t.employerName}\n`;
        if (t.startDate) {
          note += `Start date: ${formatCalendarDate(t.startDate)}\n`;
        }
        if (t.hoursPerWeek > 0) note += `Hours per week: ${t.hoursPerWeek}\n`;
      }

      if (t.petrolAssistance === 'yes' && (t.startLocation || t.destination)) {
        note += `\n${formatHeading('Travel Details', 'custom', customHeadingFormat)}\n`;
        if (t.startLocation && t.destination) {
          note += `Travelling from: ${t.startLocation} to ${t.destination}\n`;
        }
        if (t.returnTrip) {
          note += `Return trip: ${t.returnTrip === 'yes' ? 'Yes' : 'No'}\n`;
        }
        if (t.distance > 0) {
          note += `Distance: ${t.distance.toFixed(1)} km\n`;
        }
        if (t.travelCost > 0) {
          note += `Calculated Cost of travel: $${t.travelCost.toFixed(2)}\n`;
        }
      }

      if (hasPaymentData(t)) {
        note += `\n${formatHeading('Payment', 'custom', customHeadingFormat)}\n`;
        if (t.supplierName && t.supplierName.trim()) {
          note += `Supplier Name: ${t.supplierName}\n`;
        }
        if (t.supplierId && t.supplierId.trim()) {
          note += `Supplier ID: ${t.supplierId}\n`;
        }
        if (t.paymentCardNumber && t.paymentCardNumber.trim()) {
          note += `Payment card number: ${t.paymentCardNumber}\n`;
        }
        if (t.amount && t.amount > 0) {
          note += `Amount: $${t.amount.toFixed(2)}\n`;
        }
        if (t.recoveryRate && t.recoveryRate > 0) {
          note += `Recovery rate: $${t.recoveryRate.toFixed(2)}\n`;
        }
        if (t.directCredit === 'yes' && t.paymentReference) {
          note += `Reference number: ${t.paymentReference}\n`;
        }
      }
      if (hasIncomeData(t.income)) {
        note += `\n${formatHeading('Income', 'custom', customHeadingFormat)}\n`;
        note += formatIncomeLines(t.income, t.incomeLabels);
        t.costs.forEach((cost: { amount: number; cost: string }) => {
          if (cost.amount > 0) note += `-$${cost.amount.toFixed(2)} ${cost.cost}\n`;
        });
        if (t.costs.length > 0) {
          const totalIncome = (Object.values(t.income) as number[]).reduce((sum: number, value: number) => sum + (value || 0), 0);
          const totalCosts = t.costs.reduce((sum: number, cost: { amount: number; cost: string }) => sum + (cost.amount || 0), 0);
          const remainingIncome = totalIncome - totalCosts;
          note += '--------------\n';
          note += `Client is left with $${remainingIncome.toFixed(2)}\n`;
        }
      }
      
      if (hasOutcomeData(t.decision, t.decisionReason)) {
        note += `\n${formatHeading('Outcome', 'custom', customHeadingFormat)}\n`;
        if (t.decision === 'approved') note += 'APPLICATION APPROVED\n';
        else if (t.decision === 'declined') note += 'APPLICATION DECLINED\n';
        if (t.decisionReason) note += `${t.decisionReason}\n`;
      }
      return note;
    } else if (service === 'petrol-calculator') {
      // Petrol Calculator note output
      const p = formData;
      let note = '';
      
      note += `${formatHeading('Travel Details', 'custom', customHeadingFormat)}\n`;
      if (p.startLocation && p.destination) {
        note += `Travelling from: ${p.startLocation} to ${p.destination}\n`;
      }
      if (p.returnTrip) {
        note += `Return trip: ${p.returnTrip === 'yes' ? 'Yes' : 'No'}\n`;
      }
      if (p.distance > 0) {
        const totalDistance = p.returnTrip === 'yes' ? p.distance * 2 : p.distance;
        note += `Distance: ${totalDistance.toFixed(1)} km\n`;
      }
      if (p.vehicleMakeModel) {
        note += `Vehicle: ${p.vehicleMakeModel}\n`;
      }
      if (p.vehicleMileage) {
        note += `Vehicle mileage: ${p.vehicleMileage} L/100km\n`;
      }
      if (p.petrolCost) {
        note += `Petrol cost: $${p.petrolCost} per litre\n`;
      }
      if (p.calculatedCost > 0) {
        note += `Calculated Cost of travel: $${p.calculatedCost.toFixed(2)}\n`;
      }
      
      return note;
    } else if (service === 'adsd') {
      // ADSD note output
      const a: ADSDFormData = formData;
      let note = '';
      note += `CCID: ${a.clientId === false ? 'No' : 'Yes'}\n\n`;
      note += `${formatHeading('Need', 'custom', customHeadingFormat)}\n`;
      if (a.whyNeedADSD) {
        note += `${a.whyNeedADSD}\n`;
      }

      if (hasPaymentData(a)) {
        note += `\n${formatHeading('Payment', 'custom', customHeadingFormat)}\n`;
        if (a.amount && a.amount > 0) {
          note += `Amount: $${a.amount.toFixed(2)}\n`;
        }
        if (a.bankAccount && a.bankAccount.trim()) {
          note += `Bank account: ${a.bankAccount}\n`;
        }
        if (a.recoveryRate && a.recoveryRate > 0) {
          note += `Recovery rate: $${a.recoveryRate.toFixed(2)}\n`;
        }
        if (a.paymentCardNumber && a.paymentCardNumber.trim()) {
          note += `Payment card number: ${a.paymentCardNumber}\n`;
        }
        if (a.directCredit === 'yes' && a.paymentReference) {
          note += `Reference number: ${a.paymentReference}\n`;
        }
      }
      if (hasIncomeData(a.income)) {
        note += `\n${formatHeading('Income', 'custom', customHeadingFormat)}\n`;
        note += formatIncomeLines(a.income, a.incomeLabels);
        a.costs.forEach((cost: { amount: number; cost: string }) => {
          if (cost.amount > 0) note += `-$${cost.amount.toFixed(2)} ${cost.cost}\n`;
        });
        if (a.costs.length > 0) {
          const totalIncome = (Object.values(a.income) as number[]).reduce((sum: number, value: number) => sum + (value || 0), 0);
          const totalCosts = a.costs.reduce((sum: number, cost: { amount: number; cost: string }) => sum + (cost.amount || 0), 0);
          const remainingIncome = totalIncome - totalCosts;
          note += '--------------\n';
          note += `Client is left with $${remainingIncome.toFixed(2)}\n`;
        }
      }
      if (hasReasonableStepsData(a.reasonableSteps)) {
        note += `\n${formatHeading('Reasonable Steps', 'custom', customHeadingFormat)}\n`;
        note += `${a.reasonableSteps}\n`;
      }
      if (hasOutcomeData(a.decision, a.decisionReason)) {
        note += `\n${formatHeading('Outcome', 'custom', customHeadingFormat)}\n`;
        if (a.decision === 'approved') note += 'APPLICATION APPROVED\n';
        else if (a.decision === 'declined') note += 'APPLICATION DECLINED\n';
        if (a.decisionReason) note += `${a.decisionReason}\n`;
      }
      return note;
    } else if (service === 'rent-arrears') {
      // Rent Arrears note output
      const r: RentArrearsFormData = formData;
      let note = '';
      note += `CCID: ${r.clientId === false ? 'No' : 'Yes'}\n\n`;
      note += `${formatHeading('Need', 'custom', customHeadingFormat)}\n`;
      if (r.whyNeedRentArrears) {
        note += `${r.whyNeedRentArrears}\n`;
      }
      if (r.rentArrearsVerification === 'yes') {
        note += 'Rent arrears verification provided\n';
      }

      if (hasPaymentData(r)) {
        note += `\n${formatHeading('Payment', 'custom', customHeadingFormat)}\n`;
        if (r.supplierName && r.supplierName.trim()) {
          note += `Supplier Name: ${r.supplierName}\n`;
        }
        if (r.supplierId && r.supplierId.trim()) {
          note += `Supplier ID: ${r.supplierId}\n`;
        }
        if (r.paymentCardNumber && r.paymentCardNumber.trim()) {
          note += `Payment card number: ${r.paymentCardNumber}\n`;
        }
        if (r.amount && r.amount > 0) {
          note += `Amount: $${r.amount.toFixed(2)}\n`;
        }
        if (r.recoveryRate && r.recoveryRate > 0) {
          note += `Recovery rate: $${r.recoveryRate.toFixed(2)}\n`;
        }
        if (r.directCredit === 'yes' && r.paymentReference) {
          note += `Reference number: ${r.paymentReference}\n`;
        }
      }
      if (hasIncomeData(r.income)) {
        note += `\n${formatHeading('Tenancy Affordability', 'custom', customHeadingFormat)}\n`;
        note += formatIncomeLines(r.income, r.incomeLabels);
        r.costs.forEach((cost: { amount: number; cost: string }) => {
          if (cost.amount > 0) note += `-$${cost.amount.toFixed(2)} ${cost.cost}\n`;
        });
        if (r.costs.length > 0) {
          const totalIncome = (Object.values(r.income) as number[]).reduce((sum: number, value: number) => sum + (value || 0), 0);
          const totalCosts = r.costs.reduce((sum: number, cost: { amount: number; cost: string }) => sum + (cost.amount || 0), 0);
          const remainingIncome = totalIncome - totalCosts;
          note += '--------------\n';
          note += `Client is left with $${remainingIncome.toFixed(2)}\n`;
        }
      }
      
      if (hasReasonableStepsData(r.reasonableSteps)) {
        note += `\n${formatHeading('Reasonable Steps', 'custom', customHeadingFormat)}\n`;
        note += `${r.reasonableSteps}\n`;
      }
      if (hasOutcomeData(r.decision, r.decisionReason)) {
        note += `\n${formatHeading('Outcome', 'custom', customHeadingFormat)}\n`;
        if (r.decision === 'approved') note += 'APPLICATION APPROVED\n';
        else if (r.decision === 'declined') note += 'APPLICATION DECLINED\n';
        if (r.decisionReason) note += `${r.decisionReason}\n`;
      }
      return note;
    } else if (service === 'car-repairs') {
      // Car Repairs note output
      const c: CarRepairsFormData = formData;
      let note = '';
      note += `CCID: ${c.clientId === false ? 'No' : 'Yes'}\n\n`;
      note += `${formatHeading('Need', 'custom', customHeadingFormat)}\n`;
      if (c.whyNeedCarRepairs) {
        note += `${c.whyNeedCarRepairs}\n`;
      }

      note += `\n${formatHeading('Car Details', 'custom', customHeadingFormat)}\n`;
      if (c.vehicleMakeModel) note += `Vehicle: ${c.vehicleMakeModel}\n`;
      if (c.licensePlate) note += `License plate: ${c.licensePlate}\n`;
      if (c.odometer) note += `Odometer: ${c.odometer}\n`;
      if (c.vehicleOwner) note += `Vehicle owner: ${c.vehicleOwner}\n`;
      if (c.nztaVerification) {
        note += '\nOwnership verification:\n';
        note += `${c.nztaVerification}\n`;
      }

      if (hasPaymentData(c)) {
        note += `\n${formatHeading('Payment', 'custom', customHeadingFormat)}\n`;
        if (c.supplierName && c.supplierName.trim()) {
          note += `Supplier Name: ${c.supplierName}\n`;
        }
        if (c.supplierId && c.supplierId.trim()) {
          note += `Supplier ID: ${c.supplierId}\n`;
        }
        if (c.paymentCardNumber && c.paymentCardNumber.trim()) {
          note += `Payment card number: ${c.paymentCardNumber}\n`;
        }
        if (c.amount && c.amount > 0) {
          note += `Amount: $${c.amount.toFixed(2)}\n`;
        }
        if (c.recoveryRate && c.recoveryRate > 0) {
          note += `Recovery rate: $${c.recoveryRate.toFixed(2)}\n`;
        }
        if (c.directCredit === 'yes' && c.paymentReference) {
          note += `Reference number: ${c.paymentReference}\n`;
        }
      }
      if (hasIncomeData(c.income)) {
        note += `\n${formatHeading('Income', 'custom', customHeadingFormat)}\n`;
        note += formatIncomeLines(c.income, c.incomeLabels);
        c.costs.forEach((cost: { amount: number; cost: string }) => {
          if (cost.amount > 0) note += `-$${cost.amount.toFixed(2)} ${cost.cost}\n`;
        });
        if (c.costs.length > 0) {
          const totalIncome = (Object.values(c.income) as number[]).reduce((sum: number, value: number) => sum + (value || 0), 0);
          const totalCosts = c.costs.reduce((sum: number, cost: { amount: number; cost: string }) => sum + (cost.amount || 0), 0);
          const remainingIncome = totalIncome - totalCosts;
          note += '--------------\n';
          note += `Client is left with $${remainingIncome.toFixed(2)}\n`;
        }
      }
      
      if (hasReasonableStepsData(c.reasonableSteps)) {
        note += `\n${formatHeading('Reasonable Steps', 'custom', customHeadingFormat)}\n`;
        note += `${c.reasonableSteps}\n`;
      }
      if (hasOutcomeData(c.decision, c.decisionReason)) {
        note += `\n${formatHeading('Outcome', 'custom', customHeadingFormat)}\n`;
        if (c.decision === 'approved') note += 'APPLICATION APPROVED\n';
        else if (c.decision === 'declined') note += 'APPLICATION DECLINED\n';
        if (c.decisionReason) note += `${c.decisionReason}\n`;
      }
      return note;
    } else if (service === 'funeral-assistance') {
      // Funeral Assistance note output
      const f: FuneralAssistanceFormData = formData;
      let note = '';
      note += `CCID: ${f.clientId === false ? 'No' : 'Yes'}\n\n`;
      note += `${formatHeading('Need', 'custom', customHeadingFormat)}\n`;
      if (f.whyNeedFuneralAssistance) {
        note += `${f.whyNeedFuneralAssistance}\n`;
      }

      if (f.petrolAssistance === 'yes') {
        note += `\n${formatHeading('Travel Details', 'custom', customHeadingFormat)}\n`;
        if (f.startLocation && f.destination) {
          note += `Travelling from: ${f.startLocation} to ${f.destination}\n`;
        }
        if (f.returnTrip) {
          note += `Return trip: ${f.returnTrip === 'yes' ? 'Yes' : 'No'}\n`;
        }
        if (f.distance > 0) {
          note += `Distance: ${f.distance.toFixed(1)} km\n`;
        }
        if (f.travelCost > 0) {
          note += `Calculated Cost of travel: $${f.travelCost.toFixed(2)}\n`;
        }
      }

      if (hasPaymentData(f)) {
        note += `\n${formatHeading('Payment', 'custom', customHeadingFormat)}\n`;
        if (f.supplierName && f.supplierName.trim()) {
          note += `Supplier Name: ${f.supplierName}\n`;
        }
        if (f.supplierId && f.supplierId.trim()) {
          note += `Supplier ID: ${f.supplierId}\n`;
        }
        if (f.paymentCardNumber && f.paymentCardNumber.trim()) {
          note += `Payment card number: ${f.paymentCardNumber}\n`;
        }
        if (f.amount && f.amount > 0) {
          note += `Amount: $${f.amount.toFixed(2)}\n`;
        }
        if (f.recoveryRate && f.recoveryRate > 0) {
          note += `Recovery rate: $${f.recoveryRate.toFixed(2)}\n`;
        }
        if (f.directCredit === 'yes' && f.paymentReference) {
          note += `Reference number: ${f.paymentReference}\n`;
        }
      }
      if (hasIncomeData(f.income)) {
        note += `\n${formatHeading('Income', 'custom', customHeadingFormat)}\n`;
        note += formatIncomeLines(f.income, f.incomeLabels);
        f.costs.forEach((cost: { amount: number; cost: string }) => {
          if (cost.amount > 0) note += `-$${cost.amount.toFixed(2)} ${cost.cost}\n`;
        });
        if (f.costs.length > 0) {
          const totalIncome = (Object.values(f.income) as number[]).reduce((sum: number, value: number) => sum + (value || 0), 0);
          const totalCosts = f.costs.reduce((sum: number, cost: { amount: number; cost: string }) => sum + (cost.amount || 0), 0);
          const remainingIncome = totalIncome - totalCosts;
          note += '--------------\n';
          note += `Client is left with $${remainingIncome.toFixed(2)}\n`;
        }
      }
      
      if (hasReasonableStepsData(f.reasonableSteps)) {
        note += `\n${formatHeading('Reasonable Steps', 'custom', customHeadingFormat)}\n`;
        note += `${f.reasonableSteps}\n`;
      }
      if (hasOutcomeData(f.decision, f.decisionReason)) {
        note += `\n${formatHeading('Outcome', 'custom', customHeadingFormat)}\n`;
        if (f.decision === 'approved') note += 'APPLICATION APPROVED\n';
        else if (f.decision === 'declined') note += 'APPLICATION DECLINED\n';
        if (f.decisionReason) note += `${f.decisionReason}\n`;
      }
      return note;
    } else if (service === 'stranded-travel') {
      // Stranded Travel note output (same template as funeral assistance)
      const s: StrandedTravelFormData = formData;
      let note = '';
      note += `CCID: ${s.clientId === false ? 'No' : 'Yes'}\n\n`;
      note += `${formatHeading('Need', 'custom', customHeadingFormat)}\n`;
      if (s.whyNeedStrandedTravelAssistance) {
        note += `${s.whyNeedStrandedTravelAssistance}\n`;
      }

      if (s.petrolAssistance === 'yes') {
        note += `\n${formatHeading('Travel Details', 'custom', customHeadingFormat)}\n`;
        if (s.startLocation && s.destination) {
          note += `Travelling from: ${s.startLocation} to ${s.destination}\n`;
        }
        if (s.returnTrip) {
          note += `Return trip: ${s.returnTrip === 'yes' ? 'Yes' : 'No'}\n`;
        }
        if (s.distance > 0) {
          note += `Distance: ${s.distance.toFixed(1)} km\n`;
        }
        if (s.travelCost > 0) {
          note += `Calculated Cost of travel: $${s.travelCost.toFixed(2)}\n`;
        }
      }

      if (hasPaymentData(s)) {
        note += `\n${formatHeading('Payment', 'custom', customHeadingFormat)}\n`;
        if (s.supplierName && s.supplierName.trim()) {
          note += `Supplier Name: ${s.supplierName}\n`;
        }
        if (s.supplierId && s.supplierId.trim()) {
          note += `Supplier ID: ${s.supplierId}\n`;
        }
        if (s.paymentCardNumber && s.paymentCardNumber.trim()) {
          note += `Payment card number: ${s.paymentCardNumber}\n`;
        }
        if (s.amount && s.amount > 0) {
          note += `Amount: $${s.amount.toFixed(2)}\n`;
        }
        if (s.recoveryRate && s.recoveryRate > 0) {
          note += `Recovery rate: $${s.recoveryRate.toFixed(2)}\n`;
        }
        if (s.directCredit === 'yes' && s.paymentReference) {
          note += `Reference number: ${s.paymentReference}\n`;
        }
      }
      if (hasIncomeData(s.income)) {
        note += `\n${formatHeading('Income', 'custom', customHeadingFormat)}\n`;
        note += formatIncomeLines(s.income, s.incomeLabels);
        s.costs.forEach((cost: { amount: number; cost: string }) => {
          if (cost.amount > 0) note += `-$${cost.amount.toFixed(2)} ${cost.cost}\n`;
        });
        if (s.costs.length > 0) {
          const totalIncome = (Object.values(s.income) as number[]).reduce((sum: number, value: number) => sum + (value || 0), 0);
          const totalCosts = s.costs.reduce((sum: number, cost: { amount: number; cost: string }) => sum + (cost.amount || 0), 0);
          const remainingIncome = totalIncome - totalCosts;
          note += '--------------\n';
          note += `Client is left with $${remainingIncome.toFixed(2)}\n`;
        }
      }
      
      if (hasReasonableStepsData(s.reasonableSteps)) {
        note += `\n${formatHeading('Reasonable Steps', 'custom', customHeadingFormat)}\n`;
        note += `${s.reasonableSteps}\n`;
      }
      if (hasOutcomeData(s.decision, s.decisionReason)) {
        note += `\n${formatHeading('Outcome', 'custom', customHeadingFormat)}\n`;
        if (s.decision === 'approved') note += 'APPLICATION APPROVED\n';
        else if (s.decision === 'declined') note += 'APPLICATION DECLINED\n';
        if (s.decisionReason) note += `${s.decisionReason}\n`;
      }
      return note;
    } else if (service === 'bond-rent') {
      // Bond/Rent in Advance note output
      const b = formData;
      let note = '';
      note += `CCID: ${b.clientId === false ? 'No' : 'Yes'}\n\n`;
      note += `${formatHeading('Need', 'custom', customHeadingFormat)}\n`;
      if (b.whyNeedAccommodation) note += `${b.whyNeedAccommodation}\n`;

      note += `\n${formatHeading('Tenancy Details', 'custom', customHeadingFormat)}\n`;
      if (b.asZone) note += `AS Zone: ${b.asZone}\n`;
      if (b.newAddress) note += `Address: ${b.newAddress}\n`;
      if (b.weeklyRent) note += `Weekly Rent: ${b.weeklyRent.toFixed(2)}\n`;
      if (b.tenancyStartDate) {
        note += `Tenancy start date: ${formatCalendarDate(b.tenancyStartDate)}\n`;
      }
      
      if (hasPaymentData(b)) {
        note += `\n${formatHeading('Payment', 'custom', customHeadingFormat)}\n`;
        if (b.supplierName && b.supplierName.trim()) {
          note += `Supplier Name: ${b.supplierName}\n`;
        }
        if (b.supplierId && b.supplierId.trim()) {
          note += `Supplier ID: ${b.supplierId}\n`;
        }
        if (b.paymentCardNumber && b.paymentCardNumber.trim()) {
          note += `Payment card number: ${b.paymentCardNumber}\n`;
        }
        if (b.bondAmount && b.bondAmount > 0) {
          note += `Bond Amount: $${b.bondAmount.toFixed(2)}\n`;
        }
        if (b.rentInAdvanceAmount && b.rentInAdvanceAmount > 0) {
          note += `Rent in Advance Amount: $${b.rentInAdvanceAmount.toFixed(2)}\n`;
        }
        const totalAmount = (b.bondAmount || 0) + (b.rentInAdvanceAmount || 0);
        if (totalAmount > 0) {
          note += `Total Amount: $${totalAmount.toFixed(2)}\n`;
        }
        if (b.recoveryRate && b.recoveryRate > 0) {
          note += `Recovery rate: $${b.recoveryRate.toFixed(2)}\n`;
        }
        if (b.directCredit === 'yes' && b.paymentReference) {
          note += `Reference number: ${b.paymentReference}\n`;
        }
      }
      
      if (hasIncomeData(b.income)) {
        note += `\n${formatHeading('Tenancy Affordability', 'custom', customHeadingFormat)}\n`;
        note += formatIncomeLines(b.income, b.incomeLabels);
        b.costs.forEach((cost: { amount: number; cost: string }) => {
          if (cost.amount > 0) note += `-$${cost.amount.toFixed(2)} ${cost.cost}\n`;
        });
        if (b.costs.length > 0) {
          const totalIncome = (Object.values(b.income) as number[]).reduce((sum: number, value: number) => sum + (value || 0), 0);
          const totalCosts = b.costs.reduce((sum: number, cost: { amount: number; cost: string }) => sum + (cost.amount || 0), 0);
          const remainingIncome = totalIncome - totalCosts;
          note += '--------------\n';
          note += `Client is left with $${remainingIncome.toFixed(2)}\n`;
        }
      }
      
      if (hasReasonableStepsData(b.reasonableSteps)) {
        note += `\n${formatHeading('Reasonable Steps', 'custom', customHeadingFormat)}\n`;
        note += `${b.reasonableSteps}\n`;
      }
      if (hasOutcomeData(b.decision, b.decisionReason)) {
        note += `\n${formatHeading('Outcome', 'custom', customHeadingFormat)}\n`;
        if (b.decision === 'approved') note += 'APPLICATION APPROVED\n';
        else if (b.decision === 'declined') note += 'APPLICATION DECLINED\n';
        if (b.decisionReason) note += `${b.decisionReason}\n`;
      }
      return note;
    } else if (service === 'electricity') {
      // Electricity note output (similar to clothing)
      const e = formData;
      let note = '';
      note += `CCID: ${e.clientId === false ? 'No' : 'Yes'}\n\n`;
      note += `${formatHeading('Need', 'custom', customHeadingFormat)}\n`;
      if (e.whyNeedPower) note += `${e.whyNeedPower}\n`;

      note += `Power Account Number: ${e.powerAccountNumber || '-'}\n`;
      if (hasPaymentData(e)) {
        note += `\n${formatHeading('Payment', 'custom', customHeadingFormat)}\n`;
        if (e.supplierName && e.supplierName.trim()) {
          note += `Supplier Name: ${e.supplierName}\n`;
        }
        if (e.supplierId && e.supplierId.trim()) {
          note += `Supplier ID: ${e.supplierId}\n`;
        }
        if (e.paymentCardNumber && e.paymentCardNumber.trim()) {
          note += `Payment card number: ${e.paymentCardNumber}\n`;
        }
        if (e.amount && e.amount > 0) {
          note += `Amount: $${e.amount.toFixed(2)}\n`;
        }
        if (e.recoveryRate && e.recoveryRate > 0) {
          note += `Recovery rate: $${e.recoveryRate.toFixed(2)}\n`;
        }
        if (e.directCredit === 'yes' && e.paymentReference) {
          note += `Reference number: ${e.paymentReference}\n`;
        }
      }
      if (hasIncomeData(e.income)) {
        note += `\n${formatHeading('Income', 'custom', customHeadingFormat)}\n`;
        note += formatIncomeLines(e.income, e.incomeLabels);
        e.costs.forEach((cost: { amount: number; cost: string }) => {
          if (cost.amount > 0) note += `-$${cost.amount.toFixed(2)} ${cost.cost}\n`;
        });
        if (e.costs.length > 0) {
          const totalIncome = (Object.values(e.income) as number[]).reduce((sum: number, value: number) => sum + (value || 0), 0);
          const totalCosts = e.costs.reduce((sum: number, cost: { amount: number; cost: string }) => sum + (cost.amount || 0), 0);
          const remainingIncome = totalIncome - totalCosts;
          note += '--------------\n';
          note += `Client is left with $${remainingIncome.toFixed(2)}\n`;
        }
      }
      if (hasReasonableStepsData(e.reasonableSteps)) {
        note += `\n${formatHeading('Reasonable Steps', 'custom', customHeadingFormat)}\n`;
        note += `${e.reasonableSteps}\n`;
      }
      if (hasOutcomeData(e.decision, e.decisionReason)) {
        note += `\n${formatHeading('Outcome', 'custom', customHeadingFormat)}\n`;
        if (e.decision === 'approved') note += 'APPLICATION APPROVED\n';
        else if (e.decision === 'declined') note += 'APPLICATION DECLINED\n';
        if (e.decisionReason) note += `${e.decisionReason}\n`;
      }
      return note;
    } else if (service === 'dental') {
      // Dental note output
      const d = formData;
      let note = '';
      note += `CCID: ${d.clientId === false ? 'No' : 'Yes'}\n\n`;
      note += `${formatHeading('Need', 'custom', customHeadingFormat)}\n`;
      if (d.whyNeedDental) note += `${d.whyNeedDental}\n`;

      if (hasPaymentData(d)) {
        note += `\n${formatHeading('Payment', 'custom', customHeadingFormat)}\n`;
        if (d.supplierName && d.supplierName.trim()) {
          note += `Supplier Name: ${d.supplierName}\n`;
        }
        if (d.supplierId && d.supplierId.trim()) {
          note += `Supplier ID: ${d.supplierId}\n`;
        }
        if (d.paymentCardNumber && d.paymentCardNumber.trim()) {
          note += `Payment card number: ${d.paymentCardNumber}\n`;
        }
        if (d.amount && d.amount > 0) {
          note += `Total Cost: $${d.amount.toFixed(2)}\n`;
        }
        if (d.sngEligible === 'yes') {
          const sng = Math.min(d.amount, d.sngBalance || 0);
          const advance = Math.max(0, d.amount - sng);
          note += `SNG: $${sng.toFixed(2)}\n`;
          if (advance > 0) note += `Advance: $${advance.toFixed(2)}\n`;
        }
        if (d.recoveryRate && d.recoveryRate > 0) {
          note += `Recovery rate: $${d.recoveryRate.toFixed(2)}\n`;
        }
        if (d.directCredit === 'yes' && d.paymentReference) {
          note += `Reference number: ${d.paymentReference}\n`;
        }
      }
      if (hasIncomeData(d.income)) {
        note += `\n${formatHeading('Income', 'custom', customHeadingFormat)}\n`;
        note += formatIncomeLines(d.income, d.incomeLabels);
        d.costs.forEach((cost: { amount: number; cost: string }) => {
          if (cost.amount > 0) note += `-$${cost.amount.toFixed(2)} ${cost.cost}\n`;
        });
        if (d.costs.length > 0) {
          const totalIncome = (Object.values(d.income) as number[]).reduce((sum: number, value: number) => sum + (value || 0), 0);
          const totalCosts = d.costs.reduce((sum: number, cost: { amount: number; cost: string }) => sum + (cost.amount || 0), 0);
          const remainingIncome = totalIncome - totalCosts;
          note += '--------------\n';
          note += `Client is left with $${remainingIncome.toFixed(2)}\n`;
        }
      }
      if (hasReasonableStepsData(d.reasonableSteps)) {
        note += `\n${formatHeading('Reasonable Steps', 'custom', customHeadingFormat)}\n`;
        note += `${d.reasonableSteps}\n`;
      }
      if (hasOutcomeData(d.decision, d.decisionReason)) {
        note += `\n${formatHeading('Outcome', 'custom', customHeadingFormat)}\n`;
        if (d.decision === 'approved') note += 'APPLICATION APPROVED\n';
        else if (d.decision === 'declined') note += 'APPLICATION DECLINED\n';
        if (d.decisionReason) note += `${d.decisionReason}\n`;
      }
      return note;
    } else if (service === 'beds') {
      // Beds note output (like clothing, but beds wording)
      const b = formData;
      let note = '';
      note += `CCID: ${b.clientId === false ? 'No' : 'Yes'}\n\n`;
      note += `${formatHeading('Need', 'custom', customHeadingFormat)}\n`;
      if (b.whyNeedBeds) note += `${b.whyNeedBeds}\n`;

      if (hasPaymentData(b)) {
        note += `\n${formatHeading('Payment', 'custom', customHeadingFormat)}\n`;
        if (b.supplierName && b.supplierName.trim()) {
          note += `Supplier Name: ${b.supplierName}\n`;
        }
        if (b.supplierId && b.supplierId.trim()) {
          note += `Supplier ID: ${b.supplierId}\n`;
        }
        if (b.paymentCardNumber && b.paymentCardNumber.trim()) {
          note += `Payment card number: ${b.paymentCardNumber}\n`;
        }
        if (b.amount && b.amount > 0) {
          note += `Amount: $${b.amount.toFixed(2)}\n`;
        }
        if (b.recoveryRate && b.recoveryRate > 0) {
          note += `Recovery rate: $${b.recoveryRate.toFixed(2)}\n`;
        }
        if (b.directCredit === 'yes' && b.paymentReference) {
          note += `Reference number: ${b.paymentReference}\n`;
        }
      }
      if (hasIncomeData(b.income)) {
        note += `\n${formatHeading('Income', 'custom', customHeadingFormat)}\n`;
        note += formatIncomeLines(b.income, b.incomeLabels);
        (b.costs as Array<{amount:number;cost:string}>).forEach((cost: {amount:number;cost:string}) => {
          if (cost.amount > 0) note += `-$${cost.amount.toFixed(2)} ${cost.cost}\n`;
        });
        if (b.costs && b.costs.length > 0) {
          const totalIncome = (Object.values(b.income) as number[]).reduce((sum: number, value: number) => sum + (value || 0), 0);
          const totalCosts = (b.costs as Array<{amount:number}>).reduce((sum: number, cost: {amount:number}) => sum + (cost.amount || 0), 0);
          const remainingIncome = totalIncome - totalCosts;
          note += '--------------\n';
          note += `Client is left with $${remainingIncome.toFixed(2)}\n`;
        }
      }
      if (hasReasonableStepsData(b.reasonableSteps)) {
        note += `\n${formatHeading('Reasonable Steps', 'custom', customHeadingFormat)}\n`;
        note += `${b.reasonableSteps}\n`;
      }
      if (hasOutcomeData(b.decision, b.decisionReason)) {
        note += `\n${formatHeading('Outcome', 'custom', customHeadingFormat)}\n`;
        if (b.decision === 'approved') note += 'APPLICATION APPROVED\n';
        else if (b.decision === 'declined') note += 'APPLICATION DECLINED\n';
        if (b.decisionReason) note += `${b.decisionReason}\n`;
      }
      return note;
    } else if (service === 'furniture') {
      // Furniture note output (like beds, but furniture wording)
      const f = formData;
      let note = '';
      note += `CCID: ${f.clientId === false ? 'No' : 'Yes'}\n\n`;
      note += `${formatHeading('Need', 'custom', customHeadingFormat)}\n`;
      if (f.whyNeedFurniture) note += `${f.whyNeedFurniture}\n`;
      if (f.furnitureType) note += `Client is requesting help with a ${f.furnitureType}\n`;

      if (hasPaymentData(f)) {
        note += `\n${formatHeading('Payment', 'custom', customHeadingFormat)}\n`;
        if (f.supplierName && f.supplierName.trim()) {
          note += `Supplier Name: ${f.supplierName}\n`;
        }
        if (f.supplierId && f.supplierId.trim()) {
          note += `Supplier ID: ${f.supplierId}\n`;
        }
        if (f.paymentCardNumber && f.paymentCardNumber.trim()) {
          note += `Payment card number: ${f.paymentCardNumber}\n`;
        }
        if (f.amount && f.amount > 0) {
          note += `Amount: $${f.amount.toFixed(2)}\n`;
        }
        if (f.recoveryRate && f.recoveryRate > 0) {
          note += `Recovery rate: $${f.recoveryRate.toFixed(2)}\n`;
        }
        if (f.directCredit === 'yes' && f.paymentReference) {
          note += `Reference number: ${f.paymentReference}\n`;
        }
      }
      if (hasIncomeData(f.income)) {
        note += `\n${formatHeading('Income', 'custom', customHeadingFormat)}\n`;
        note += formatIncomeLines(f.income, f.incomeLabels);
        (f.costs as Array<{amount:number;cost:string}>).forEach((cost: {amount:number;cost:string}) => {
          if (cost.amount > 0) note += `-$${cost.amount.toFixed(2)} ${cost.cost}\n`;
        });
        if (f.costs && f.costs.length > 0) {
          const totalIncome = (Object.values(f.income) as number[]).reduce((sum: number, value: number) => sum + (value || 0), 0);
          const totalCosts = (f.costs as Array<{amount:number}>).reduce((sum: number, cost: {amount:number}) => sum + (cost.amount || 0), 0);
          const remainingIncome = totalIncome - totalCosts;
          note += '--------------\n';
          note += `Client is left with $${remainingIncome.toFixed(2)}\n`;
        }
      }
      if (hasReasonableStepsData(f.reasonableSteps)) {
        note += `\n${formatHeading('Reasonable Steps', 'custom', customHeadingFormat)}\n`;
        note += `${f.reasonableSteps}\n`;
      }
      if (hasOutcomeData(f.decision, f.decisionReason)) {
        note += `\n${formatHeading('Outcome', 'custom', customHeadingFormat)}\n`;
        if (f.decision === 'approved') note += 'APPLICATION APPROVED\n';
        else if (f.decision === 'declined') note += 'APPLICATION DECLINED\n';
        if (f.decisionReason) note += `${f.decisionReason}\n`;
      }
      return note;
    } else if (service === 'bedding') {
      // Bedding note output (like beds, with SNG logic)
      const b = formData;
      let note = '';
      note += `CCID: ${b.clientId === false ? 'No' : 'Yes'}\n\n`;
      note += `${formatHeading('Need', 'custom', customHeadingFormat)}\n`;
      if (b.whyNeedBedding) note += `${b.whyNeedBedding}\n`;

      if (b.beddingSngEligible === 'yes') {
        note += '\nClient qualifies for bedding SNG\n';
        if (b.beddingSngReason) note += `Reason: ${b.beddingSngReason}\n`;
      }
      if (hasPaymentData(b)) {
        note += `\n${formatHeading('Payment', 'custom', customHeadingFormat)}\n`;
        if (b.supplierName && b.supplierName.trim()) {
          note += `Supplier Name: ${b.supplierName}\n`;
        }
        if (b.supplierId && b.supplierId.trim()) {
          note += `Supplier ID: ${b.supplierId}\n`;
        }
        if (b.paymentCardNumber && b.paymentCardNumber.trim()) {
          note += `Payment card number: ${b.paymentCardNumber}\n`;
        }
        if (b.amount && b.amount > 0) {
          note += `Amount: $${b.amount.toFixed(2)}\n`;
        }
        if (b.recoveryRate && b.recoveryRate > 0) {
          note += `Recovery rate: $${b.recoveryRate.toFixed(2)}\n`;
        }
        if (b.directCredit === 'yes' && b.paymentReference) {
          note += `Reference number: ${b.paymentReference}\n`;
        }
      }
      if (hasIncomeData(b.income)) {
        note += `\n${formatHeading('Income', 'custom', customHeadingFormat)}\n`;
        note += formatIncomeLines(b.income, b.incomeLabels);
        (b.costs as Array<{amount:number;cost:string}>).forEach((cost: {amount:number;cost:string}) => {
          if (cost.amount > 0) note += `-$${cost.amount.toFixed(2)} ${cost.cost}\n`;
        });
        if (b.costs && b.costs.length > 0) {
          const totalIncome = (Object.values(b.income as {[k:string]:number}) as number[]).reduce((sum: number, value: number) => sum + (value || 0), 0);
          const totalCosts = (b.costs as Array<{amount:number}>).reduce((sum: number, cost: {amount:number}) => sum + (cost.amount || 0), 0);
          const remainingIncome = totalIncome - totalCosts;
          note += '--------------\n';
          note += `Client is left with $${remainingIncome.toFixed(2)}\n`;
        }
      }
      if (hasReasonableStepsData(b.reasonableSteps)) {
        note += `\n${formatHeading('Reasonable Steps', 'custom', customHeadingFormat)}\n`;
        note += `${b.reasonableSteps}\n`;
      }
      if (hasOutcomeData(b.decision, b.decisionReason)) {
        note += `\n${formatHeading('Outcome', 'custom', customHeadingFormat)}\n`;
        if (b.decision === 'approved') note += 'APPLICATION APPROVED\n';
        else if (b.decision === 'declined') note += 'APPLICATION DECLINED\n';
        if (b.decisionReason) note += `${b.decisionReason}\n`;
      }
      return note;
    } else if (service === 'glasses') {
      // Glasses note output (similar to clothing)
      const g = formData;
      let note = '';
      note += `CCID: ${g.clientId === false ? 'No' : 'Yes'}\n\n`;
      note += `${formatHeading('Need', 'custom', customHeadingFormat)}\n`;
      if (g.whyNeedGlasses) note += `${g.whyNeedGlasses}\n`;

      if (hasPaymentData(g)) {
        note += `\n${formatHeading('Payment', 'custom', customHeadingFormat)}\n`;
        if (g.supplierName && g.supplierName.trim()) {
          note += `Supplier Name: ${g.supplierName}\n`;
        }
        if (g.supplierId && g.supplierId.trim()) {
          note += `Supplier ID: ${g.supplierId}\n`;
        }
        if (g.paymentCardNumber && g.paymentCardNumber.trim()) {
          note += `Payment card number: ${g.paymentCardNumber}\n`;
        }
        if (g.amount && g.amount > 0) {
          note += `Amount: $${g.amount.toFixed(2)}\n`;
        }
        if (g.recoveryRate && g.recoveryRate > 0) {
          note += `Recovery rate: $${g.recoveryRate.toFixed(2)}\n`;
        }
        if (g.directCredit === 'yes' && g.paymentReference) {
          note += `Reference number: ${g.paymentReference}\n`;
        }
      }
      if (hasIncomeData(g.income)) {
        note += `\n${formatHeading('Income', 'custom', customHeadingFormat)}\n`;
        note += formatIncomeLines(g.income, g.incomeLabels);
        g.costs.forEach((cost: { amount: number; cost: string }) => {
          if (cost.amount > 0) note += `-$${cost.amount.toFixed(2)} ${cost.cost}\n`;
        });
        if (g.costs.length > 0) {
          const totalIncome = (Object.values(g.income) as number[]).reduce((sum: number, value: number) => sum + (value || 0), 0);
          const totalCosts = g.costs.reduce((sum: number, cost: { amount: number; cost: string }) => sum + (cost.amount || 0), 0);
          const remainingIncome = totalIncome - totalCosts;
          note += '--------------\n';
          note += `Client is left with $${remainingIncome.toFixed(2)}\n`;
        }
      }
      if (hasReasonableStepsData(g.reasonableSteps)) {
        note += `\n${formatHeading('Reasonable Steps', 'custom', customHeadingFormat)}\n`;
        note += `${g.reasonableSteps}\n`;
      }
      if (hasOutcomeData(g.decision, g.decisionReason)) {
        note += `\n${formatHeading('Outcome', 'custom', customHeadingFormat)}\n`;
        if (g.decision === 'approved') note += 'APPLICATION APPROVED\n';
        else if (g.decision === 'declined') note += 'APPLICATION DECLINED\n';
        if (g.decisionReason) note += `${g.decisionReason}\n`;
      }
      return note;
    } else if (service === 'whiteware') {
      // Whiteware note output
      const w = formData;
      let note = '';
      note += `CCID: ${w.clientId === false ? 'No' : 'Yes'}\n\n`;
      note += `${formatHeading('Need', 'custom', customHeadingFormat)}\n`;
      if (w.whyNeedWhiteware) note += `${w.whyNeedWhiteware}\n`;

      if (w.reasonableSteps) note += `What reasonable steps is the client taken to improve their situation?\n${w.reasonableSteps}\n`;
      
      // Whiteware Info section
      const householdSizeLabels: { [key: string]: string } = {
        '1-2': '1-2 people',
        '3-4': '3-4 people',
        '5+': '5+ people'
      };
      note += '\nHousehold size: ' + (householdSizeLabels[w.householdSize] || w.householdSize || '-') + '\n';
      
      if (hasPaymentData(w)) {
        note += `\n${formatHeading('Payment', 'custom', customHeadingFormat)}\n`;
        if (w.supplierName && w.supplierName.trim()) {
          note += `Supplier Name: ${w.supplierName}\n`;
        }
        if (w.supplierId && w.supplierId.trim()) {
          note += `Supplier ID: ${w.supplierId}\n`;
        }
        if (w.paymentCardNumber && w.paymentCardNumber.trim()) {
          note += `Payment card number: ${w.paymentCardNumber}\n`;
        }
        if (w.amount && w.amount > 0) {
          note += `Amount: $${w.amount.toFixed(2)}\n`;
        }
        if (w.recoveryRate && w.recoveryRate > 0) {
          note += `Recovery rate: $${w.recoveryRate.toFixed(2)}\n`;
        }
        if (w.directCredit === 'yes' && w.paymentReference) {
          note += `Reference number: ${w.paymentReference}\n`;
        }
      }
      if (hasIncomeData(w.income)) {
        note += `\n${formatHeading('Income', 'custom', customHeadingFormat)}\n`;
        note += formatIncomeLines(w.income, w.incomeLabels);
        w.costs.forEach((cost: { amount: number; cost: string }) => {
          if (cost.amount > 0) note += `-$${cost.amount.toFixed(2)} ${cost.cost}\n`;
        });
        if (w.costs.length > 0) {
          const totalIncome = (Object.values(w.income) as number[]).reduce((sum: number, value: number) => sum + (value || 0), 0);
          const totalCosts = w.costs.reduce((sum: number, cost: { amount: number; cost: string }) => sum + (cost.amount || 0), 0);
          const remainingIncome = totalIncome - totalCosts;
          note += '--------------\n';
          note += `Client is left with $${remainingIncome.toFixed(2)}\n`;
        }
      }
      if (hasReasonableStepsData(w.reasonableSteps)) {
        note += `\n${formatHeading('Reasonable Steps', 'custom', customHeadingFormat)}\n`;
        note += `${w.reasonableSteps}\n`;
      }
      if (hasOutcomeData(w.decision, w.decisionReason)) {
        note += `\n${formatHeading('Outcome', 'custom', customHeadingFormat)}\n`;
        if (w.decision === 'approved') note += 'APPLICATION APPROVED\n';
        else if (w.decision === 'declined') note += 'APPLICATION DECLINED\n';
        if (w.decisionReason) note += `${w.decisionReason}\n`;
      }
      return note;
    } else {
      // Food note output (existing logic)
      const f: FoodFormData = formData;
      const totalIncome = Object.values(f.income).reduce((sum: number, value: number) => sum + (value || 0), 0);
      const totalCosts = f.costs.reduce((sum: number, cost: { amount: number; cost: string }) => sum + (cost.amount || 0), 0);
      const remainingIncome = totalIncome - totalCosts;
      let note = '';
      note += `CCID: ${f.clientId === false ? 'No' : 'Yes'}\n\n`;
      note += `${formatHeading('Need', 'custom', customHeadingFormat)}\n`;
      if (f.whyNeedFood) note += `${f.whyNeedFood}\n`;

      note += '\n';
      if (f.currentFoodBalance !== 0 && f.currentFoodBalance !== undefined) {
        note += `Food balance: $${f.currentFoodBalance.toFixed(2)}\n`;
        if (f.hardshipUnforeseen === 'yes' && f.unforeseenCircumstance) {
          note += `Client is in hardship due to the following unforeseen circumstance: ${f.unforeseenCircumstance}\n`;
        }
      }
      if (f.foodAmountRequested > 0) note += `Amount requesting: $${f.foodAmountRequested.toFixed(2)}\n`;
      
      // Food always has supplier name, but check for other payment data
      if (f.amount > 0 || (f.directCredit === 'yes' && f.paymentReference) || (f.directCredit !== 'yes' && f.paymentCardNumber && f.paymentCardNumber.trim())) {
        note += `\n${formatHeading('Payment', 'custom', customHeadingFormat)}\n`;
        note += `Supplier Name: Food Supplier Group\n`;
        if (f.amount > 0) note += `Total Cost: $${f.amount.toFixed(2)}\n`;
        if (f.directCredit === 'yes' && f.paymentReference) {
          note += `Reference number: ${f.paymentReference}\n`;
        }
        if (f.directCredit !== 'yes' && f.paymentCardNumber && f.paymentCardNumber.trim()) {
          note += `Payment card number: ${f.paymentCardNumber}\n`;
        }
      }
      
      if (hasIncomeData(f.income)) {
        note += `\n${formatHeading('Income', 'custom', customHeadingFormat)}\n`;
        note += formatIncomeLines(f.income, f.incomeLabels);
        f.costs.forEach((cost: { amount: number; cost: string }) => {
          if (cost.amount > 0) note += `-$${cost.amount.toFixed(2)} ${cost.cost}\n`;
        });
        if (f.costs.length > 0) {
          note += '--------------\n';
          note += `Client is left with $${remainingIncome.toFixed(2)}\n`;
        }
      }
      if (hasReasonableStepsData(f.reasonableSteps)) {
        note += '\n';
        note += `${formatHeading('Reasonable Steps', 'custom', customHeadingFormat)}\n`;
        note += `${f.reasonableSteps}\n\n`;
      }
      if (hasOutcomeData(f.decision, f.decisionReason)) {
        note += `${formatHeading('Outcome', 'custom', customHeadingFormat)}\n`;
        if (f.decision === 'approved') note += 'APPLICATION APPROVED\n';
        else if (f.decision === 'declined') note += 'APPLICATION DECLINED\n';
        if (f.decisionReason) note += `${f.decisionReason}\n`;
      }
      return note;
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(generateNote());
      // Show a subtle toast notification (same as Quick Copy)
      const toast = document.createElement('div');
      toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #10b981;
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        font-size: 14px;
        z-index: 1000;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        transform: translateX(100%);
        transition: transform 0.3s ease;
      `;
      toast.textContent = 'Note copied!';
      document.body.appendChild(toast);
      
      // Animate in
      setTimeout(() => toast.style.transform = 'translateX(0)', 100);
      
      // Remove after 2 seconds
      setTimeout(() => {
        toast.style.transform = 'translateX(100%)';
        setTimeout(() => document.body.removeChild(toast), 300);
      }, 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = generateNote();
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      // Show toast for fallback too
      const toast = document.createElement('div');
      toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #10b981;
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        font-size: 14px;
        z-index: 1000;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        transform: translateX(100%);
        transition: transform 0.3s ease;
      `;
      toast.textContent = 'Note copied!';
      document.body.appendChild(toast);
      
      // Animate in
      setTimeout(() => toast.style.transform = 'translateX(0)', 100);
      
      // Remove after 2 seconds
      setTimeout(() => {
        toast.style.transform = 'translateX(100%)';
        setTimeout(() => document.body.removeChild(toast), 300);
      }, 2000);
    }
  };

  const handleQuickCopy = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      // Show a subtle toast notification
      const toast = document.createElement('div');
      toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #10b981;
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        font-size: 14px;
        z-index: 1000;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        transform: translateX(100%);
        transition: transform 0.3s ease;
      `;
      toast.textContent = `${label} copied!`;
      document.body.appendChild(toast);
      
      // Animate in
      setTimeout(() => toast.style.transform = 'translateX(0)', 100);
      
      // Remove after 2 seconds
      setTimeout(() => {
        toast.style.transform = 'translateX(100%)';
        setTimeout(() => document.body.removeChild(toast), 300);
      }, 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
      alert(`Failed to copy ${label}`);
    }
  };

  const getQuickCopyFields = () => {
    const fields = [];
    
    // Check for Supplier ID
    if (formData.supplierId && formData.supplierId.trim()) {
      fields.push({
        label: 'Supplier ID',
        value: formData.supplierId,
        key: 'supplierId'
      });
    }
    
    // Check for Supplier Name
    if (formData.supplierName && formData.supplierName.trim()) {
      fields.push({
        label: 'Supplier Name',
        value: formData.supplierName,
        key: 'supplierName'
      });
    }
    
    // Check for Amount
    if (formData.amount && formData.amount > 0) {
      fields.push({
        label: 'Amount',
        value: `$${formData.amount.toFixed(2)}`,
        key: 'amount'
      });
    }
    
    // Check for Payment Reference
    if (formData.paymentReference && formData.paymentReference.trim()) {
      fields.push({
        label: 'Payment Reference',
        value: formData.paymentReference,
        key: 'paymentReference'
      });
    }
    
    // Check for Payment Card Number
    if (formData.paymentCardNumber && formData.paymentCardNumber.trim()) {
      fields.push({
        label: 'Payment Card Number',
        value: formData.paymentCardNumber,
        key: 'paymentCardNumber'
      });
    }
    
    return fields;
  };

  const note = generateNote();
  const quickCopyFields = getQuickCopyFields();

  return (
    <div className="note-output">
      <h3>Generated Note</h3>
      <pre>{note}</pre>
      <div className="note-actions">
        <button className="copy-btn copy-btn-with-icon" onClick={handleCopy}>
          <svg className="btn-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
          </svg>
          Copy to Clipboard
        </button>
        <Link
          to="/"
          className="copy-btn copy-btn-with-icon"
          onClick={() => onReset?.()}
          style={{
            marginTop: '0.5rem',
            background: '#6c757d',
            width: '100%',
            textDecoration: 'none'
          }}
        >
          <svg className="btn-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"></path>
            <path d="M21 3v5h-5"></path>
            <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"></path>
            <path d="M3 21v-5h5"></path>
          </svg>
          Start New Application
        </Link>
      </div>
      
      {/* Quick Copy Section */}
      <div className={`quick-copy-section ${quickCopyFields.length === 0 ? 'quick-copy-empty' : ''}`}>
        <h4>Quick Copy</h4>
        {quickCopyFields.length > 0 ? (
          <div className="quick-copy-grid">
            {quickCopyFields.map((field, index) => (
              <div key={field.key} className="quick-copy-item" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="quick-copy-label">{field.label}</div>
                <button 
                  className="quick-copy-btn"
                  onClick={() => handleQuickCopy(field.value, field.label)}
                  title={`Copy ${field.label}`}
                >
                  {field.value}
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="quick-copy-empty-text">
            Fill out Supplier ID, Supplier Name, Amount, Payment Reference, or Payment Card Number to see quick copy options
          </div>
        )}
      </div>
    </div>
  );
};

export default NoteOutput; 