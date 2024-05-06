document.addEventListener("DOMContentLoaded", function () {
  calendar(pendentes);
});

function calendar(tasks){
  var calendarEl = document.getElementById("calendar");
  var calendar = new FullCalendar.Calendar(calendarEl, {
    schedulerLicenseKey: "CC-Attribution-NonCommercial-NoDerivatives",
    locale: "pt-br",
    themeSystem: "bootstrap5",
    aspectRatio: 2,
    headerToolbar: {
      left: "prevYear,prev,next,nextYear today",
      center: "title",
      right: "resourceTimeGridDay,resourceTimeGridWeek,dayGridMonth",
    },
    events: tasks.map((element) => ({
      title: element.title,
      start: element.due,
      end: element.due,
      color: element.status === "Concluida" ? "#00BF63" : "#94A1B2",
    })),
    eventColor: "",
    initialView: "dayGridMonth",
    navLinks: true,
    weekNumbers: true,
    selectable: true,
    nowIndicator: true,
  });
  calendar.render();
}