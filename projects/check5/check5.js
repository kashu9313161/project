// DOM Elements
const addTaskBtn = document.getElementById('addTaskBtn');
const taskInput = document.getElementById('taskInput');
const categoryInput = document.getElementById('categoryInput');
const timeInput = document.getElementById('timeInput');
const notStarted = document.getElementById('notStarted');
const inProgress = document.getElementById('inProgress');
const done = document.getElementById('done');
const progressChartCanvas = document.getElementById("progressChart");

// Task array and Chart instance
let tasks = [];
let chart;

// Add a new task
addTaskBtn.addEventListener('click', () => {
  const taskText = taskInput.value.trim();
  const category = categoryInput.value;
  const time = timeInput.value;

  if (taskText === '' || time === '') {
    alert('Please enter both task and time!');
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
  taskInput.value = '';
  categoryInput.value = 'Work';
  timeInput.value = '';
  addTaskBtn.textContent = "Add Task";
  renderTasks();
  updateChart();
});

function renderTasks() {
  [notStarted, inProgress, done].forEach(column => column.innerHTML = "");

  tasks.forEach(task => {
    const formattedTime = task.time.toLocaleString(); // Format the time

    const taskDiv = document.createElement('div');
    taskDiv.className = `task ${task.completed ? 'complete' : ''}`;
    taskDiv.innerHTML = `
      <div>
        ${task.task} (${task.category}) <br>
        <small>Due: ${formattedTime}</small>
      </div>
    `;
    taskDiv.draggable = true;

    taskDiv.addEventListener('dragstart', (e) => {
      e.dataTransfer.setData('taskId', task.id);
      taskDiv.classList.add('dragging');
    });

    taskDiv.addEventListener('dragend', () => {
      taskDiv.classList.remove('dragging');
    });

    const column = task.completed ? done : notStarted;
    column.appendChild(taskDiv);
  });
}

// Handle drag-and-drop for columns
document.querySelectorAll('.droppable').forEach(zone => {
  zone.addEventListener('dragover', (e) => {
    e.preventDefault(); // Allow drop
    zone.classList.add('over');
  });

  zone.addEventListener('dragleave', () => {
    zone.classList.remove('over');
  });

  zone.addEventListener('drop', (e) => {
    e.preventDefault();

    const taskId = e.dataTransfer.getData('taskId');
    const task = tasks.find(t => t.id == taskId);
    const newStatus = zone.id === 'done' ? true : false;
    task.completed = newStatus;
    renderTasks();
    updateChart();
    zone.classList.remove('over');
  });
});

// Update Chart
function updateChart() {
  const categories = ["Work", "Personal", "Fitness"];
  const completedCounts = categories.map(
    category => tasks.filter(t => t.category === category && t.completed).length
  );
  const totalCounts = categories.map(
    category => tasks.filter(t => t.category === category).length
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
}
  // Chart Data