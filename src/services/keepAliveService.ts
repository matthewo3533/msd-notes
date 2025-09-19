/**
 * Keep Alive Service
 * Prevents Render free tier timeout by sending periodic requests
 * Random intervals between 5-15 minutes
 */

class KeepAliveService {
  private intervalId: NodeJS.Timeout | null = null;
  private isActive = false;
  private readonly minInterval = 5 * 60 * 1000; // 5 minutes in milliseconds
  private readonly maxInterval = 15 * 60 * 1000; // 15 minutes in milliseconds

  /**
   * Start the keep-alive service
   */
  start(): void {
    if (this.isActive) {
      console.log('Keep-alive service already running');
      return;
    }

    this.isActive = true;
    console.log('Starting keep-alive service...');
    
    // Schedule the first ping
    this.scheduleNextPing();
  }

  /**
   * Stop the keep-alive service
   */
  stop(): void {
    if (!this.isActive) {
      return;
    }

    this.isActive = false;
    
    if (this.intervalId) {
      clearTimeout(this.intervalId);
      this.intervalId = null;
    }
    
    console.log('Keep-alive service stopped');
  }

  /**
   * Schedule the next ping with a random interval
   */
  private scheduleNextPing(): void {
    if (!this.isActive) {
      return;
    }

    // Generate random interval between min and max
    const randomInterval = Math.random() * (this.maxInterval - this.minInterval) + this.minInterval;
    
    console.log(`Next keep-alive ping scheduled in ${Math.round(randomInterval / 1000 / 60)} minutes`);
    
    this.intervalId = setTimeout(() => {
      this.sendPing();
    }, randomInterval);
  }

  /**
   * Send a ping request to keep the server alive
   */
  private async sendPing(): Promise<void> {
    if (!this.isActive) {
      return;
    }

    try {
      // Use a simple HEAD request to minimize bandwidth
      const response = await fetch(window.location.origin, {
        method: 'HEAD',
        cache: 'no-cache',
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });

      if (response.ok) {
        console.log('Keep-alive ping successful');
      } else {
        console.warn('Keep-alive ping failed:', response.status);
      }
    } catch (error) {
      console.error('Keep-alive ping error:', error);
    }

    // Schedule the next ping regardless of success/failure
    this.scheduleNextPing();
  }

  /**
   * Check if the service is currently active
   */
  isRunning(): boolean {
    return this.isActive;
  }

  /**
   * Get the current status of the service
   */
  getStatus(): { isActive: boolean; nextPingIn?: number } {
    return {
      isActive: this.isActive,
      nextPingIn: this.intervalId ? undefined : undefined // Could calculate remaining time if needed
    };
  }
}

// Create a singleton instance
export const keepAliveService = new KeepAliveService();

// Auto-start when the module is imported (only in browser environment)
if (typeof window !== 'undefined') {
  // Start the service when the page loads
  window.addEventListener('load', () => {
    keepAliveService.start();
  });

  // Stop the service when the page is about to unload
  window.addEventListener('beforeunload', () => {
    keepAliveService.stop();
  });

  // Pause/resume based on page visibility
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      console.log('Page hidden - keep-alive continues in background');
    } else {
      console.log('Page visible - keep-alive active');
    }
  });
}

export default keepAliveService;
