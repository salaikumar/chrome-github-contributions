chrome.extension.sendMessage({}, function(response) {
  $(document).ready(function() {
    var largest = largestStreak();
    var commits = totalCommits();

    $("#contributions-calendar").append("<div class='contrib-column contrib-column-first table-column'><span class='text-muted'>Contributions in the last year</span><span class='contrib-number'>"+ new Intl.NumberFormat().format(commits) + " total</span><span class=text-muted>" + contribDateFormat(largest.epoch) + " - " + contribDateFormat(largest.end) + "</span></div>");
    $("#contributions-calendar").append("<div class='contrib-column table-column'><span class='text-muted'>Longest streak</span><span class='contrib-number'>" + largest.streak + " days</span><span class='text-muted'>" + streakDateFormat(largest.lStart) + " to " + streakDateFormat(largest.lEnd) + "</span></div>");
    $("#contributions-calendar").append("<div class='contrib-column table-column'><span class='text-muted'>Current Streak</span><span class='contrib-number'>" + largest.current + " days</span><span class='text-muted'>Last Contributed on " + currentStreakDateFormat(largest.end) + "</span></div>");
  });
});

function streakDateFormat(date) {
  return moment.utc(date, "YYYY-MM-DD").format("MMMM D");
}

function contribDateFormat(date) {
  return moment.utc(date, "YYYY-MM-DD").format("MMM D, YYYY");
}

function currentStreakDateFormat(date) {
  return moment.utc(date).format("MMMM D");
}


function largestStreak() {
  var largestStreak = 0;
  var largestStartDate = "";
  var largestEndDate = "";
  var start = "";
  var end = "";


  var currentStreak = 0;
  var startDate = "";
  var prevDate = "";
  var endDate = "";
  $.each($("rect.day[data-date]"), function(idx, elem) {
    var date = $(elem).attr("data-date");
    var count = parseInt($(elem).attr("data-count"));
    if (idx == 0) {
      start = date;
    }

    if (startDate == "") {
      startDate = date;
    }

    if (count > 0) {
      prevDate = date;

      currentStreak+=1;
    } else {
      endDate = prevDate;
      if (currentStreak > largestStreak) {
        largestStreak = currentStreak;
        largestStartDate = startDate;
        largestEndDate = endDate;
      }
      startDate = ""
      endDate = ""
      currentStreak = 0;
    }
  });

  endDate = prevDate;
  if (currentStreak > largestStreak) {
    largestStreak = currentStreak;
    largestStartDate = startDate;
    largestEndDate = endDate;
  }
  
  return {
    streak: largestStreak,
    epoch: start,
    lStart: largestStartDate,
    lEnd: largestEndDate,
    current: currentStreak,
    end: endDate
  };
}


function totalCommits() {
  $.each($(".js-calendar-graph-svg g rect"), function(idx, elem) {
    var date = jQuery(elem).attr("data-date");
    var count = jQuery(elem).attr("data-count");
  });

  var totalContributions = 0;
  $.each($(".js-calendar-graph-svg g rect"), function(idx, elem) {
    var count = parseInt(jQuery(elem).attr("data-count"));
    totalContributions += count;
  });
  return totalContributions;
}
