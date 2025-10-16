import { forwardRef } from 'react';

interface EmailOutputProps {
  yourName: string;
  paymentDate: string;
  accountName: string;
  accountNumber: string;
  amount: number;
}

const EmailOutput = forwardRef<HTMLDivElement, EmailOutputProps>(({
  yourName,
  paymentDate,
  accountName,
  accountNumber,
  amount,
}, ref) => {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const generateEmail = () => {
    return `${getGreeting()},

This email is to confirm that the following payment has been made by MSD:

• Payment date: ${formatDate(paymentDate)}
• Account name: ${accountName}
• Account number: ${accountNumber}
• Amount: $${amount.toFixed(2)}

Please credit this amount to the client's account.

Thanks,
${yourName}`;
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(generateEmail());
      // Show toast notification
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
      toast.textContent = 'Email copied!';
      document.body.appendChild(toast);
      
      // Animate in
      setTimeout(() => toast.style.transform = 'translateX(0)', 100);
      
      // Remove after 2 seconds
      setTimeout(() => {
        toast.style.transform = 'translateX(100%)';
        setTimeout(() => document.body.removeChild(toast), 300);
      }, 2000);
    } catch (err) {
      console.error('Failed to copy email:', err);
    }
  };

  // Only show if there's at least a name or some data filled
  if (!yourName && !accountName && amount === 0) {
    return null;
  }

  return (
    <div ref={ref} className="note-output" style={{ marginTop: '1.5rem' }}>
      <h3>Email for Power Company</h3>
      <pre>{generateEmail()}</pre>
      <div className="note-actions">
        <button className="copy-btn copy-btn-with-icon" onClick={handleCopy}>
          <svg className="btn-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
          </svg>
          Copy to Clipboard
        </button>
      </div>
    </div>
  );
});

EmailOutput.displayName = 'EmailOutput';

export default EmailOutput;

