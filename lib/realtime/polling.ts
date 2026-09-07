export interface RealtimeMessageEvent {
  conversationId: string;
  senderType: 'VISITOR' | 'AI' | 'CS' | 'SYSTEM';
  content: string;
  senderName: string;
  isInternalNote: boolean;
  createdAt: string;
}

export interface RealtimeSubscriptionOptions {
  conversationId?: string;
  onNewMessage?: (msg: RealtimeMessageEvent) => void;
  onQueueUpdate?: () => void;
  intervalMs?: number;
}

export class RealtimePollingService {
  private timer: NodeJS.Timeout | null = null;
  private intervalMs: number;

  constructor(intervalMs: number = 3000) {
    this.intervalMs = intervalMs;
  }

  startPolling(options: RealtimeSubscriptionOptions) {
    this.stopPolling();
    this.timer = setInterval(async () => {
      try {
        if (options.onQueueUpdate) {
          options.onQueueUpdate();
        }
      } catch (err) {
        console.error('Polling error:', err);
      }
    }, this.intervalMs);
  }

  stopPolling() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }
}
