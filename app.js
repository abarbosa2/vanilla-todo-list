const STORAGE_KEY = 'todos';

function isValidTodo(todo) {
	return typeof todo?.text === 'string' && typeof todo.done === 'boolean';
}

function loadTodos() {
	try {
		const todos = JSON.parse(localStorage.getItem(STORAGE_KEY));
		return Array.isArray(todos) && todos.every(isValidTodo) ? todos : [];
	} catch {
		return [];
	}
}

function saveTodos(todos) {
	localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}

function createButton(text, className) {
	const button = document.createElement('button');
	button.type = 'button';
	button.classList.add(className);
	button.textContent = text;
	return button;
}

document.addEventListener('DOMContentLoaded', () => {
	const input = document.getElementById('new-todo');
	const addButton = document.getElementById('add-todo');
	const list = document.getElementById('todo-list');
	let todos = loadTodos();

	function render() {
		list.replaceChildren(...todos.map(createTodoElement));
	}

	function createTodoElement(todo) {
		const item = document.createElement('li');
		item.classList.add('todo-item');
		item.classList.toggle('done', todo.done);

		const label = document.createElement('span');
		label.textContent = todo.text;

		item.append(label, createActions(todo));
		return item;
	}

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

	function update() {
		saveTodos(todos);
		render();
	}

	function addTodo() {
		const text = input.value.trim();
		if (text === '') {
			return;
		}
		todos.push({ text, done: false });
		input.value = '';
		update();
	}

	function toggleTodo(todo) {
		todo.done = !todo.done;
		update();
	}

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
