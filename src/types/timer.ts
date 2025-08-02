export interface TimerSession {
  id: string;
  activity: string;
  startTime: number;
  endTime: number;
  duration: number;
  pausedTime: number;
  date: string;
}

export interface TimerState {
  isRunning: boolean;
  startTime: number | null;
  elapsedTime: number;
  totalPausedTime: number;
}