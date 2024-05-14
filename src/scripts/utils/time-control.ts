/**
 * Converts a timestamp to a display time with given format.
 *
 * @param timeStamp - the timestamp to convert (always a string).
 * @returns the formatted time string.
 */
export const timeFormat = (timeStamp: string): string => {
  // Ensure timeStamp is a string and convert to number
  const timeFormatValue = new Date(Number(timeStamp));

  if (isNaN(timeFormatValue.getTime())) {
    return 'Invalid Date';
  }

  // Get hours, minutes, year, month, and date values from time format value
  let hours = timeFormatValue.getHours();
  const minutes = timeFormatValue.getMinutes().toString().padStart(2, '0');
  const year = timeFormatValue.getFullYear();
  const month = (timeFormatValue.getMonth() + 1).toString().padStart(2, '0');
  const date = timeFormatValue.getDate().toString().padStart(2, '0');

  // Determine period of day from time format value
  const periodOfDay = hours >= 12 ? 'PM' : 'AM';
  if (hours > 12) hours -= 12;
  if (hours === 0) hours = 12; // Convert 0 hours to 12 for 12 AM

  // Get time display format value
  const timeDisplay = `${hours}:${minutes} ${periodOfDay}, ${date}/${month}/${year}`;
  return timeDisplay;
};

/**
 * Get the hours value from a timestamp string.
 *
 * @param timeStamp - the timestamp (always a string).
 * @returns the hours value.
 */
export const getHours = (timeStamp: string): string => {
  // Get hours value from time format value
  const hoursDisplay = timeFormat(timeStamp).split(',')[0];
  return hoursDisplay;
};
