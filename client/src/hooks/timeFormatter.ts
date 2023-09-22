function timeFormatter(dateString: any): string {
  const now = new Date(new Date().getTime() - 9 * 60 * 60 * 1000); // 9시간 빼기/utc-한국차이
  const inputDate = new Date(dateString);

  const seconds = Math.floor((now.getTime() - inputDate.getTime()) / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (years > 1) return `${years} years ago`;
  if (years === 1) return "1 year ago";

  if (months > 1) return `${months} months ago`;
  if (months === 1) return "1 month ago";

  if (days > 1) return `${days} days ago`;
  if (days === 1) return "1 day ago";

  if (hours > 1) return `${hours} hours ago`;
  if (hours === 1) return "1 hour ago";

  if (minutes > 1) return `${minutes} minutes ago`;

  return "1 minute ago";
}
export default timeFormatter;
