import React from 'react';
import { FoodFormData, ClothingFormData, RentArrearsFormData, CarRepairsFormData, FuneralAssistanceFormData, StrandedTravelFormData, TASGrantFormData, DeclareIncomeFormData, ADSDFormData, EmergencyFormData, TransitionToWorkFormData } from '../App';

interface NoteOutputProps {
  formData: any;
  service?: 'food' | 'clothing' | 'electricity' | 'dental' | 'beds' | 'bedding' | 'furniture' | 'glasses' | 'fridge' | 'washing' | 'tas-grant' | 'declare-income' | 'bond-rent' | 'rent-arrears' | 'car-repairs' | 'funeral-assistance' | 'stranded-travel' | 'adsd' | 'emergency' | 'transition-to-work';
  onReset: () => void;
}

const NoteOutput: React.FC<NoteOutputProps> = ({ formData, service = 'food', onReset }) => {
  const generateNote = () => {
    if (service === 'declare-income') {
      // Declare Income note output
      const d: DeclareIncomeFormData = formData;
      let note = '';
      note += '=== INCOME DECLARATION ===\n\n';
      
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
      note += `Date of first contact: ${t.dateOfFirstContact || '-'}\n`;
      note += `Client consented to re-application being completed on their behalf: ${t.clientConsent === 'yes' ? 'Yes' : t.clientConsent === 'no' ? 'No' : '-'}\n`;
      note += `Does the client have Child Support liable costs? ${t.childSupportLiableCosts === 'yes' ? 'Yes' : t.childSupportLiableCosts === 'no' ? 'No' : '-'}\n`;
      if (t.childSupportLiableCosts === 'yes') {
        note += `Child Support API consent given? ${t.childSupportAPIConsent === 'yes' ? 'Yes' : t.childSupportAPIConsent === 'no' ? 'No' : '-'}\n`;
      }
      note += `Address details correct: ${t.addressDetailsCorrect === 'yes' ? 'Yes' : t.addressDetailsCorrect === 'no' ? 'No' : '-'}\n`;
      note += `Contact details correct: ${t.contactDetailsCorrect === 'yes' ? 'Yes' : t.contactDetailsCorrect === 'no' ? 'No' : '-'}\n`;
      note += `SWIFTT Accommodation costs: $${t.accommodationCosts?.toFixed(2) || '0.00'}\n`;
      note += `Checked if Rent/Board costs include utilities: ${t.rentBoardIncludesUtilities === 'yes' ? 'Yes' : t.rentBoardIncludesUtilities === 'no' ? 'No' : '-'}\n`;
      note += `Checked if Home Ownership costs have changed: ${t.homeOwnershipCostsChanged === 'yes' ? 'Yes' : t.homeOwnershipCostsChanged === 'no' ? 'No' : '-'}\n`;
      note += `SWIFTT Disability costs: $ [${t.disabilityCostsChanged === 'yes' ? 'updated' : 'no change'}]\n`;
      note += `SWIFTT TAS costs: ${t.tasCostsChanged === 'yes' ? 'Yes' : t.tasCostsChanged === 'no' ? 'No' : '-'}\n`;
      note += `If FTC is paid by IRD is SWIFTT amount correct: ${t.familyTaxCreditsCorrect === 'yes' ? 'Yes' : t.familyTaxCreditsCorrect === 'no' ? 'No' : '-'}\n`;
      note += `SWIFTT Income is correct: ${t.incomeCorrect === 'yes' ? 'Yes' : t.incomeCorrect === 'no' ? 'No' : '-'}\n`;
      note += `SWIFTT Assets are correct: ${t.assetsCorrect === 'yes' ? 'Yes' : t.assetsCorrect === 'no' ? 'No' : '-'}\n`;
      note += `Relationship details are correct: ${t.relationshipDetailsCorrect === 'yes' ? 'Yes' : t.relationshipDetailsCorrect === 'no' ? 'No' : '-'}\n`;
      note += `If allowable costs are updated has verification been received? ${t.verificationReceived === 'yes' ? 'Yes' : t.verificationReceived === 'no' ? 'No' : '-'}\n`;
      note += `Deficiency: $${t.deficiency?.toFixed(2) || '0.00'}\n`;
      note += `TAS rate payable: $${t.tasRatePayable?.toFixed(2) || '0.00'}\n`;
      note += `Necessary and reasonable steps discussed: ${t.necessaryReasonableSteps || '-'}\n`;
      note += `Read obligations to client, client understands: ${t.clientUnderstandsObligations === 'yes' ? 'Yes' : t.clientUnderstandsObligations === 'no' ? 'No' : '-'}\n`;
      
      // Outcome section
      let outcomeText = '';
      if (t.outcome === 'regranted') {
        outcomeText = `re-granted from ${t.regrantDate || t.dateOfFirstContact}`;
      } else if (t.outcome === 'no-entitlement') {
        outcomeText = 'no entitlement';
      } else if (t.outcome === 'client-declined') {
        outcomeText = 'client declined to re-apply';
      } else if (t.outcome === 'not-regranted') {
        outcomeText = 'not re-granted - further action needed';
      }
      note += `Outcome: ${outcomeText}\n`;
      
      if (t.outcome === 'not-regranted' && t.furtherActionNeeded) {
        note += `Further action needed: ${t.furtherActionNeeded}\n`;
      }
      
      note += `LSUM sent: ${t.lsumSent === 'yes' ? 'Yes' : t.lsumSent === 'no' ? 'No' : '-'}\n`;
      
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
      note += '~~~ Need ~~~\n';
      if (c.whyNeedClothing) {
        note += `${c.whyNeedClothing}\n`;
      }

      note += '\n~~~ Payment ~~~\n';
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
      note += '\n~~~ Income ~~~\n';
      if (c.income.benefit > 0) note += `$${c.income.benefit.toFixed(2)} Benefit\n`;
      if (c.income.employment > 0) note += `$${c.income.employment.toFixed(2)} Employment\n`;
      if (c.income.childSupport > 0) note += `$${c.income.childSupport.toFixed(2)} Child Support\n`;
      if (c.income.otherIncome > 0) note += `$${c.income.otherIncome.toFixed(2)} Other Income\n`;
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
      note += '\n~~~ Reasonable Steps ~~~\n';
      if (c.reasonableSteps) note += `${c.reasonableSteps}\n`;
      note += '\n~~~ Outcome ~~~\n';
      if (c.decision === 'approved') note += 'APPLICATION APPROVED\n';
      else if (c.decision === 'declined') note += 'APPLICATION DECLINED\n';
      if (c.decisionReason) note += `${c.decisionReason}\n`;
      return note;
    } else if (service === 'emergency') {
      // Emergency Payment note output (same template as clothing)
      const e: EmergencyFormData = formData;
      let note = '';
      note += `CCID: ${e.clientId === false ? 'No' : 'Yes'}\n\n`;
      note += '~~~ Need ~~~\n';
      if (e.whyNeedEmergencyPayment) {
        note += `${e.whyNeedEmergencyPayment}\n`;
      }

      note += '\n~~~ Payment ~~~\n';
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
      note += '\n~~~ Income ~~~\n';
      if (e.income.benefit > 0) note += `$${e.income.benefit.toFixed(2)} Benefit\n`;
      if (e.income.employment > 0) note += `$${e.income.employment.toFixed(2)} Employment\n`;
      if (e.income.familyTaxCredit > 0) note += `$${e.income.familyTaxCredit.toFixed(2)} Family Tax Credit\n`;
      if (e.income.childSupport > 0) note += `$${e.income.childSupport.toFixed(2)} Child Support\n`;
      if (e.income.childDisabilityAllowance > 0) note += `$${e.income.childDisabilityAllowance.toFixed(2)} Child Disability Allowance\n`;
      if (e.income.otherIncome > 0) note += `$${e.income.otherIncome.toFixed(2)} Other Income\n`;
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
      note += '\n~~~ Reasonable Steps ~~~\n';
      if (e.reasonableSteps) note += `${e.reasonableSteps}\n`;
      note += '\n~~~ Outcome ~~~\n';
      if (e.decision === 'approved') note += 'APPLICATION APPROVED\n';
      else if (e.decision === 'declined') note += 'APPLICATION DECLINED\n';
      if (e.decisionReason) note += `${e.decisionReason}\n`;
      return note;
    } else if (service === 'transition-to-work') {
      // Transition to Work Grant note output
      const t: TransitionToWorkFormData = formData;
      let note = '';
      note += `CCID: ${t.clientId === false ? 'No' : 'Yes'}\n\n`;
      
      note += '~~~ Need ~~~\n';
      if (t.helpType) {
        note += `Client is requesting help with ${t.helpType}\n`;
      }
      
      if (t.helpType.includes('Bridging costs') && t.firstPayday) {
        note += `\nDate of first payday: ${t.firstPayday}\n`;
      }
      
      if (t.whyNeedTransitionToWork) {
        note += `\n${t.whyNeedTransitionToWork}\n`;
      }
      
      if (t.contractUploaded) {
        note += `\nContract uploaded: ${t.contractUploaded === 'yes' ? 'Yes' : 'No'}\n`;
      }

      if (t.employerName || t.startDate || t.hoursPerWeek > 0) {
        note += '\n~~~ Employment Info ~~~\n';
        if (t.employerName) note += `Employer: ${t.employerName}\n`;
        if (t.startDate) note += `Start date: ${t.startDate}\n`;
        if (t.hoursPerWeek > 0) note += `Hours per week: ${t.hoursPerWeek}\n`;
      }

      if (t.petrolAssistance === 'yes' && (t.startLocation || t.destination)) {
        note += '\n~~~ Travel Details ~~~\n';
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

      note += '\n~~~ Payment ~~~\n';
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
      note += '\n~~~ Income ~~~\n';
      if (t.income.benefit > 0) note += `$${t.income.benefit.toFixed(2)} Benefit\n`;
      if (t.income.employment > 0) note += `$${t.income.employment.toFixed(2)} Employment\n`;
      if (t.income.familyTaxCredit > 0) note += `$${t.income.familyTaxCredit.toFixed(2)} Family Tax Credit\n`;
      if (t.income.childSupport > 0) note += `$${t.income.childSupport.toFixed(2)} Child Support\n`;
      if (t.income.childDisabilityAllowance > 0) note += `$${t.income.childDisabilityAllowance.toFixed(2)} Child Disability Allowance\n`;
      if (t.income.otherIncome > 0) note += `$${t.income.otherIncome.toFixed(2)} Other Income\n`;
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
      
      note += '\n~~~ Outcome ~~~\n';
      if (t.decision === 'approved') note += 'APPLICATION APPROVED\n';
      else if (t.decision === 'declined') note += 'APPLICATION DECLINED\n';
      if (t.decisionReason) note += `${t.decisionReason}\n`;
      return note;
    } else if (service === 'adsd') {
      // ADSD note output
      const a: ADSDFormData = formData;
      let note = '';
      note += `CCID: ${a.clientId === false ? 'No' : 'Yes'}\n\n`;
      note += '~~~ Need ~~~\n';
      if (a.whyNeedADSD) {
        note += `${a.whyNeedADSD}\n`;
      }

      note += '\n~~~ Payment ~~~\n';
      if (a.amount && a.amount > 0) {
        note += `Amount: $${a.amount.toFixed(2)}\n`;
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
      note += '\n~~~ Income ~~~\n';
      if (a.income.benefit > 0) note += `$${a.income.benefit.toFixed(2)} Benefit\n`;
      if (a.income.employment > 0) note += `$${a.income.employment.toFixed(2)} Employment\n`;
      if (a.income.familyTaxCredit > 0) note += `$${a.income.familyTaxCredit.toFixed(2)} Family Tax Credit\n`;
      if (a.income.childSupport > 0) note += `$${a.income.childSupport.toFixed(2)} Child Support\n`;
      if (a.income.childDisabilityAllowance > 0) note += `$${a.income.childDisabilityAllowance.toFixed(2)} Child Disability Allowance\n`;
      if (a.income.otherIncome > 0) note += `$${a.income.otherIncome.toFixed(2)} Other Income\n`;
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
      note += '\n~~~ Reasonable Steps ~~~\n';
      if (a.reasonableSteps) note += `${a.reasonableSteps}\n`;
      note += '\n~~~ Outcome ~~~\n';
      if (a.decision === 'approved') note += 'APPLICATION APPROVED\n';
      else if (a.decision === 'declined') note += 'APPLICATION DECLINED\n';
      if (a.decisionReason) note += `${a.decisionReason}\n`;
      return note;
    } else if (service === 'rent-arrears') {
      // Rent Arrears note output
      const r: RentArrearsFormData = formData;
      let note = '';
      note += `CCID: ${r.clientId === false ? 'No' : 'Yes'}\n\n`;
      note += '~~~ Need ~~~\n';
      if (r.whyNeedRentArrears) {
        note += `${r.whyNeedRentArrears}\n`;
      }
      if (r.rentArrearsVerification === 'yes') {
        note += 'Rent arrears verification provided\n';
      }

      note += '\n~~~ Payment ~~~\n';
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
      note += '\n~~~ Tenancy Affordability ~~~\n';
      if (r.income.benefit > 0) note += `$${r.income.benefit.toFixed(2)} Benefit\n`;
      if (r.income.employment > 0) note += `$${r.income.employment.toFixed(2)} Employment\n`;
      if (r.income.familyTaxCredit > 0) note += `$${r.income.familyTaxCredit.toFixed(2)} Family Tax Credit\n`;
      if (r.income.childSupport > 0) note += `$${r.income.childSupport.toFixed(2)} Child Support\n`;
      if (r.income.childDisabilityAllowance > 0) note += `$${r.income.childDisabilityAllowance.toFixed(2)} Child Disability Allowance\n`;
      if (r.income.otherIncome > 0) note += `$${r.income.otherIncome.toFixed(2)} Other Income\n`;
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
      
      note += '\n~~~ Reasonable Steps ~~~\n';
      if (r.reasonableSteps) note += `${r.reasonableSteps}\n`;
      note += '\n~~~ Outcome ~~~\n';
      if (r.decision === 'approved') note += 'APPLICATION APPROVED\n';
      else if (r.decision === 'declined') note += 'APPLICATION DECLINED\n';
      if (r.decisionReason) note += `${r.decisionReason}\n`;
      return note;
    } else if (service === 'car-repairs') {
      // Car Repairs note output
      const c: CarRepairsFormData = formData;
      let note = '';
      note += `CCID: ${c.clientId === false ? 'No' : 'Yes'}\n\n`;
      note += '~~~ Need ~~~\n';
      if (c.whyNeedCarRepairs) {
        note += `${c.whyNeedCarRepairs}\n`;
      }

      note += '\n~~~ Car Details ~~~\n';
      if (c.vehicleMakeModel) note += `Vehicle: ${c.vehicleMakeModel}\n`;
      if (c.licensePlate) note += `License plate: ${c.licensePlate}\n`;
      if (c.odometer) note += `Odometer: ${c.odometer}\n`;
      if (c.vehicleOwner) note += `Vehicle owner: ${c.vehicleOwner}\n`;
      if (c.nztaVerification) {
        note += '\nOwnership verification:\n';
        note += `${c.nztaVerification}\n`;
      }

      note += '\n~~~ Payment ~~~\n';
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
      note += '\n~~~ Income ~~~\n';
      if (c.income.benefit > 0) note += `$${c.income.benefit.toFixed(2)} Benefit\n`;
      if (c.income.employment > 0) note += `$${c.income.employment.toFixed(2)} Employment\n`;
      if (c.income.familyTaxCredit > 0) note += `$${c.income.familyTaxCredit.toFixed(2)} Family Tax Credit\n`;
      if (c.income.childSupport > 0) note += `$${c.income.childSupport.toFixed(2)} Child Support\n`;
      if (c.income.childDisabilityAllowance > 0) note += `$${c.income.childDisabilityAllowance.toFixed(2)} Child Disability Allowance\n`;
      if (c.income.otherIncome > 0) note += `$${c.income.otherIncome.toFixed(2)} Other Income\n`;
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
      
      note += '\n~~~ Reasonable Steps ~~~\n';
      if (c.reasonableSteps) note += `${c.reasonableSteps}\n`;
      note += '\n~~~ Outcome ~~~\n';
      if (c.decision === 'approved') note += 'APPLICATION APPROVED\n';
      else if (c.decision === 'declined') note += 'APPLICATION DECLINED\n';
      if (c.decisionReason) note += `${c.decisionReason}\n`;
      return note;
    } else if (service === 'funeral-assistance') {
      // Funeral Assistance note output
      const f: FuneralAssistanceFormData = formData;
      let note = '';
      note += `CCID: ${f.clientId === false ? 'No' : 'Yes'}\n\n`;
      note += '~~~ Need ~~~\n';
      if (f.whyNeedFuneralAssistance) {
        note += `${f.whyNeedFuneralAssistance}\n`;
      }

      if (f.petrolAssistance === 'yes') {
        note += '\n~~~ Travel Details ~~~\n';
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

      note += '\n~~~ Payment ~~~\n';
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
      note += '\n~~~ Income ~~~\n';
      if (f.income.benefit > 0) note += `$${f.income.benefit.toFixed(2)} Benefit\n`;
      if (f.income.employment > 0) note += `$${f.income.employment.toFixed(2)} Employment\n`;
      if (f.income.familyTaxCredit > 0) note += `$${f.income.familyTaxCredit.toFixed(2)} Family Tax Credit\n`;
      if (f.income.childSupport > 0) note += `$${f.income.childSupport.toFixed(2)} Child Support\n`;
      if (f.income.childDisabilityAllowance > 0) note += `$${f.income.childDisabilityAllowance.toFixed(2)} Child Disability Allowance\n`;
      if (f.income.otherIncome > 0) note += `$${f.income.otherIncome.toFixed(2)} Other Income\n`;
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
      
      note += '\n~~~ Reasonable Steps ~~~\n';
      if (f.reasonableSteps) note += `${f.reasonableSteps}\n`;
      note += '\n~~~ Outcome ~~~\n';
      if (f.decision === 'approved') note += 'APPLICATION APPROVED\n';
      else if (f.decision === 'declined') note += 'APPLICATION DECLINED\n';
      if (f.decisionReason) note += `${f.decisionReason}\n`;
      return note;
    } else if (service === 'stranded-travel') {
      // Stranded Travel note output (same template as funeral assistance)
      const s: StrandedTravelFormData = formData;
      let note = '';
      note += `CCID: ${s.clientId === false ? 'No' : 'Yes'}\n\n`;
      note += '~~~ Need ~~~\n';
      if (s.whyNeedStrandedTravelAssistance) {
        note += `${s.whyNeedStrandedTravelAssistance}\n`;
      }

      if (s.petrolAssistance === 'yes') {
        note += '\n~~~ Travel Details ~~~\n';
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

      note += '\n~~~ Payment ~~~\n';
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
      note += '\n~~~ Income ~~~\n';
      if (s.income.benefit > 0) note += `$${s.income.benefit.toFixed(2)} Benefit\n`;
      if (s.income.employment > 0) note += `$${s.income.employment.toFixed(2)} Employment\n`;
      if (s.income.familyTaxCredit > 0) note += `$${s.income.familyTaxCredit.toFixed(2)} Family Tax Credit\n`;
      if (s.income.childSupport > 0) note += `$${s.income.childSupport.toFixed(2)} Child Support\n`;
      if (s.income.childDisabilityAllowance > 0) note += `$${s.income.childDisabilityAllowance.toFixed(2)} Child Disability Allowance\n`;
      if (s.income.otherIncome > 0) note += `$${s.income.otherIncome.toFixed(2)} Other Income\n`;
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
      
      note += '\n~~~ Reasonable Steps ~~~\n';
      if (s.reasonableSteps) note += `${s.reasonableSteps}\n`;
      note += '\n~~~ Outcome ~~~\n';
      if (s.decision === 'approved') note += 'APPLICATION APPROVED\n';
      else if (s.decision === 'declined') note += 'APPLICATION DECLINED\n';
      if (s.decisionReason) note += `${s.decisionReason}\n`;
      return note;
    } else if (service === 'bond-rent') {
      // Bond/Rent in Advance note output
      const b = formData;
      let note = '';
      note += `CCID: ${b.clientId === false ? 'No' : 'Yes'}\n\n`;
      note += '~~~ Need ~~~\n';
      if (b.whyNeedAccommodation) note += `${b.whyNeedAccommodation}\n`;

      note += '\n~~~ Tenancy Details ~~~\n';
      if (b.asZone) note += `AS Zone: ${b.asZone}\n`;
      if (b.newAddress) note += `Address: ${b.newAddress}\n`;
      if (b.weeklyRent) note += `Weekly Rent: ${b.weeklyRent.toFixed(2)}\n`;
      if (b.tenancyStartDate) {
        const date = new Date(b.tenancyStartDate);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        note += `Tenancy start date: ${day}/${month}/${year}\n`;
      }
      
      note += '\n~~~ Payment ~~~\n';
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
      
      note += '\n~~~ Tenancy Affordability ~~~\n';
      if (b.income.benefit > 0) note += `$${b.income.benefit.toFixed(2)} Benefit\n`;
      if (b.income.employment > 0) note += `$${b.income.employment.toFixed(2)} Employment\n`;
      if (b.income.familyTaxCredit > 0) note += `$${b.income.familyTaxCredit.toFixed(2)} Family Tax Credit\n`;
      if (b.income.childSupport > 0) note += `$${b.income.childSupport.toFixed(2)} Child Support\n`;
      if (b.income.childDisabilityAllowance > 0) note += `$${b.income.childDisabilityAllowance.toFixed(2)} Child Disability Allowance\n`;
      if (b.income.otherIncome > 0) note += `$${b.income.otherIncome.toFixed(2)} Other Income\n`;
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
      
      note += '\n~~~ Reasonable Steps ~~~\n';
      if (b.reasonableSteps) note += `${b.reasonableSteps}\n`;
      note += '\n~~~ Outcome ~~~\n';
      if (b.decision === 'approved') note += 'APPLICATION APPROVED\n';
      else if (b.decision === 'declined') note += 'APPLICATION DECLINED\n';
      if (b.decisionReason) note += `${b.decisionReason}\n`;
      return note;
    } else if (service === 'electricity') {
      // Electricity note output (similar to clothing)
      const e = formData;
      let note = '';
      note += `CCID: ${e.clientId === false ? 'No' : 'Yes'}\n\n`;
      note += '~~~ Need ~~~\n';
      if (e.whyNeedPower) note += `${e.whyNeedPower}\n`;

      note += `Power Account Number: ${e.powerAccountNumber || '-'}\n`;
      note += '\n~~~ Payment ~~~\n';
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
      note += '\n~~~ Income ~~~\n';
      if (e.income.benefit > 0) note += `$${e.income.benefit.toFixed(2)} Benefit\n`;
      if (e.income.employment > 0) note += `$${e.income.employment.toFixed(2)} Employment\n`;
      if (e.income.familyTaxCredit > 0) note += `$${e.income.familyTaxCredit.toFixed(2)} Family Tax Credit\n`;
      if (e.income.childSupport > 0) note += `$${e.income.childSupport.toFixed(2)} Child Support\n`;
      if (e.income.childDisabilityAllowance > 0) note += `$${e.income.childDisabilityAllowance.toFixed(2)} Child Disability Allowance\n`;
      if (e.income.otherIncome > 0) note += `$${e.income.otherIncome.toFixed(2)} Other Income\n`;
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
      note += '\n~~~ Reasonable Steps ~~~\n';
      if (e.reasonableSteps) note += `${e.reasonableSteps}\n`;
      note += '\n~~~ Outcome ~~~\n';
      if (e.decision === 'approved') note += 'APPLICATION APPROVED\n';
      else if (e.decision === 'declined') note += 'APPLICATION DECLINED\n';
      if (e.decisionReason) note += `${e.decisionReason}\n`;
      return note;
    } else if (service === 'dental') {
      // Dental note output
      const d = formData;
      let note = '';
      note += `CCID: ${d.clientId === false ? 'No' : 'Yes'}\n\n`;
      note += '~~~ Need ~~~\n';
      if (d.whyNeedDental) note += `${d.whyNeedDental}\n`;

      note += '\n~~~ Payment ~~~\n';
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
      note += '\n~~~ Income ~~~\n';
      if (d.income.benefit > 0) note += `$${d.income.benefit.toFixed(2)} Benefit\n`;
      if (d.income.employment > 0) note += `$${d.income.employment.toFixed(2)} Employment\n`;
      if (d.income.familyTaxCredit > 0) note += `$${d.income.familyTaxCredit.toFixed(2)} Family Tax Credit\n`;
      if (d.income.childSupport > 0) note += `$${d.income.childSupport.toFixed(2)} Child Support\n`;
      if (d.income.childDisabilityAllowance > 0) note += `$${d.income.childDisabilityAllowance.toFixed(2)} Child Disability Allowance\n`;
      if (d.income.otherIncome > 0) note += `$${d.income.otherIncome.toFixed(2)} Other Income\n`;
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
      note += '\n~~~ Reasonable Steps ~~~\n';
      if (d.reasonableSteps) note += `${d.reasonableSteps}\n`;
      note += '\n~~~ Outcome ~~~\n';
      if (d.decision === 'approved') note += 'APPLICATION APPROVED\n';
      else if (d.decision === 'declined') note += 'APPLICATION DECLINED\n';
      if (d.decisionReason) note += `${d.decisionReason}\n`;
      return note;
    } else if (service === 'beds') {
      // Beds note output (like clothing, but beds wording)
      const b = formData;
      let note = '';
      note += `CCID: ${b.clientId === false ? 'No' : 'Yes'}\n\n`;
      note += '~~~ Need ~~~\n';
      if (b.whyNeedBeds) note += `${b.whyNeedBeds}\n`;

      note += '\n~~~ Payment ~~~\n';
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
      note += '\n~~~ Income ~~~\n';
      if (b.income.benefit > 0) note += `$${b.income.benefit.toFixed(2)} Benefit\n`;
      if (b.income.employment > 0) note += `$${b.income.employment.toFixed(2)} Employment\n`;
      if (b.income.familyTaxCredit > 0) note += `$${b.income.familyTaxCredit.toFixed(2)} Family Tax Credit\n`;
      if (b.income.childSupport > 0) note += `$${b.income.childSupport.toFixed(2)} Child Support\n`;
      if (b.income.childDisabilityAllowance > 0) note += `$${b.income.childDisabilityAllowance.toFixed(2)} Child Disability Allowance\n`;
      if (b.income.otherIncome > 0) note += `$${b.income.otherIncome.toFixed(2)} Other Income\n`;
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
      note += '\n~~~ Reasonable Steps ~~~\n';
      if (b.reasonableSteps) note += `${b.reasonableSteps}\n`;
      note += '\n~~~ Outcome ~~~\n';
      if (b.decision === 'approved') note += 'APPLICATION APPROVED\n';
      else if (b.decision === 'declined') note += 'APPLICATION DECLINED\n';
      if (b.decisionReason) note += `${b.decisionReason}\n`;
      return note;
    } else if (service === 'furniture') {
      // Furniture note output (like beds, but furniture wording)
      const f = formData;
      let note = '';
      note += `CCID: ${f.clientId === false ? 'No' : 'Yes'}\n\n`;
      note += '~~~ Need ~~~\n';
      if (f.whyNeedFurniture) note += `${f.whyNeedFurniture}\n`;
      if (f.furnitureType) note += `Client is requesting help with a ${f.furnitureType}\n`;

      note += '\n~~~ Payment ~~~\n';
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
      note += '\n~~~ Income ~~~\n';
      if (f.income.benefit > 0) note += `$${f.income.benefit.toFixed(2)} Benefit\n`;
      if (f.income.employment > 0) note += `$${f.income.employment.toFixed(2)} Employment\n`;
      if (f.income.familyTaxCredit > 0) note += `$${f.income.familyTaxCredit.toFixed(2)} Family Tax Credit\n`;
      if (f.income.childSupport > 0) note += `$${f.income.childSupport.toFixed(2)} Child Support\n`;
      if (f.income.childDisabilityAllowance > 0) note += `$${f.income.childDisabilityAllowance.toFixed(2)} Child Disability Allowance\n`;
      if (f.income.otherIncome > 0) note += `$${f.income.otherIncome.toFixed(2)} Other Income\n`;
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
      note += '\n~~~ Reasonable Steps ~~~\n';
      if (f.reasonableSteps) note += `${f.reasonableSteps}\n`;
      note += '\n~~~ Outcome ~~~\n';
      if (f.decision === 'approved') note += 'APPLICATION APPROVED\n';
      else if (f.decision === 'declined') note += 'APPLICATION DECLINED\n';
      if (f.decisionReason) note += `${f.decisionReason}\n`;
      return note;
    } else if (service === 'bedding') {
      // Bedding note output (like beds, with SNG logic)
      const b = formData;
      let note = '';
      note += `CCID: ${b.clientId === false ? 'No' : 'Yes'}\n\n`;
      note += '~~~ Need ~~~\n';
      if (b.whyNeedBedding) note += `${b.whyNeedBedding}\n`;

      if (b.beddingSngEligible === 'yes') {
        note += '\nClient qualifies for bedding SNG\n';
        if (b.beddingSngReason) note += `Reason: ${b.beddingSngReason}\n`;
      }
      note += '\n~~~ Payment ~~~\n';
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
      note += '\n~~~ Income ~~~\n';
      if (b.income.benefit > 0) note += `$${b.income.benefit.toFixed(2)} Benefit\n`;
      if (b.income.employment > 0) note += `$${b.income.employment.toFixed(2)} Employment\n`;
      if (b.income.familyTaxCredit > 0) note += `$${b.income.familyTaxCredit.toFixed(2)} Family Tax Credit\n`;
      if (b.income.childSupport > 0) note += `$${b.income.childSupport.toFixed(2)} Child Support\n`;
      if (b.income.childDisabilityAllowance > 0) note += `$${b.income.childDisabilityAllowance.toFixed(2)} Child Disability Allowance\n`;
      if (b.income.otherIncome > 0) note += `$${b.income.otherIncome.toFixed(2)} Other Income\n`;
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
      note += '\n~~~ Reasonable Steps ~~~\n';
      if (b.reasonableSteps) note += `${b.reasonableSteps}\n`;
      note += '\n~~~ Outcome ~~~\n';
      if (b.decision === 'approved') note += 'APPLICATION APPROVED\n';
      else if (b.decision === 'declined') note += 'APPLICATION DECLINED\n';
      if (b.decisionReason) note += `${b.decisionReason}\n`;
      return note;
    } else if (service === 'glasses') {
      // Glasses note output (similar to clothing)
      const g = formData;
      let note = '';
      note += `CCID: ${g.clientId === false ? 'No' : 'Yes'}\n\n`;
      note += '~~~ Need ~~~\n';
      if (g.whyNeedGlasses) note += `${g.whyNeedGlasses}\n`;

      note += '\n~~~ Payment ~~~\n';
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
      note += '\n~~~ Income ~~~\n';
      if (g.income.benefit > 0) note += `$${g.income.benefit.toFixed(2)} Benefit\n`;
      if (g.income.employment > 0) note += `$${g.income.employment.toFixed(2)} Employment\n`;
      if (g.income.childSupport > 0) note += `$${g.income.childSupport.toFixed(2)} Child Support\n`;
      if (g.income.otherIncome > 0) note += `$${g.income.otherIncome.toFixed(2)} Other Income\n`;
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
      note += '\n~~~ Reasonable Steps ~~~\n';
      if (g.reasonableSteps) note += `${g.reasonableSteps}\n`;
      note += '\n~~~ Outcome ~~~\n';
      if (g.decision === 'approved') note += 'APPLICATION APPROVED\n';
      else if (g.decision === 'declined') note += 'APPLICATION DECLINED\n';
      if (g.decisionReason) note += `${g.decisionReason}\n`;
      return note;
    } else if (service === 'fridge') {
      // Fridge note output
      const f = formData;
      let note = '';
      note += `CCID: ${f.clientId === false ? 'No' : 'Yes'}\n\n`;
      note += '~~~ Need ~~~\n';
      if (f.whyNeedFridge) note += `${f.whyNeedFridge}\n`;

      if (f.reasonableSteps) note += `What reasonable steps is the client taken to improve their situation?\n${f.reasonableSteps}\n`;
      
      // Whiteware Info section
      const householdSizeLabels: { [key: string]: string } = {
        '1-2': '1-2 people',
        '3-4': '3-4 people',
        '5+': '5+ people'
      };
      note += '\nHousehold size: ' + (householdSizeLabels[f.householdSize] || f.householdSize || '-') + '\n';
      note += 'Model: ' + (f.applianceModel || '-') + '\n';
      note += 'CA: ' + (f.applianceCANumber || '-') + '\n';
      note += '\nAddress/contact details confirmed: ' + (f.addressContactConfirmed || '-') + '\n';
      note += 'Space measured: ' + (f.spaceMeasured || '-') + '\n';
      if (f.deliveryInstructionsDetails) {
        note += 'Special delivery instructions:\n' + f.deliveryInstructionsDetails + '\n';
      }
      
      note += '\n~~~ Payment ~~~\n';
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
      note += '\n~~~ Income ~~~\n';
      if (f.income.benefit > 0) note += `$${f.income.benefit.toFixed(2)} Benefit\n`;
      if (f.income.employment > 0) note += `$${f.income.employment.toFixed(2)} Employment\n`;
      if (f.income.childSupport > 0) note += `$${f.income.childSupport.toFixed(2)} Child Support\n`;
      if (f.income.otherIncome > 0) note += `$${f.income.otherIncome.toFixed(2)} Other Income\n`;
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
      note += '\n~~~ Reasonable Steps ~~~\n';
      if (f.reasonableSteps) note += `${f.reasonableSteps}\n`;
      note += '\n~~~ Outcome ~~~\n';
      if (f.decision === 'approved') note += 'APPLICATION APPROVED\n';
      else if (f.decision === 'declined') note += 'APPLICATION DECLINED\n';
      if (f.decisionReason) note += `${f.decisionReason}\n`;
      return note;
    } else if (service === 'washing') {
      // Washing Machine note output
      const w = formData;
      let note = '';
      note += `CCID: ${w.clientId === false ? 'No' : 'Yes'}\n\n`;
      note += '~~~ Need ~~~\n';
      if (w.whyNeedWashingMachine) note += `${w.whyNeedWashingMachine}\n`;

      if (w.reasonableSteps) note += `What reasonable steps is the client taken to improve their situation?\n${w.reasonableSteps}\n`;
      
      // Whiteware Info section
      const householdSizeLabels: { [key: string]: string } = {
        '1-2': '1-2 people',
        '3-4': '3-4 people',
        '5+': '5+ people'
      };
      note += '\nHousehold size: ' + (householdSizeLabels[w.householdSize] || w.householdSize || '-') + '\n';
      note += 'Model: ' + (w.applianceModel || '-') + '\n';
      note += 'CA: ' + (w.applianceCANumber || '-') + '\n';
      note += '\nAddress/contact details confirmed: ' + (w.addressContactConfirmed || '-') + '\n';
      note += 'Space measured: ' + (w.spaceMeasured || '-') + '\n';
      if (w.deliveryInstructionsDetails) {
        note += 'Special delivery instructions:\n' + w.deliveryInstructionsDetails + '\n';
      }
      
      note += '\n~~~ Payment ~~~\n';
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
      note += '\n~~~ Income ~~~\n';
      if (w.income.benefit > 0) note += `$${w.income.benefit.toFixed(2)} Benefit\n`;
      if (w.income.employment > 0) note += `$${w.income.employment.toFixed(2)} Employment\n`;
      if (w.income.childSupport > 0) note += `$${w.income.childSupport.toFixed(2)} Child Support\n`;
      if (w.income.otherIncome > 0) note += `$${w.income.otherIncome.toFixed(2)} Other Income\n`;
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
      note += '\n~~~ Reasonable Steps ~~~\n';
      if (w.reasonableSteps) note += `${w.reasonableSteps}\n`;
      note += '\n~~~ Outcome ~~~\n';
      if (w.decision === 'approved') note += 'APPLICATION APPROVED\n';
      else if (w.decision === 'declined') note += 'APPLICATION DECLINED\n';
      if (w.decisionReason) note += `${w.decisionReason}\n`;
      return note;
    } else {
      // Food note output (existing logic)
      const f: FoodFormData = formData;
      const totalIncome = Object.values(f.income).reduce((sum: number, value: number) => sum + (value || 0), 0);
      const totalCosts = f.costs.reduce((sum: number, cost: { amount: number; cost: string }) => sum + (cost.amount || 0), 0);
      const remainingIncome = totalIncome - totalCosts;
      let note = '';
      note += `CCID: ${f.clientId === false ? 'No' : 'Yes'}\n\n`;
             note += '~~~ Need ~~~\n';
       if (f.whyNeedFood) note += `${f.whyNeedFood}\n`;

       note += '\n';
       if (f.currentFoodBalance > 0) {
         note += `Food balance: $${f.currentFoodBalance.toFixed(2)}\n`;
         if (f.hardshipUnforeseen === 'yes' && f.unforeseenCircumstance) {
           note += `Client is in hardship due to the following unforeseen circumstance: ${f.unforeseenCircumstance}\n`;
         }
       }
       if (f.foodAmountRequested > 0) note += `Amount requesting: $${f.foodAmountRequested.toFixed(2)}\n`;
      note += '\n~~~ Income ~~~\n';
      if (f.income.benefit > 0) note += `$${f.income.benefit.toFixed(2)} Benefit\n`;
      if (f.income.employment > 0) note += `$${f.income.employment.toFixed(2)} Employment\n`;
      if (f.income.childSupport > 0) note += `$${f.income.childSupport.toFixed(2)} Child Support\n`;
      if (f.income.otherIncome > 0) note += `$${f.income.otherIncome.toFixed(2)} Other Income\n`;
      f.costs.forEach((cost: { amount: number; cost: string }) => {
        if (cost.amount > 0) note += `-$${cost.amount.toFixed(2)} ${cost.cost}\n`;
      });
      if (f.costs.length > 0) {
        note += '--------------\n';
        note += `Client is left with $${remainingIncome.toFixed(2)}\n`;
      }
      note += '\n';
      if (f.reasonableSteps) {
        note += '~~~ Reasonable Steps ~~~\n';
        note += `${f.reasonableSteps}\n\n`;
      }
      note += '~~~ Outcome ~~~\n';
      if (f.decision === 'approved') note += 'APPLICATION APPROVED\n';
      else if (f.decision === 'declined') note += 'APPLICATION DECLINED\n';
      if (f.decisionReason) note += `${f.decisionReason}\n`;
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
        <button 
          className="copy-btn copy-btn-with-icon" 
          onClick={onReset}
          style={{ marginTop: '0.5rem', background: '#6c757d', width: '100%' }}
        >
          <svg className="btn-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"></path>
            <path d="M21 3v5h-5"></path>
            <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"></path>
            <path d="M3 21v-5h5"></path>
          </svg>
          Start New Application
        </button>
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