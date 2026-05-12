let api="http://localhost:3000/tasks";

async function createTasks(e){
    e.preventDefault();
    
    let taskInput=document.getElementById("taskInput");
    let dateInput=document.getElementById("dateInput");

    let originalValue=taskInput.value;
    if(originalValue.trim().length==0){
        alert("Task cannot be empty or just spaces");
        taskInput.value="";
        dateInput.value="";
        return
    }
    
    if(!taskInput || !dateInput){
        alert("please enter all fields");
        return;
    }

    let newTask = {
        task: taskInput.value.trim(),
        date: dateInput.value.trim(),
    };

    await fetch(api,{
        method: "POST",
        headers: {
            'Content-Type':'application/json'
        },
        body: JSON.stringify(newTask)
    });

    taskInput.value="";
    dateInput.value="";

    getTasks();
}

async function getTasks(){
    let response=await fetch(api);
    let data=await response.json();

    let tasklist=document.getElementById("tasklist");
    tasklist.innerHTML="";

    data.forEach(item => {
        let div=document.createElement("div");
        div.className="task-item";
        div.innerHTML=`
            <span><strong>${item.task}</strong> - (${item.date})</span>
            <button onclick="deleteTask('${item.id}');">Delete</button>
        `;

        tasklist.appendChild(div);
    });
    
}

async function deleteTask(id){

    let response=await fetch(`${api}/${id}`);
    let taskToDelete=await response.json();

    console.log(taskToDelete);

    await fetch(`${api}/${id}`,{ 
        method:"DELETE"
    });
    getTasks();
}

getTasks();