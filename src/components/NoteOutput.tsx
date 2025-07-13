import React from 'react';
import { FoodFormData, ClothingFormData } from '../App';

interface NoteOutputProps {
  formData: any;
  service?: 'food' | 'clothing';
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