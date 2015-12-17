var convertMonthIndexToStr = function(monthIndex) {
  var map = [
    'January', 'February', 'March', 'April',
    'May', 'June', 'July', 'August',
    'September', 'October', 'November', 'December'
  ];
  return map[monthIndex];
}

var convertDayOfWeekIndexToStr = function(dayOfWeekIndex) {
  var map = [
    'Sunday', 'Monday', 'Tuesday', 'Wednesday',
    'Thursday', 'Friday', 'Saturday'
  ];
  return map[dayOfWeekIndex];
}

Date.prototype.getDateParts = function() {
  return {
    year: this.getUTCFullYear(),
    month: this.getUTCMonth() + 1,
    monthStr: convertMonthIndexToStr(this.getUTCMonth()),
    dayOfMonth: this.getUTCDate(),
    dayOfWeek: this.getUTCDay() + 1,
    dayOfWeekStr: convertDayOfWeekIndexToStr(this.getUTCDay()),
    hours: this.getUTCHours(),
    minutes: this.getUTCMinutes(),
    seconds: this.getUTCSeconds(),
    milliseconds: this.getUTCMilliseconds()
  };
}
