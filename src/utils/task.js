import dayjs from "dayjs";
const DATE_FORMAT = "MMM D";
const TIME_FORMAT = "HH:mm";
const DATE_FORMAT_EDIT = "DD/MM/YY";

function humanizeEventDueDate(dueDate) {
  return dueDate ? dayjs(dueDate).format(DATE_FORMAT) : "";
}

function humanizeEventDueDateEdit(dueDate) {
  return dueDate
    ? dayjs(dueDate).format(`${DATE_FORMAT_EDIT} ${TIME_FORMAT}`)
    : "";
}
function humanizeEventTime(dueDate) {
  return dueDate ? dayjs(dueDate).format(TIME_FORMAT) : "";
}

function formatDuration(dateFrom, dateTo) {
  const from = dayjs(dateFrom);
  const to = dayjs(dateTo);

  const diffMs = to.diff(from);

  const totalMinutes = Math.floor(diffMs / (1000 * 60));
  const days = Math.floor(totalMinutes / (60 * 24));
  const hours = Math.floor((totalMinutes % (60 * 24)) / 60);
  const minutes = totalMinutes % 60;

  const d = days > 0 ? `${days}D ` : "";
  const h = `${String(hours).padStart(2, "0")}H`;
  const m = `${String(minutes).padStart(2, "0")}M`;

  return `${d}${h} ${m}`;
}

// Функции для проверки состояния задачи
function isPointFuture(point) {
  return (
    point.dateFrom && dayjs(point.dateFrom).isAfter(dayjs(), "day") // &&  !point.isArchive
  );
}

function isPointPresent(point) {
  return (
    point.dateFrom && dayjs(point.dateFrom).isSame(dayjs(), "day") // &&    !point.isArchive
  );
}

function isPointPast(point) {
  return (
    point.dateFrom && dayjs().isAfter(point.dateFrom, "day") //&& !point.isArchive
  );
}

function isPointEverything(point) {
  return true; // Все задачи, без фильтрации
}

export {
  humanizeEventDueDate,
  humanizeEventDueDateEdit,
  humanizeEventTime,
  formatDuration,
  isPointFuture,
  isPointPresent,
  isPointPast,
  isPointEverything,
};
