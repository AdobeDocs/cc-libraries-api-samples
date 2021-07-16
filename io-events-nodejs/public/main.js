$(function() {
  const socket = io();

  const events = ["create", "update", "delete"];

  const WEBHOOK_TYPE_MAP = {
    "com.adobe.platform.events.cc_library_created": "create",
    "com.adobe.platform.events.cc_library_updated": "update",
    "com.adobe.platform.events.cc_library_deleted": "delete"
  };
  const TAG_MAP = {
    create: "is-success",
    update: "is-info",
    delete: "is-danger"
  };

  for (let name of events) {
    clickHandler(name);
    socketHandler(name);
  }

  socket.on("webhook", res => {
    log(res, WEBHOOK_TYPE_MAP[res?.type], "webhook");
  });

  socket.on("error", (err, type) => {
    log(err, "error", type);

    for (let name of events) {
      $("#" + name).removeClass("is-loading");
    }
  });

  function clickHandler(name) {
    const el = $("#" + name);

    el.click(() => {
      el.addClass("is-loading");

      clearLogs();

      socket.emit(name + "-event");
    });
  }

  function socketHandler(name) {
    socket.on(name + "-event", res => {
      $("#" + name).removeClass("is-loading");

      log(res, name, "api");
    });
  }

  function log(res, event, type) {
    const content = res.data ? JSON.stringify(res.data, null, 2) : res.body;
    const status = res.status && res.statusText ? `${res.status} - ${res.statusText}, ` : "";

    const template = $($("#resTemplate").text()
                      .replace("${res}", status + content)
                      .replace("${tag}", event.toUpperCase())
                      .trim());

    template.find("#tag").addClass(event === "error" ? "is-danger" : "is-light " + TAG_MAP[event]);

    $(type === "api" ? "#api-list" : "#webhook-list").prepend(template);
  }

  function clearLogs() {
    $("#api-list").empty();
    $("#webhook-list").empty();
  }
});
