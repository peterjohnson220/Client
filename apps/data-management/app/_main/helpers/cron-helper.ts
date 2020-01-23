const daysOfWeek: Array<{text: string, value: string}> = [
  { text: 'Sunday', value: '0' },
  { text: 'Monday', value: '1' },
  { text: 'Tuesday', value: '2' },
  { text: 'Wednesday', value: '3' },
  { text: 'Thursday', value: '4' },
  { text: 'Friday', value: '5' },
  { text: 'Saturday', value: '6' }
];

const weeksOfMonth: Array<{text: string, value: string}> = [
  { text: '1st', value: '1' },
  { text: '2nd', value: '2' },
  { text: '3rd', value: '3' },
  { text: '4th', value: '4' }
];

const dailyCronExpression = /^.+\* \* \*$/;
const weeklyCronExpression = /^.+\* \* [0123456]$/;
const monthlyCronExpression = /^.+ \* \* [0123456]#[1234]$/;

export function getWeeklyShortSummaryFromExpression(expression: string): string {
  const cronArray = expression.split(' ');
  if (!cronArray || cronArray.length !== 5) {
    return '';
  }
  return `${daysOfWeek.find(d => d.value === cronArray[4]).text}`;
}

export function getMonthlyShortSummaryFromExpression(expression: string): string {
  const cronArray = expression.split(' ');
  if (!cronArray || cronArray.length !== 5) {
    return '';
  }
  const x = cronArray[4].split('#');
  if (!x || x.length !== 2) {
    return '';
  }
  return `${weeksOfMonth.find(d => d.value === x[1]).text}
            ${daysOfWeek.find(d => d.value === x[0]).text}`;
}

export {
  daysOfWeek,
  weeksOfMonth,
  dailyCronExpression,
  weeklyCronExpression,
  monthlyCronExpression
};


