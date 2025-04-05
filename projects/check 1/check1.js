// DOM Elements
// taskInput  addTaskBtn
const taskInput = document.getElementById("taskInput"); 
const categoryInput = document.getElementById("categoryInput");
const timeInput = document.getElementById("timeInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");
const progressChartCanvas = document.getElementById("progressChart");

// Task array and Chart instance
let tasks = [];
let chart;

// Add Task
addTaskBtn.addEventListener("click", () => {
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
    time: new Date(time), // Store time as a Date object
    completed: false,
  };

  tasks.push(newTask);
  taskInput.value = "";
  timeInput.value = "";
  renderTasks();
  updateChart();
});

// Render Tasks
function renderTasks() {
  taskList.innerHTML = "";

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
  categoryInput.value = "Work";
  timeInput.value = "";
  addTaskBtn.textContent = "Add Task";

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

// Add New Task (for default behavior)
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
  renderTasks();
  updateChart();
}

// Update Chart
function updateChart() {
  const categories = ["Work", "Personal", "Fitness"];
  const completedCounts = categories.map(
    (category) => tasks.filter((t) => t.category === category && t.completed).length
  );
  const totalCounts = categories.map(
    (category) => tasks.filter((t) => t.category === category).length
  );

  const progressPercentages = categories.map((_, i) =>
    totalCounts[i] === 0 ? 0 : Math.round((completedCounts[i] / totalCounts[i]) * 100)
  );

  // Chart Data
  const data = {
    labels: categories,
    datasets: [
      {
        label: "Progress (%)",
        data: progressPercentages,
        backgroundColor: ["#007bff", "#28a745", "#ffc107"],
        borderColor: ["#0056b3", "#1e7e34", "#d39e00"],
        borderWidth: 1,
      },
    ],
  };

  // Destroy old chart before creating a new one
  if (chart) {
    chart.destroy();
  }

  chart = new Chart(progressChartCanvas, {
    type: "bar",
    data,
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