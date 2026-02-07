export  function timeAgo(dateString) {
  if (!dateString) return "Just now";
  const now = new Date();
  const past = new Date(dateString );
//   if (isNaN(past.getTime())) return "Just now";
  const diffMs = now - past ;
  const seconds = Math.floor(diffMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  if (seconds < 60) return "Just now";
  if (minutes < 60) return `${minutes} minute${minutes !== 1 ? "s" : ""} ago`;
  if (hours < 24) return `${hours} hour${hours !== 1 ? "s" : ""} ago`;
  if (days < 7) return `${days} day${days !== 1 ? "s" : ""} ago`;

  return past.toLocaleDateString();
}

export  function formatDateTime(dateTimeString) {
  if (!dateTimeString) {
    return { date: "", time: "" };
  }

  const dateObj = new Date(dateTimeString);

  return {
    date: dateObj.toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric"
    }),
    time: dateObj.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit"
    })
  };
}

