let modeSelected = "todaysTasksAction";

// --------------------------------------------
// Event Listeners that power the tasks page
// --------------------------------------------
document.getElementById("addNewTaskItem").addEventListener("click", (event) => {
  const newTaskId = generateRandomString(10);
  const firstDetailItemId = generateRandomString(10);
  const newTaskItemHTML = tmpl("newTaskItemTemplate", { id: newTaskId, itemId: firstDetailItemId });
  document.getElementById("taskListSource").insertAdjacentHTML("beforeend", newTaskItemHTML);

  // Task Deletion
  document.getElementById("delete_" + newTaskId).addEventListener("click", (event) => {
    document.getElementById("task_" + newTaskId).remove();
    refreshTaskListOutput();
  });

  // Detail Item Deletion
  document
    .getElementById("delete_detailItem_" + newTaskId + "_" + firstDetailItemId)
    .addEventListener("click", (event) => {
      document.getElementById("detailItem_" + newTaskId + "_" + firstDetailItemId).remove();
      refreshTaskListOutput();
    });

  // Task Status Select control text color
  document.getElementById("taskStatusValue_" + newTaskId).addEventListener("change", function () {
    this.classList.toggle("text-gray-400", !this.value);
    this.classList.toggle("text-gray-900", this.value);
    refreshTaskListOutput();
  });

  // Add a new Detail Item
  document.getElementById("newDetail_" + newTaskId).addEventListener("click", (event) => {
    const nextDetailItemId = generateRandomString(10);
    const newDetailItemHTML = tmpl("newDetailItemTemplate", { id: newTaskId, itemId: nextDetailItemId });
    document.getElementById("details_" + newTaskId).insertAdjacentHTML("beforeend", newDetailItemHTML);

    // The new Detail Item's Deletion event
    document
      .getElementById("delete_detailItem_" + newTaskId + "_" + nextDetailItemId)
      .addEventListener("click", (event) => {
        document.getElementById("detailItem_" + newTaskId + "_" + nextDetailItemId).remove();
        refreshTaskListOutput();
      });

    refreshTaskListOutput();
  });

  if (modeSelected === "todaysTasksAction") {
    hideEndOfDayElements();
  } else {
    showEndOfDayElements();
  }

  refreshTaskListOutput();
});

// Copy to Clipboard (Will look for a better way to perform this, without using the "execCommand".)
document.getElementById("copyToClipboard").addEventListener("click", (event) => {
  highlight("taskListOutput");
  document.execCommand("copy");
  showAndFadeSpan("copiedToClipboard");
});

// Refresh the Task Output DIV when anything is entered in the Tasks section.
document.addEventListener("input", function (event) {
  if (event.target.matches("input")) {
    refreshTaskListOutput();
  }
});

// Today's Task Mode button
document.getElementById("todaysTasksAction").addEventListener("click", (event) => {
  modeSelected = "todaysTasksAction";
  toggleMode("todaysTasksAction", "endOfDayUpdateAction");
  hideEndOfDayElements();
});

// End of Day Mode button
document.getElementById("endOfDayUpdateAction").addEventListener("click", (event) => {
  modeSelected = "endOfDayUpdateAction";
  toggleMode("endOfDayUpdateAction", "todaysTasksAction");
  showEndOfDayElements();
});

