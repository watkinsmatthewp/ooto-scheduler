/* DATE METHODS */
function getDateString(date)
{
  return date.getFullYear() + "/" + (date.getMonth() + 1) + "/" + date.getDate();
}

function datesAreSameDay(date1, date2)
{
  if (date1.getFullYear() != date2.getFullYear())
  {
    return false;
  }
  if (date1.getMonth() != date2.getMonth())
  {
    return false;
  }
  if (date1.getDate() != date2.getDate())
  {
    return false;
  }
  
  return true;
}

function addDays(date, numberOfDays)
{
  var newDate = new Date(date);
  newDate.setDate(newDate.getDate() + numberOfDays);
  return newDate;
}

/* Logical methods */
function isTrue(object)
{
  return (object == true || object == "true" || object == "on");
}

/* String methods */
function replaceLineBreaks(text, newDelimiter)
{
  return text.replace(/(\r\n|\n|\r)/gm, newDelimiter);
}