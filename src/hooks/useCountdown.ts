import { useEffect, useState } from 'react';

export interface TimeLeft {
  days: string;
  hours: string;
  minutes: string;
  seconds: string;
}

const ZERO: TimeLeft = { days: '00', hours: '00', minutes: '00', seconds: '00' };

const pad = (n: number): string => (n < 10 ? `0${n}` : `${n}`);

/**
 * Resolves countdown target into a valid future timestamp in milliseconds.
 * If the target date is in the past, it rolls the year forward to the next future occurrence
 * so the countdown always ticks down to the upcoming event.
 */
export const resolveTarget = (target: Date | string | number): number => {
  let date: Date;

  if (target instanceof Date) {
    date = new Date(target.getTime());
  } else if (typeof target === 'number') {
    date = new Date(target);
  } else {
    date = new Date(target);
    if (isNaN(date.getTime())) {
      date = new Date(String(target).replace(/-/g, '/'));
    }
  }

  // Fallback if parsing completely fails
  if (isNaN(date.getTime())) {
    return Date.now() + 30 * 24 * 60 * 60 * 1000;
  }

  // If the target has already passed, roll forward to the next future occurrence of this date and time
  if (date.getTime() <= Date.now()) {
    const now = new Date();
    date.setFullYear(now.getFullYear());
    if (date.getTime() <= now.getTime()) {
      date.setFullYear(now.getFullYear() + 1);
    }
  }

  return date.getTime();
};

export const getTimeLeft = (targetMs: number): TimeLeft => {
  const diff = targetMs - Date.now();
  if (diff <= 0) return ZERO;

  const days = Math.floor(diff / (24 * 60 * 60 * 1000));
  const hours = Math.floor((diff % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
  const minutes = Math.floor((diff % (60 * 60 * 1000)) / (60 * 1000));
  const seconds = Math.floor((diff % (60 * 1000)) / 1000);

  return { days: pad(days), hours: pad(hours), minutes: pad(minutes), seconds: pad(seconds) };
};

/**
 * Counts down to a target date/time, updating every second.
 * @param countdownTarget - a Date, ISO date string, or epoch-ms timestamp
 */
export const useCountdown = (countdownTarget: Date | string | number): TimeLeft => {
  const [targetMs, setTargetMs] = useState<number>(() => resolveTarget(countdownTarget));

  useEffect(() => {
    setTargetMs(resolveTarget(countdownTarget));
  }, [countdownTarget]);

  const [timeLeft, setTimeLeft] = useState<TimeLeft>(() => getTimeLeft(targetMs));

  useEffect(() => {
    setTimeLeft(getTimeLeft(targetMs));

    const intervalId = setInterval(() => {
      const now = Date.now();
      if (targetMs - now <= 0) {
        // If target reached, resolve next occurrence or reset
        const next = resolveTarget(countdownTarget);
        if (next > now) {
          setTargetMs(next);
          setTimeLeft(getTimeLeft(next));
        } else {
          setTimeLeft(ZERO);
          clearInterval(intervalId);
        }
      } else {
        setTimeLeft(getTimeLeft(targetMs));
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, [targetMs, countdownTarget]);

  return timeLeft;
};