// --------------------------------------------
// Yes, this is John Resig's "Micro-Templating"
// logic from 2008. It has served me well since
// discovering it, and it works well for Kronos
// Tasks simple logic.
// --------------------------------------------
(function () {
  var cache = {};

  this.tmpl = function tmpl(str, data) {
    // Figure out if we're getting a template, or if we need to
    // load the template - and be sure to cache the result.
    var fn = !/\W/.test(str)
      ? (cache[str] = cache[str] || tmpl(document.getElementById(str).innerHTML))
      : new Function(
          "obj",
          "var p=[],print=function(){p.push.apply(p,arguments);};" +
            // Introduce the data as local variables using with(){}
            "with(obj){p.push('" +
            // Convert the template into pure JavaScript
            str
              .replace(/[\r\t\n]/g, " ")
              .split("<%")
              .join("\t")
              .replace(/((^|%>)[^\t]*)'/g, "$1\r")
              .replace(/\t=(.*?)%>/g, "',$1,'")
              .split("\t")
              .join("');")
              .split("%>")
              .join("p.push('")
              .split("\r")
              .join("\\'") +
            "');}return p.join('');"
        );

    // Provide some basic currying to the user
    return data ? fn(data) : fn;
  };
})();

// --------------------------------------------
// General (self-explanatory) functions
// --------------------------------------------
const refreshTaskListOutput = () => {
  const taskListSource = document.getElementById("taskListSource");
  let formattedHTML = "";
  if (modeSelected === "todaysTasksAction") {
    formattedHTML = formatTodaysTasksToHTML(taskListSource);
  } else {
    formattedHTML = formatEndOfDaysUpdateToHTML(taskListSource);
  }
  document.getElementById("taskListOutput").innerHTML = formattedHTML;
};

const hideEndOfDayElements = () => {
  const endOfDayElements = document.getElementsByClassName("end-of-day-element");
  Array.from(endOfDayElements).forEach((element) => {
    element.classList.add("hidden");
  });
  refreshTaskListOutput();
};

const showEndOfDayElements = () => {
  const endOfDayElements = document.getElementsByClassName("end-of-day-element");
  Array.from(endOfDayElements).forEach((element) => {
    element.classList.remove("hidden");
  });
  refreshTaskListOutput();
};

const generateRandomString = (length, options = {}) => {
  // Default options
  const config = {
    numbers: true,
    lowercase: true,
    uppercase: true,
    special: false,
    ...options,
  };

  // Character sets
  const chars = {
    numbers: "0123456789",
    lowercase: "abcdefghijklmnopqrstuvwxyz",
    uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
    special: "!@#$%^&*()_+-=[]{}|;:,.<>?",
  };

  // Build character pool based on options
  let charPool = "";
  if (config.numbers) charPool += chars.numbers;
  if (config.lowercase) charPool += chars.lowercase;
  if (config.uppercase) charPool += chars.uppercase;
  if (config.special) charPool += chars.special;

  if (charPool === "") {
    throw new Error("At least one character type must be selected");
  }

  // Generate random string
  let result = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charPool.length);
    result += charPool[randomIndex];
  }

  return result;
};

const highlight = (id) => {
  if (document.selection) {
    var range = document.body.createTextRange();
    range.moveToElementText(document.getElementById(id));
    range.select();
  } else if (window.getSelection) {
    var range = document.createRange();
    range.selectNode(document.getElementById(id));
    window.getSelection().removeAllRanges();
    window.getSelection().addRange(range);
  }
};

const showAndFadeSpan = (element) => {
  const span = document.getElementById(element);

  // Reset any existing state
  span.classList.remove("opacity-100");
  span.classList.add("opacity-0");

  // Force a reflow
  void span.offsetWidth;

  // Make visible
  span.classList.remove("opacity-0");
  span.classList.add("opacity-100");

  // Start fade out after 2 seconds
  setTimeout(() => {
    span.classList.remove("opacity-100");
    span.classList.add("opacity-0");
  }, 2000);
};

const toggleMode = (activeId, inactiveId) => {
  const activeElement = document.getElementById(activeId);
  const inactiveElement = document.getElementById(inactiveId);

  activeElement.classList.remove("inactive-mode");
  activeElement.classList.add("active-mode");

  inactiveElement.classList.remove("active-mode");
  inactiveElement.classList.add("inactive-mode");
};

const formatTodaysTasksToHTML = (taskListSource) => {
  // Get all task divs
  const taskDivs = taskListSource.getElementsByClassName("relative -space-y-px mb-4");
  let htmlOutput = "";

  // Process each task div
  Array.from(taskDivs).forEach((taskDiv) => {
    const taskId = taskDiv.id.split("_")[1];

    // Get task name input
    const taskName = taskDiv.querySelector(`#taskNameValue_${taskId}`).value || "Untitled Task";

    // Get all detail items for this task
    const detailsDiv = taskDiv.querySelector(`#details_${taskId}`);
    const detailItems = detailsDiv
      ? Array.from(detailsDiv.getElementsByTagName("input"))
          .map((input) => input.value)
          .filter(Boolean)
      : [];

    // Get estimation and dependencies
    const timeEstimate = taskDiv.querySelector(`#estimationValue_${taskId}`).value || "Not Specified";
    const dependencies = taskDiv.querySelector(`#dependenciesValue_${taskId}`).value || "None";

    // Generate the HTML
    htmlOutput += `
      <ul style="list-style-type: disc; list-style-position: inside; font-size: 14px; margin-bottom: 20px;">
        <li style="padding: 2px 0;"><strong>Task</strong>: ${taskName}</li>
        <ul style="padding-left: 20px; list-style-type: circle; list-style-position: inside;">
          <li style="padding: 2px 0;"><strong>Details</strong>
            ${
              detailItems.length > 0
                ? `
            <ul style="padding-left: 20px; list-style-type: disc; list-style-position: inside;">
              ${detailItems.map((detail) => `<li style="padding: 2px 0;">${detail}</li>`).join("")}
            </ul>`
                : " None"
            }
          </li>
          <li style="padding: 2px 0;"><strong>Estimated Time to Complete</strong>: ${timeEstimate}</li>
          <li style="padding: 2px 0;"><strong>Dependencies</strong>: ${dependencies}</li>
        </ul>
      </ul>`;
  });

  return htmlOutput;
};

