import { STATUSES } from "../utils/constants";

export async function getTodos(filters = {}) {
	let params = "";
	Object.entries(filters).forEach(([key, value]) => {
		if (params === "") {
			params = `?${key}=${value}`;
		} else {
			params = `&${key}=${value}`;
		}
	});
	const res = await fetch(`https://dummyjson.com/todos${params}`);
	if (!res.ok) {
		throw new Error("Something went wrong!");
	}
	const data = await res.json();
	return data.todos;
}

export async function createTodo(title) {
	const res = await fetch("https://dummyjson.com/todos/add", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({
			todo: title,
			completed: false,
			userId: 5,
		}),
	});
	if (!res.ok) {
		throw new Error("Something went wrong!");
	}
	const todo = await res.json();
    return {
        ...todo, 
        status: STATUSES.pending
    };
}
