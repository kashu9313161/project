// DOM Elements
const taskInput = document.getElementById("taskInput");
const categoryInput = document.getElementById("categoryInput");
const timeInput = document.getElementById("timeInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");
const progressChartCanvas = document.getElementById("progressChart");

// Task array and Chart instance
let tasks = [];
let chart;

// Initialize empty chart
initializeChart();

// Add Task
addTaskBtn.addEventListener("click", addNewTask);

// Add New Task
function addNewTask() {
  const taskText = taskInput.value.trim();
  const category = categoryInput.value;
  const time = timeInput.value;


  if (taskText === "" || time === "") {
    alert("Please enter both task and time!");
    return;
  }

  const newTask = {
    id: Date.now(),
    task: taskText,
    category: category,
    time: new Date(time),
    completed: false,
  };

  tasks.push(newTask);
  taskInput.value = "";
  timeInput.value = "";
  categoryInput.value = "Educational";
  renderTasks();
  updateChart();
}

// Render Tasks
function renderTasks() {
  taskList.innerHTML = "";

  if (tasks.length === 0) {
    taskList.innerHTML = '<li class="placeholder">No goals added yet. Start by adding a new goal!</li>';
  } else {
    tasks.forEach((task) => {
      const formattedTime = task.time.toLocaleString(); // Format the time

      const li = document.createElement("li");
      li.className = task.completed ? "complete" : "";
      li.innerHTML = `
        <div>
          ${task.task} (${task.category}) <br>
          <small>Due: ${formattedTime}</small>
        </div>
        <div>
          <button onclick="toggleTask(${task.id})">Mark ${task.completed ? "Incomplete" : "Complete"}</button>
          <button class="edit-btn" onclick="editTask(${task.id})">Edit</button>
          <button onclick="deleteTask(${task.id})">Delete</button>
        </div>
      `;
      taskList.appendChild(li);
    });
  }
}

// Toggle Task Completion
function toggleTask(taskId) {
  const task = tasks.find((t) => t.id === taskId);
  task.completed = !task.completed;
  renderTasks();
  updateChart();
}

// Edit Task
function editTask(taskId) {
  const task = tasks.find((t) => t.id === taskId);
  taskInput.value = task.task;
  categoryInput.value = task.category;
  timeInput.value = task.time.toISOString().slice(0, 16); // Set the time in the correct format
  addTaskBtn.textContent = "Save Changes";

  addTaskBtn.removeEventListener("click", addNewTask);
  addTaskBtn.addEventListener("click", () => saveChanges(taskId));
}

// Save Changes After Editing
function saveChanges(taskId) {
  const task = tasks.find((t) => t.id === taskId);
  task.task = taskInput.value.trim();
  task.category = categoryInput.value;
  task.time = new Date(timeInput.value); // Update time

  taskInput.value = "";
  categoryInput.value = "Educational";
  timeInput.value = "";
  addTaskBtn.textContent = "Add Goal";

  renderTasks();
  updateChart();

  addTaskBtn.removeEventListener("click", saveChanges);
  addTaskBtn.addEventListener("click", addNewTask);
}

// Delete Task
function deleteTask(taskId) {
  tasks = tasks.filter((t) => t.id !== taskId);
  renderTasks();
  updateChart();
}

// Initialize Chart
function initializeChart() {
  chart = new Chart(progressChartCanvas, {
    type: "bar",
    data: {
      labels: ["Educational", "Professional", "Self"],
      datasets: [{
        label: "Progress (%)",
        data: [0, 0, 0],
        backgroundColor: ["#007bff", "#28a745", "#ffc107"],
        borderColor: ["#0056b3", "#1e7e34", "#d39e00"],
        borderWidth: 1,
      }],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          display: true,
          position: "top",
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          max: 100,
          ticks: {
            callback: (value) => `${value}%`,
          },
        },
      },
    },
  });
}

// Update Chart
function updateChart() {
  const categories = ["Educational", "Professional", "Self"];
  const completedCounts = categories.map(
    (category) => tasks.filter((t) => t.category === category && t.completed).length
  );
  const totalCounts = categories.map(
    (category) => tasks.filter((t) => t.category === category).length
  );

  const progressPercentages = categories.map((_, i) =>
    totalCounts[i] === 0 ? 0 : Math.round((completedCounts[i] / totalCounts[i]) * 100)
  );

  chart.data.datasets[0].data = progressPercentages;
  chart.update();
}
