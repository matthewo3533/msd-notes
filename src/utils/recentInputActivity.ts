const RECENT_INPUT_WINDOW_MS = 5 * 60 * 1000;

let lastInputAt: number | null = null;

export function recordInputActivity(): void {
  lastInputAt = Date.now();
}

export function hasRecentInputActivity(): boolean {
  if (lastInputAt === null) {
    return false;
  }
  return Date.now() - lastInputAt < RECENT_INPUT_WINDOW_MS;
}

export function clearInputActivity(): void {
  lastInputAt = null;
}

export function confirmLeaveIfRecentInput(
  message = 'Starting a new application will clear your current note and you will lose your progress. Are you sure you want to continue?'
): boolean {
  if (!hasRecentInputActivity()) {
    return true;
  }

  const confirmed = window.confirm(message);
  if (confirmed) {
    clearInputActivity();
  }
  return confirmed;
}
