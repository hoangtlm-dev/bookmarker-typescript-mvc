export const sortArray = <T>(arr: T[], key: keyof T, order: 'asc' | 'desc') => {
  const sortedArray = [...arr];

  sortedArray.sort((a: T, b: T) => {
    const aValue = a[key];
    const bValue = b[key];

    if (aValue === undefined || bValue === undefined || typeof aValue === 'object' || typeof bValue === 'object') {
      return 0;
    }

    const positiveComparison = aValue > bValue ? 1 : 0;
    const comparison = aValue < bValue ? -1 : positiveComparison;

    return order === 'asc' ? comparison : -comparison;
  });

  return sortedArray;
};
