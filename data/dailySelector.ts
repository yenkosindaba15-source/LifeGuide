import {
  DailyContent,
  dailyContent,
  DailyDevotional,
  HomeDailyContent,
} from "./dailyContent";

// LifeGuide's official daily-content start date.
// JavaScript months are zero-based:
// 6 = July.
export const DAILY_CONTENT_START_DATE =
  new Date(2026, 6, 1);

const ONE_DAY =
  1000 * 60 * 60 * 24;

const normalizeDate = (
  date: Date
): Date => {
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate()
  );
};

export function getDaysSinceStart(
  date: Date = new Date()
): number {
  const normalizedDate =
    normalizeDate(date);

  const normalizedStart =
    normalizeDate(
      DAILY_CONTENT_START_DATE
    );

  const difference =
    normalizedDate.getTime() -
    normalizedStart.getTime();

  return Math.floor(
    difference / ONE_DAY
  );
}

export function isWithinDailyHistory(
  date: Date
): boolean {
  const normalizedDate =
    normalizeDate(date);

  const normalizedStart =
    normalizeDate(
      DAILY_CONTENT_START_DATE
    );

  return (
    normalizedDate.getTime() >=
    normalizedStart.getTime()
  );
}

export function getDailyContentForDate(
  date: Date = new Date()
): DailyContent {
  const daysSinceStart =
    getDaysSinceStart(date);

  const safeDay =
    Math.max(
      0,
      daysSinceStart
    );

  const index =
    safeDay %
    dailyContent.length;

  return dailyContent[index];
}

export function getDailyContent():
  DailyContent {
  return getDailyContentForDate(
    new Date()
  );
}

export function getDailyHomeContent():
  HomeDailyContent {
  return getDailyContent().home;
}

export function getDailyHomeContentForDate(
  date: Date
): HomeDailyContent {
  return getDailyContentForDate(
    date
  ).home;
}

export function getDailyDevotional():
  DailyDevotional {
  return getDailyContent()
    .devotional;
}

export function getDailyDevotionalForDate(
  date: Date
): DailyDevotional {
  return getDailyContentForDate(
    date
  ).devotional;
}

export function getDailyContentIndexForDate(
  date: Date
): number {
  const daysSinceStart =
    getDaysSinceStart(date);

  const safeDay =
    Math.max(
      0,
      daysSinceStart
    );

  return (
    safeDay %
    dailyContent.length
  );
}