const formatEndOfDaysUpdateToHTML = (taskListSource) => {
  // Get all task divs
  const taskDivs = taskListSource.getElementsByClassName("relative -space-y-px mb-4");

  // Create an object to group tasks by status
  const tasksByStatus = {
    "Not Specified": [],
    Completed: [],
    "In Progress": [],
    Rescheduled: [],
  };

  // Process each task div and group by status
  Array.from(taskDivs).forEach((taskDiv) => {
    const taskId = taskDiv.id.split("_")[1];
    const taskStatus = taskDiv.querySelector(`#taskStatusValue_${taskId}`).value || "Not Specified";

    // Get task name input
    const taskName = taskDiv.querySelector(`#taskNameValue_${taskId}`).value || "Untitled Task";

    // Get all detail items for this task
    const detailsDiv = taskDiv.querySelector(`#details_${taskId}`);
    const detailItems = detailsDiv
      ? Array.from(detailsDiv.getElementsByTagName("input"))
          .map((input) => input.value)
          .filter(Boolean)
      : [];

    // Get all the task information
    const timeEstimate = taskDiv.querySelector(`#estimationValue_${taskId}`).value || "Not Specified";
    const dependencies = taskDiv.querySelector(`#dependenciesValue_${taskId}`).value || "None";
    const timeSpent = taskDiv.querySelector(`#timeSpentValue_${taskId}`).value || "Not Specified";
    const challenges = taskDiv.querySelector(`#challengesValue_${taskId}`).value || "None";

    // Create the task HTML
    const taskHTML = `
      <ul style="list-style-type: disc; list-style-position: inside; font-size: 16px; margin-bottom: 30px;">
        <li style="padding: 2px 0;"><strong>Task</strong>: ${taskName}</li>
        <ul style="padding-left: 20px; list-style-type: circle; list-style-position: inside;">
          <li style="padding: 2px 0;"><strong>Details</strong>
            ${
              detailItems.length > 0
                ? `
            <ul style="padding-left: 20px; list-style-type: disc; list-style-position: inside;">
              ${detailItems.map((detail) => `<li style="padding: 2px 0;">${detail}</li>`).join("")}
            </ul>`
                : " None"
            }
          </li>
          <li style="padding: 2px 0;"><strong>Estimated Time to Complete</strong>: ${timeEstimate}</li>
          <li style="padding: 2px 0;"><strong>Time Spent Today</strong>: ${timeSpent}</li>
          <li style="padding: 2px 0;"><strong>Dependencies</strong>: ${dependencies}</li>
          <li style="padding: 2px 0;"><strong>Challenges</strong>: ${challenges}</li>
        </ul>
      </ul>`;

    // Add to appropriate status group
    if (tasksByStatus.hasOwnProperty(taskStatus)) {
      tasksByStatus[taskStatus].push(taskHTML);
    }
  });

  // Generate final HTML with headers for each status
  let htmlOutput = "";

  Object.entries(tasksByStatus).forEach(([status, tasks]) => {
    if (tasks.length > 0) {
      // Add header for this status group
      htmlOutput += `
        <div style="margin-bottom: 16px; padding: 2px 10px 4px 10px; border-bottom: 1px solid;">
          <h2 style="margin-bottom: 6px; font-size: 18px; color: #333;">${status} Tasks</h2>
        </div>
        ${tasks.join("")}`;
    }
  });

  return htmlOutput;
};
