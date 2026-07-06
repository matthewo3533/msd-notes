import { useEffect } from 'react';
import { recordInputActivity } from '../utils/recentInputActivity';

function isTrackableInput(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) {
    return false;
  }

  if (target instanceof HTMLTextAreaElement) {
    return true;
  }

  if (target instanceof HTMLInputElement) {
    const type = target.type.toLowerCase();
    return !['button', 'submit', 'reset', 'file', 'hidden', 'image'].includes(type);
  }

  return target.isContentEditable;
}

export function useInputActivityListener(): void {
  useEffect(() => {
    const handleInput = (event: Event) => {
      if (isTrackableInput(event.target)) {
        recordInputActivity();
      }
    };

    document.addEventListener('input', handleInput, true);
    return () => document.removeEventListener('input', handleInput, true);
  }, []);
}
