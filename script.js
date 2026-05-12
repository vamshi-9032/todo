let api = ENV.API_URL;

async function createTasks(e) {
    e.preventDefault();

    let taskInput = document.getElementById("taskInput");
    let dateInput = document.getElementById("dateInput");

    let originalValue = taskInput.value;
    if (originalValue.trim().length == 0) {
        alert("Task cannot be empty or just spaces");
        taskInput.value = "";
        dateInput.value = "";
        return;
    }

    if (!dateInput.value.trim()) {
        alert("Please select a date");
        return;
    }

    let newTask = {
        task: taskInput.value.trim(),
        date: dateInput.value.trim(),
    };

    try {
        let response = await fetch(api, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(newTask),
        });

        if (!response.ok) throw new Error("Failed to create task");

        taskInput.value = "";
        dateInput.value = "";
        getTasks();
    } catch (error) {
        console.error("Error creating task:", error);
        alert("Failed to add task. Check console for details.");
    }
}

async function getTasks() {
    let tasklist = document.getElementById("tasklist");

    try {
        let response = await fetch(api);

        if (!response.ok) throw new Error("Failed to fetch tasks");

        let data = await response.json();
        tasklist.innerHTML = "";

        if (data.length === 0) {
            tasklist.innerHTML = `<div class="empty-msg">No tasks yet. Add one above!</div>`;
            return;
        }

        data.forEach((item) => {
            let div = document.createElement("div");
            div.className = "task-item";
            div.innerHTML = `
                <span><strong>${item.task}</strong> - (${item.date})</span>
                <button onclick="deleteTask('${item.id}');">Delete</button>
            `;
            tasklist.appendChild(div);
        });
    } catch (error) {
        console.error("Error fetching tasks:", error);
        tasklist.innerHTML = `<div class="error-msg">Failed to load tasks. Is the API running?</div>`;
    }
}

async function deleteTask(id) {
    try {
        let response = await fetch(`${api}/${id}`, {
            method: "DELETE",
        });

        if (!response.ok) throw new Error("Failed to delete task");

        getTasks();
    } catch (error) {
        console.error("Error deleting task:", error);
        alert("Failed to delete task. Check console for details.");
    }
}

getTasks();