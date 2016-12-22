function createFilter(startDate, endDate, extraFilterText)
{
  var filter = (getDefaultFilter() + " after:" + getDateString(startDate));
  filter += (" before:" + getDateString(addDays(endDate, 1)));
  if (extraFilterText != null && extraFilterText.length > 0)
  {
    filter += (" " + replaceLineBreaks(extraFilterText, " "));
  }
  return filter;
}

function getDefaultFilter()
{
  return 'is:unread to:me -from:me'
  + ' -in:trash -in:spam -is:chat'
  + ' -from:noreply -from:no-reply -from:donotreply -from:news -from:newsletter -from:newsletters -from:forum -from:forums -from:campaign -from:campaigns'
  + ' -category:promotions -category:forums -category:social';
}