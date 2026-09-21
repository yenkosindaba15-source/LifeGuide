import {
  DailyDevotional,
  dailyDevotionals,
  dailyHomeContent,
  HomeDailyContent,
} from "./dailyContent";

function getDayOfYear(): number {
  const today = new Date();

  const startOfYear = new Date(today.getFullYear(), 0, 0);

  const difference =
    today.getTime() - startOfYear.getTime();

  const oneDay = 1000 * 60 * 60 * 24;

  return Math.floor(difference / oneDay);
}

export function getDailyHomeContent(): HomeDailyContent {
  const dayOfYear = getDayOfYear();

  const index =
    (dayOfYear - 1) % dailyHomeContent.length;

  return dailyHomeContent[index];
}

export function getDailyDevotional(): DailyDevotional {
  const dayOfYear = getDayOfYear();

  const index =
    (dayOfYear - 1) % dailyDevotionals.length;

  return dailyDevotionals[index];
}