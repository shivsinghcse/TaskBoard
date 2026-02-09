window.onload = () => {
    createDB()
    fetchTasks()
}

let allTasks = []

const openDialog = () => { 
    new Swal({
        html: `
            <div class="space-y-6 py-6 px-4 relative select-none">
                <h1 class="text-xl font-semibold text-left text-black">New Task</h1>
                <form class="flex flex-col gap-8" onsubmit="createTask(event)">
                    <input 
                        type="text" 
                        name="newTask" 
                        id="new-task" 
                        placeholder= "Enter your new task" 
                        class="border border-gray-300 rounded py-2 px-4 placeholder-slate-400 text-indigo-400 focus:outline-indigo-500"
                        required
                        autofocus
                    /> 
                    <button class="w-fit bg-indigo-500 py-2 px-4 text-white font-medium rounded hover:cursor-pointer hover:bg-indigo-600">Add</button>
                </form>    
            </div>    
        `,
        showConfirmButton: false,
        showCloseButton: true,
    })
} 

// checking is DB Present on not if not create

const createDB = () => {
    const isDbPresent = localStorage.getItem('taskkboardDB')

    if(isDbPresent === null){
        allTasks = []
        localStorage.setItem('taskkboardDB', JSON.stringify(allTasks))
        
    }else{
        allTasks = JSON.parse(localStorage.getItem('taskkboardDB'))
    }
}

const createTask = (e) => {
    e.preventDefault()
    const taskInput = e.target.elements.newTask.value.trim()
    const isTaskDone = false
    const task ={
        taskInput,
        isTaskDone
    }

    allTasks.push(task)

    localStorage.setItem('taskkboardDB', JSON.stringify(allTasks))

    e.target.reset()
    
    getToast('green', 'Task added successfully')
}


const fetchTasks = () => {
    const tasksEle = document.getElementById('tasks');
    if(allTasks.length === 0){
        tasksEle.innerHTML = `
            <div class="select-none">
                <h1 class="animate__animated animate__pulse animate__infinite lg:text-2xl font-semibold text-center lg:mb-10 my-5 border border-2 border-indigo-600 w-fit mx-auto lg:py-4 py-2 lg:px-8 px-4 rounded-xl"><span class="text-green-500 underline decoration-green-500 underline-offset-4">Plan</span> and <span class="text-green-500 underline decoration-green-500 underline-offset-4">WIN</span> your day 🚀</h1>
                <img 
                    src="./images/poster.png"
                    alt = "image"
                    class="lg:w-[40%] mx-auto rounded"
                /> 
            </div>    
        `
    }else {
            
           for(let i=0; i<allTasks.length; i++){
                const taskUI = `
                <div class="select-none flex justify-between items-center py-2.5 lg:px-8 px-4 bg-white rounded-md shadow-lg hover:shadow-indigo-500 transition-shadow ease-in duration-300 ">
                            
                    <div class="flex items-center lg:gap-4 gap-3">
                        <input 
                            type="checkbox" name="isTaskDone" 
                            ${allTasks[i].isTaskDone ? 'checked' : ''}
                            onclick="isTaskDone(this, '${i}')"
                        >
        
                        <p>${allTasks[i].taskInput}</p>
                    </div>
                            
                 <div class="flex justify-center items-center gap-1.5">
                        <button 
                            class="lg:w-8 w-7 lg:h-8 h-7 bg-indigo-500 rounded-full hover:cursor-pointer hover:bg-indigo-600"
                            onclick="openEditDialog('${allTasks[i].taskInput}', '${i}')"
                        >
                            <i class="ri-pencil-line text-white"></i>
                        </button>
                        <button 
                            onclick="deleteData(${i})" class="lg:w-8 w-7 lg:h-8 h-7 bg-red-500 rounded-full hover:cursor-pointer hover:bg-red-600">
                            <i class="ri-delete-bin-3-line text-white"></i>
                        </button>
                    </div>
                </div>
                `
                
                tasksEle.innerHTML += taskUI;
                 if (allTasks[i].isTaskDone) {
                    const currentTask = tasksEle.lastElementChild
                    const checkbox = currentTask.querySelector('input[type="checkbox"]')
                    markCompleted(checkbox)
            }
        }
    }
}




const deleteData = (index) => {
    allTasks.splice(index,  1)
    localStorage.setItem('taskkboardDB', JSON.stringify(allTasks))
    getToast('red', 'Task deleted successfully')
}


const openEditDialog = (task, key) => {
    new Swal({
        html: `
            <div class="space-y-6 py-6 px-4 relative select-none">
                <h1 class="text-xl font-semibold text-left text-black">Edit Task</h1>
                <form class="flex flex-col gap-8" onsubmit="editTask(event, '${key}')">
                    <input 
                        type="text" 
                        name="editedTask" 
                        id="edited-task"
                        value= "${task}" 
                        class="border border-gray-300 rounded py-2 px-4 placeholder-slate-400 text-indigo-400 focus:outline-indigo-500"
                        required
                        autofocus
                    /> 
                    <button class="w-fit bg-green-500 py-2 px-4 text-white font-medium rounded hover:cursor-pointer hover:bg-green-600">Update</button>
                </form>    
            </div>    
        `,
        showConfirmButton: false,
        showCloseButton: true,
    })
}


const editTask = (e, index) => {
    e.preventDefault()
    const editedTask = e.target.elements.editedTask.value.trim()
    allTasks[index].taskInput = editedTask
    localStorage.setItem('taskkboardDB', JSON.stringify(allTasks))
    getToast('green', 'Task updated successfully')
}

const getToast = (color, title) => {
    const isMobile = window.innerWidth < 768;
    const Toast = Swal.mixin({
        toast: true,
        position: isMobile ? 'top' : 'top-end',
        iconColor: color,
        customClass: {
            popup: 'colored-toast',
        },
        timer: 300,
        width: isMobile ? '70vw' : '320px',
        timerProgressBar: true,
        showConfirmButton: false,
        didOpen: (toast) => {
        // This targets the progress bar specifically
        const progressBar = toast.querySelector('.swal2-timer-progress-bar');
        if (progressBar) {
            progressBar.style.backgroundColor = color;
        }
    }
    })
    
    
    Toast.fire({
        icon: 'success',
        title: `<span style="color: ${color}">${title}</span>`
    }).then(() => {
        if(location.href){
            location.href = location.href
        }
    })
}

const isTaskDone = (checkbox, index) => {
    const isChecked = checkbox.checked;

    if(isChecked){
        allTasks[index].isTaskDone = true
        localStorage.setItem('taskkboardDB', JSON.stringify(allTasks))
    }else{
        allTasks[index].isTaskDone = false
        localStorage.setItem('taskkboardDB', JSON.stringify(allTasks))
    }
    
    markCompleted(checkbox)
}


const markCompleted = (checkbox) => {

    
    const isChecked = checkbox.checked;
    const parentEle = checkbox.parentElement.parentElement;

    if(isChecked){
        parentEle.classList.remove('bg-white', 'hover:shadow-indigo-500')
        parentEle.classList.add('bg-green-400', 'hover:shadow-red-300')
        checkbox.parentElement.classList.add('text-white')
        
    }else{
        parentEle.classList.remove('bg-green-300', 'hover:shadow-red-300')
        parentEle.classList.add('bg-white', 'hover:shadow-indigo-500')
        checkbox.parentElement.classList.remove('text-white')
    }
}