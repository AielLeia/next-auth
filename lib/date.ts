import { TIME_ZONE } from '@/config';
import { DateTime } from 'luxon';

/**
 * Returns the current time adjusted by one hour.
 *
 * @returns {Date} The current time adjusted by one hour.
 */
export const getCurrentTimeWithOneHour = (): Date => {
  return DateTime.fromJSDate(getCurrentDateWithDst())
    .plus({ hour: 1 })
    .toJSDate();
};

/**
 * Returns the current date and time adjusted for daylight saving time (DST) in the Europe/Paris timezone.
 *
 * @returns {Date} The current date and time with DST adjustment.
 */
export const getCurrentDateWithDst = (): Date => {
  const currentDate = DateTime.now().setZone(TIME_ZONE);
  if (currentDate.isInDST) {
    return currentDate.plus({ hour: 2 }).toJSDate();
  }

  return currentDate.plus({ hour: 1 }).toJSDate();
};
