import React from 'react';
import { FoodFormData, ClothingFormData, TASGrantFormData, DeclareIncomeFormData } from '../App';

interface NoteOutputProps {
  formData: any;
  service?: 'food' | 'clothing' | 'electricity' | 'dental' | 'beds' | 'bedding' | 'furniture' | 'glasses' | 'fridge' | 'washing' | 'tas-grant' | 'declare-income';
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
            note += '\n';
          });
          
          note += `Total weekly income: $${weekTotal.toFixed(2)}\n`;
        }
        
        note += '\n';
      });

      // Calculate grand total
      const grandTotal = d.weeks.reduce((total, week) => {
        return total + week.incomeSources.reduce((weekTotal, source) => {
          if (source.type === 'hourly' && source.hoursWorked && source.hourlyRate) {
            return weekTotal + (source.hoursWorked * source.hourlyRate);
          } else if (source.type === 'lump-sum' && source.lumpSumAmount) {
            return weekTotal + source.lumpSumAmount;
          }
          return weekTotal;
        }, 0);
      }, 0);

      if (d.weeks.length > 1) {
        note += `=== GRAND TOTAL: $${grandTotal.toFixed(2)} ===\n`;
      }
      
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
        note += `Why is the client needing clothing?\n${c.whyNeedClothing}\n`;
      }
      if (c.canMeetNeedOtherWay) {
        note += `Can client meet this need in any other way?\n${c.canMeetNeedOtherWay}\n`;
      }
      note += '\n~~~ Payment ~~~\n';
      note += `Supplier Name: ${c.supplierName || '-'}\n`;
      note += `Supplier ID: ${c.supplierId || '-'}\n`;
      note += `Amount: $${c.amount?.toFixed(2) || '0.00'}\n`;
      note += `Recovery rate: $${c.recoveryRate?.toFixed(2) || '0.00'}\n`;
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
    } else if (service === 'electricity') {
      // Electricity note output (similar to clothing)
      const e = formData;
      let note = '';
      note += `CCID: ${e.clientId === false ? 'No' : 'Yes'}\n\n`;
      note += '~~~ Need ~~~\n';
      if (e.whyNeedPower) note += `Why is the client needing power assistance?\n${e.whyNeedPower}\n`;
      if (e.canMeetNeedOtherWay) note += `Can client meet this need in any other way?\n${e.canMeetNeedOtherWay}\n`;
      note += `Power Account Number: ${e.powerAccountNumber || '-'}\n`;
      note += '\n~~~ Payment ~~~\n';
      note += `Supplier Name: ${e.supplierName || '-'}\n`;
      note += `Supplier ID: ${e.supplierId || '-'}\n`;
      note += `Amount: $${e.amount?.toFixed(2) || '0.00'}\n`;
      note += `Recovery rate: $${e.recoveryRate?.toFixed(2) || '0.00'}\n`;
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
      if (d.whyNeedDental) note += `Why is the client needing dental assistance?\n${d.whyNeedDental}\n`;
      if (d.canMeetNeedOtherWay) note += `Can client meet this need in any other way?\n${d.canMeetNeedOtherWay}\n`;
      note += '\n~~~ Payment ~~~\n';
      note += `Supplier Name: ${d.supplierName || '-'}\n`;
      note += `Supplier ID: ${d.supplierId || '-'}\n`;
      note += `Total Cost: $${d.amount?.toFixed(2) || '0.00'}\n`;
      if (d.sngEligible === 'yes') {
        const sng = Math.min(d.amount, d.sngBalance || 0);
        const advance = Math.max(0, d.amount - sng);
        note += `SNG: $${sng.toFixed(2)}\n`;
        if (advance > 0) note += `Advance: $${advance.toFixed(2)}\n`;
      }
      note += `Recovery rate: $${d.recoveryRate?.toFixed(2) || '0.00'}\n`;
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
      if (b.whyNeedBeds) note += `Why is the client needing beds?\n${b.whyNeedBeds}\n`;
      if (b.canMeetNeedOtherWay) note += `Can client meet this need in any other way?\n${b.canMeetNeedOtherWay}\n`;
      note += '\n~~~ Payment ~~~\n';
      note += `Supplier Name: ${b.supplierName || '-'}\n`;
      note += `Supplier ID: ${b.supplierId || '-'}\n`;
      note += `Amount: $${b.amount?.toFixed(2) || '0.00'}\n`;
      note += `Recovery rate: $${b.recoveryRate?.toFixed(2) || '0.00'}\n`;
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
      if (f.whyNeedFurniture) note += `Why is the client needing furniture?\n${f.whyNeedFurniture}\n`;
      if (f.furnitureType) note += `Client is requesting help with a ${f.furnitureType}\n`;
      if (f.canMeetNeedOtherWay) note += `Can client meet this need in any other way?\n${f.canMeetNeedOtherWay}\n`;
      note += '\n~~~ Payment ~~~\n';
      note += `Supplier Name: ${f.supplierName || '-'}\n`;
      note += `Supplier ID: ${f.supplierId || '-'}\n`;
      note += `Amount: $${f.amount?.toFixed(2) || '0.00'}\n`;
      note += `Recovery rate: $${f.recoveryRate?.toFixed(2) || '0.00'}\n`;
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
      if (b.whyNeedBedding) note += `Why is the client needing bedding?\n${b.whyNeedBedding}\n`;
      if (b.canMeetNeedOtherWay) note += `Can client meet this need in any other way?\n${b.canMeetNeedOtherWay}\n`;
      if (b.beddingSngEligible === 'yes') {
        note += '\nClient qualifies for bedding SNG\n';
        if (b.beddingSngReason) note += `Reason: ${b.beddingSngReason}\n`;
      }
      note += '\n~~~ Payment ~~~\n';
      note += `Supplier Name: ${b.supplierName || '-'}\n`;
      note += `Supplier ID: ${b.supplierId || '-'}\n`;
      note += `Amount: $${b.amount?.toFixed(2) || '0.00'}\n`;
      note += `Recovery rate: $${b.recoveryRate?.toFixed(2) || '0.00'}\n`;
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
      if (g.whyNeedGlasses) note += `Why is the client needing glasses?\n${g.whyNeedGlasses}\n`;
      if (g.canMeetNeedOtherWay) note += `Can client meet this need in any other way?\n${g.canMeetNeedOtherWay}\n`;
      note += '\n~~~ Payment ~~~\n';
      note += `Supplier Name: ${g.supplierName || '-'}\n`;
      note += `Supplier ID: ${g.supplierId || '-'}\n`;
      note += `Amount: $${g.amount?.toFixed(2) || '0.00'}\n`;
      note += `Recovery rate: $${g.recoveryRate?.toFixed(2) || '0.00'}\n`;
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
      if (f.whyNeedFridge) note += `Why is the client needing a fridge?\n${f.whyNeedFridge}\n`;
      if (f.canMeetNeedOtherWay) note += `Can client meet this need in any other way?\n${f.canMeetNeedOtherWay}\n`;
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
      note += `Supplier Name: ${f.supplierName || '-'}\n`;
      note += `Supplier ID: ${f.supplierId || '-'}\n`;
      note += `Amount: $${f.amount?.toFixed(2) || '0.00'}\n`;
      note += `Recovery rate: $${f.recoveryRate?.toFixed(2) || '0.00'}\n`;
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
      if (w.whyNeedWashingMachine) note += `Why is the client needing a washing machine?\n${w.whyNeedWashingMachine}\n`;
      if (w.canMeetNeedOtherWay) note += `Can client meet this need in any other way?\n${w.canMeetNeedOtherWay}\n`;
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
      note += `Supplier Name: ${w.supplierName || '-'}\n`;
      note += `Supplier ID: ${w.supplierId || '-'}\n`;
      note += `Amount: $${w.amount?.toFixed(2) || '0.00'}\n`;
      note += `Recovery rate: $${w.recoveryRate?.toFixed(2) || '0.00'}\n`;
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
      if (f.whyNeedFood) note += `Why is client needing food?\n${f.whyNeedFood}\n`;
      if (f.canMeetNeedOtherWay) note += `Can client meet this need in any other way?\n${f.canMeetNeedOtherWay}\n`;
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
      alert('Note copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy: ', err);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = generateNote();
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      alert('Note copied to clipboard!');
    }
  };

  const note = generateNote();

  return (
    <div className="note-output">
      <h3>Generated Note</h3>
      <pre>{note}</pre>
      <div className="note-actions">
        <button className="copy-btn" onClick={handleCopy}>
          Copy to Clipboard
        </button>
        <button 
          className="copy-btn" 
          onClick={onReset}
          style={{ marginTop: '0.5rem', background: '#6c757d', width: '100%' }}
        >
          Start New Application
        </button>
      </div>
    </div>
  );
};

export default NoteOutput; 