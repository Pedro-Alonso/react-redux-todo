import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

const url = 'http://localhost:8000/todos';

export const getTodosAsync = createAsyncThunk(
	'todos/getTodosAsync',
	async () => {
		const res = await fetch(url);
		if (res.ok) {
			const todos = await res.json();
			return { todos };
		}
	}
);

export const addTodoAsync = createAsyncThunk(
	'todos/addTodoAsync',
	async (payload) => {
		const res = await fetch(url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ title: payload.title }),
		});

		if (res.ok) {
			const todo = await res.json();
			return { todo };
		}
	}
);

export const toggleCompleteAsync = createAsyncThunk(
	'todos/completeTodoAsync',
	async (payload) => {
		const res = await fetch(`${url}/${payload.id}`, {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ completed: payload.completed }),
		});

		if (res.ok) {
			const todo = await res.json();
			return { todo };
		}
	}
);

export const deleteTodoAsync = createAsyncThunk(
	'todos/deleteTodoAsync',
	async (payload) => {
		const res = await fetch(`${url}/${payload.id}`, {
			method: 'DELETE',
		});

		if (res.ok) {
			return { id: payload.id };
		}
	}
);

export const todoSlice = createSlice({
	name: 'todos',
	initialState: [],
	extraReducers: {
		[getTodosAsync.fulfilled]: (state, action) => {
			return action.payload.todos;
		},
		[addTodoAsync.fulfilled]: (state, action) => {
			state.push(action.payload.todo);
		},
		[toggleCompleteAsync.fulfilled]: (state, action) => {
			const index = state.findIndex(
				(todo) => todo.id === action.payload.todo.id
			);
			state[index].completed = action.payload.todo.completed;
		},
		[deleteTodoAsync.fulfilled]: (state, action) => {
			return state.filter((todo) => todo.id !== action.payload.id);
		},
	},
});

export default todoSlice.reducer;
