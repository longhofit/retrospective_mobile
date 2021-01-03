export const cardNumberFormatter = (value: string): string => {
  return value
    .replace(/\s?/g, '')
    .replace(/(\d{4})/g, '$1 ')
    .trim();
};

export const ddMMyyyyFormatterV3 = (value: string) => {
  if (value) {
    const date: string = value.split(' ')[0];
    const time: string = value.split(' ')[1];
    const year = date.split('-')[0];
    const month = date.split('-')[1];
    const day = date.split('-')[2];
    return `${day}/${month}/${year} ${time}`;
  }

  return '';
};

export const ddMMyyyyhhMMssFormatter = (dateParam: Date): string => {
  if (dateParam) {
    const fullYear: string | number = dateParam.getFullYear();
    let month: string | number = dateParam.getMonth() + 1;
    let date: string | number = dateParam.getDate();
    let hours: string | number = dateParam.getHours();
    let minutes: string | number = dateParam.getMinutes();
    let seconds: string | number = dateParam.getSeconds();

    if (month < 10) {
      month = '0' + month;
    }

    if (date < 10) {
      date = '0' + date;
    }

    if (hours < 10) {
      hours = '0' + hours;
    }

    if (minutes < 10) {
      minutes = '0' + minutes;
    }

    if (seconds < 10) {
      seconds = '0' + seconds;
    }

    return `${date}/${month}/${fullYear} ${hours}:${minutes}:${seconds}`;
  }

  return '';
};