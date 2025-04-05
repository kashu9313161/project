const addTaskBtn = document.getElementById('addTaskBtn');
const taskInput = document.getElementById('taskInput');
const notStarted = document.getElementById('notStarted');
const inProgress = document.getElementById('inProgress');
const done = document.getElementById('done');

// Add a new task
addTask.addEventListener('click', () => {
  const taskText = taskInput.value.trim();
  if (taskText === '') {
    alert('Task cannot be empty!');
    return;
  }
  createTask(taskText, notStarted);
  taskInput.value = '';
});

// Function to create a task
function createTask(text, container) {
  const task = document.createElement('div');
  task.classList.add('task');
  task.textContent = text;
  task.draggable = true;

  // Set drag events
  task.addEventListener('dragstart', (e) => {
    e.dataTransfer.setData('taskText', text); // Store task content
    e.dataTransfer.setData('sourceColumnId', container.id); // Store source column ID
    task.classList.add('dragging');
  });

  task.addEventListener('dragend', (e) => {
    task.classList.remove('dragging');
  });

  container.appendChild(task);
}

// Handle drag-and-drop for columns
document.querySelectorAll('.droppable').forEach((zone) => {
  zone.addEventListener('dragover', (e) => {
    e.preventDefault(); // Allow drop
    zone.classList.add('over');
  });

  zone.addEventListener('dragleave', () => {
    zone.classList.remove('over');
  });

  zone.addEventListener('drop', (e) => {
    e.preventDefault();

    const taskText = e.dataTransfer.getData('taskText'); // Get task content
    const sourceColumnId = e.dataTransfer.getData('sourceColumnId'); // Get source column ID
    const sourceColumn = document.getElementById(sourceColumnId); // Get source column element

    const draggingTask = Array.from(sourceColumn.children).find(task => task.textContent === taskText); // Locate the dragging element

    if (draggingTask) {
      sourceColumn.removeChild(draggingTask); // Remove from original parent
    }

    createTask(taskText, zone); // Add to the new column
    zone.classList.remove('over');
  });
});
