import React from 'react';
import { FoodFormData, ClothingFormData } from '../App';

interface NoteOutputProps {
  formData: any;
  service?: 'food' | 'clothing' | 'electricity' | 'dental' | 'beds' | 'bedding';
  onReset: () => void;
}

const NoteOutput: React.FC<NoteOutputProps> = ({ formData, service = 'food', onReset }) => {
  const generateNote = () => {
    if (service === 'clothing') {
      // Clothing note output
      const c: ClothingFormData = formData;
      let note = '';
      note += `CCID: ${c.clientId ? 'Yes' : 'No'}\n\n`;
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
      c.costs.forEach(cost => {
        if (cost.amount > 0) note += `-$${cost.amount.toFixed(2)} ${cost.cost}\n`;
      });
      if (c.costs.length > 0) {
        const totalIncome = Object.values(c.income).reduce((sum, value) => sum + (value || 0), 0);
        const totalCosts = c.costs.reduce((sum, cost) => sum + (cost.amount || 0), 0);
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
      note += `CCID: ${e.clientId ? 'Yes' : 'No'}\n\n`;
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
      e.costs.forEach(cost => {
        if (cost.amount > 0) note += `-$${cost.amount.toFixed(2)} ${cost.cost}\n`;
      });
      if (e.costs.length > 0) {
        const totalIncome = Object.values(e.income).reduce((sum, value) => sum + (value || 0), 0);
        const totalCosts = e.costs.reduce((sum, cost) => sum + (cost.amount || 0), 0);
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
      note += `CCID: ${d.clientId ? 'Yes' : 'No'}\n\n`;
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
      d.costs.forEach((cost: any) => {
        if (cost.amount > 0) note += `-$${cost.amount.toFixed(2)} ${cost.cost}\n`;
      });
      if (d.costs.length > 0) {
        const totalIncome = Object.values(d.income).reduce((sum: number, value: number) => sum + (value || 0), 0);
        const totalCosts = d.costs.reduce((sum: number, cost: any) => sum + (cost.amount || 0), 0);
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
      note += `CCID: ${b.clientId ? 'Yes' : 'No'}\n\n`;
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
        const totalIncome = Object.values(b.income as {[k:string]:number}).reduce((sum: number, value: number) => sum + (value || 0), 0);
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
    } else if (service === 'bedding') {
      // Bedding note output (like beds, with SNG logic)
      const b = formData;
      let note = '';
      note += `CCID: ${b.clientId ? 'Yes' : 'No'}\n\n`;
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
      (b.costs as Array<{amount:number;cost:string}>).forEach((cost) => {
        if (cost.amount > 0) note += `-$${cost.amount.toFixed(2)} ${cost.cost}\n`;
      });
      if (b.costs && b.costs.length > 0) {
        const totalIncome = Object.values(b.income as {[k:string]:number}).reduce((sum, value) => sum + (value || 0), 0);
        const totalCosts = (b.costs as Array<{amount:number}>).reduce((sum, cost) => sum + (cost.amount || 0), 0);
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
    } else {
      // Food note output (existing logic)
      const f: FoodFormData = formData;
      const totalIncome = Object.values(f.income).reduce((sum, value) => sum + (value || 0), 0);
      const totalCosts = f.costs.reduce((sum, cost) => sum + (cost.amount || 0), 0);
      const remainingIncome = totalIncome - totalCosts;
      let note = '';
      note += `CCID: ${f.clientId ? 'Yes' : 'No'}\n\n`;
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
      f.costs.forEach(cost => {
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