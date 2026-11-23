// Key under which the tasks are saved in the local storage
const STORAGE_KEY = 'todos';

// Check that a value read from the local storage has the shape of a task
function isValidTodo(todo) {
	return typeof todo?.text === 'string' && typeof todo.done === 'boolean';
}

// Read the saved tasks, or return an empty list if the data is missing or invalid
function loadTodos() {
	try {
		const todos = JSON.parse(localStorage.getItem(STORAGE_KEY));
		return Array.isArray(todos) && todos.every(isValidTodo) ? todos : [];
	} catch {
		return [];
	}
}

// Save the tasks in the local storage
function saveTodos(todos) {
	localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}

// Create a button with the given text and CSS class
function createButton(text, className) {
	const button = document.createElement('button');
	button.type = 'button';
	button.classList.add(className);
	button.textContent = text;
	return button;
}

// Initialize the application once the DOM content is fully loaded
document.addEventListener('DOMContentLoaded', () => {
	const input = document.getElementById('new-todo');
	const addButton = document.getElementById('add-todo');
	const list = document.getElementById('todo-list');
	let todos = loadTodos();

	// Display every task, replacing the previous content of the list
	function render() {
		list.replaceChildren(...todos.map(createTodoElement));
	}

	// Build the <li> of one task: its label, then its buttons
	function createTodoElement(todo) {
		const item = document.createElement('li');
		item.classList.add('todo-item');
		item.classList.toggle('done', todo.done);

		const label = document.createElement('span');
		label.textContent = todo.text;

		item.append(label, createActions(todo));
		return item;
	}

	// Build the "Terminée" / "À faire" and "Supprimer" buttons of one task
	function createActions(todo) {
		const actions = document.createElement('div');
		actions.classList.add('todo-actions');

		const checkText = todo.done ? 'À faire' : 'Terminée';
		const checkButton = createButton(checkText, 'action-check');
		checkButton.addEventListener('click', () => toggleTodo(todo));

		const deleteButton = createButton('Supprimer', 'action-delete');
		deleteButton.addEventListener('click', () => deleteTodo(todo));

		actions.append(checkButton, deleteButton);
		return actions;
	}

	// Save the tasks and display them again after each change
	function update() {
		saveTodos(todos);
		render();
	}

	// Add the typed task, unless it is empty once the spaces are removed
	function addTodo() {
		const text = input.value.trim();
		if (text === '') {
			return;
		}
		todos.push({ text, done: false });
		input.value = '';
		update();
	}

	// Switch a task between done and to do
	function toggleTodo(todo) {
		todo.done = !todo.done;
		update();
	}

	// Remove a task from the list
	function deleteTodo(todo) {
		todos = todos.filter((other) => other !== todo);
		update();
	}

	addButton.addEventListener('click', addTodo);
	input.addEventListener('keydown', (event) => {
		if (event.key === 'Enter') {
			addTodo();
		}
	});

	render();
});
