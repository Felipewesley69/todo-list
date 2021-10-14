'use strict'
//Todas as CONST do projeto
const todoListContainer = document.querySelector('.todo-list__container');
const ulTodoList = document.getElementById('todo-list');
const btnAdd = document.getElementById('add-item');
const formAdd = document.getElementById('todo-add')
const taskImput = document.getElementById('item-input');
const lis = ulTodoList.getElementsByTagName('li')
//contador de caracteres
const display = document.querySelector('#caracteresRestantes').getElementsByTagName('span')[0]
const maxCaractere = taskImput.maxLength;
document.querySelector('#caracteresRestantes').style.color = '#fff'
display.innerHTML = maxCaractere;
const tasks = getSaveData()

const rodape = document.getElementById('devolper');
rodape.textContent = 'developed by: Felipe Lemos'

taskImput.addEventListener('input', function (e) {

  display.innerHTML = maxCaractere;
  let totalCaracteresENumeros = e.target.value.length
  let restCaracteres = maxCaractere - totalCaracteresENumeros;
  display.innerHTML = restCaracteres;

})

function getSaveData() {
  let tasksData = localStorage.getItem('tasks')
  tasksData = JSON.parse(tasksData);

  return tasksData || []

}

function setNewData() {
  localStorage.setItem('tasks', JSON.stringify(tasks))
}

function getSaveDataCompleted() {
  let tasksData = localStorage.getItem('tasks')
  tasksData = JSON.parse(tasksData);
  return tasksData || []
}

function gerarStatusCheck() {

  tasks.forEach((taks, i) => {
    const checkar = document.getElementsByClassName('button-check')[i].getElementsByTagName('i')[0]
    if (taks.completed) {
      checkar.classList.remove('displayNone');
      checkar.parentElement.nextElementSibling.style.color = 'gray';
      checkar.parentElement.nextElementSibling.style.textDecoration = 'line-through';
    } else {
      checkar.classList.add('displayNone')
      checkar.parentElement.nextElementSibling.style.textDecoration = 'none';
      checkar.parentElement.nextElementSibling.style.removeProperty('color');
    }
  })
}

function completedTaks() {
  let totalTaksCompleted = 0;
  tasks.forEach((taks) => {
    if (taks.completed) totalTaksCompleted++;
  })
  document.getElementById('total-task-completed').textContent = `Completed:  ${totalTaksCompleted}`;
}
setNewData()

formAdd.addEventListener('submit', getTask)

function getTask(e) {
  e.preventDefault();
  if (checkEmptyTask(taskImput.value)) {
    inputFocus()
    alert('[ERRO] A tarefa precisa ser preencida!');
    gerarStatusCheck()
    completedTaks()
    return
  }
  tasks.push({
    name: taskImput.value,
    creatData: Date.now(),
    completed: false
  })

  setNewData()
  //Atualizar as tarefas
  clearUl();
  clearInputTask();
  attTasks(tasks);
  display.innerHTML = maxCaractere;
  gerarStatusCheck()
  completedTaks()
}
//Evento clicar na li
function clickLi(e) {
  const arr = e.target.id.split('-')

  let i = arr[1];
  const currentLi = lis[i].querySelector('.editContainer')

  if (arr[0] == 'edit') { //Editar
    //Evento para fechar o editContainer
    currentLi.querySelector('.cancelButton').addEventListener('click', () => {
      currentLi.style.display = 'none'
    })
    currentLi.querySelector('.editButton').addEventListener('click', () => {
      let taskEdit = inputEditContainer.value;
      tasks[i].name = taskEdit;
      currentLi.style.display = 'none'
      clearUl();
      setNewData()
      attTasks(tasks);
      gerarStatusCheck()
      completedTaks()
    });

    [...ulTodoList.querySelectorAll('.editContainer')].forEach((container) => {
      container.removeAttribute('style')
    })

    currentLi.style.display = 'flex'

    const inputEditContainer = currentLi.querySelector('.editInput')

    inputEditContainer.focus()
    inputEditContainer.value = tasks[i].name;
    return
  } else if (arr[0] == 'delet') { //Deletar
    tasks.splice(arr[1], 1);
    completedTaks()
  } else if (arr[0] == 'check') { //Checar

    const iBtnCheckar = lis[i].querySelector('.button-check').getElementsByTagName('i')[0]
    tasks[arr[1]].completed = !tasks[arr[1]].completed;

    if (tasks[arr[1]].completed) {
      iBtnCheckar.classList.remove('displayNone');
      iBtnCheckar.parentElement.nextElementSibling.style.color = 'gray';
      iBtnCheckar.parentElement.nextElementSibling.style.textDecoration = 'line-through';
    } else {
      iBtnCheckar.classList.add('displayNone')
      iBtnCheckar.parentElement.nextElementSibling.style.textDecoration = 'none';
      iBtnCheckar.parentElement.nextElementSibling.style.removeProperty('color');
    }
    setNewData()
    getSaveData()
    completedTaks()
    return
  } else {
    return
  }
  clearUl();
  setNewData()
  attTasks(tasks);
  gerarStatusCheck()
}
//Função para atualizar as tarefas dentro da ul

function attTasks(tasks) {
  tasks.forEach((tarefa, index) => {
    const newLi = document.createElement('li');
    newLi.classList.add('todo-item');
    newLi.addEventListener('click', clickLi);
    newLi.innerHTML = `
      <button id="check-${index}" class="button-check">
        <i id="check-${index}" class="fas fa-check displayNone"></i>
      </button>
      <p class="task-name">${tarefa.name}</p>
      <i id="edit-${index}" class="fas fa-edit"></i>
      <div class="editContainer">
        <input class="editInput" type="text">
        <button class="editButton">Confirm</button>
        <button class="cancelButton">Cancel</button>
      </div>
      <i id="delet-${index}" class="fas fa-trash-alt"></i>
    `;
    ulTodoList.appendChild(newLi);
  });
  const totalTask = document.getElementById('total-task');
  totalTask.textContent = `Total:  ${tasks.length}`;
  inputFocus();
}
//função para limpar os conteudos da ul
const clearUl = () => ulTodoList.innerHTML = '';
//Função para limpar o input da tarefa
const clearInputTask = () => taskImput.value = '';
//Função para verificar se é vazio
const checkEmptyTask = (valorTask) => {
  return valorTask === '' ? true : false;
}
//Colocar o foco na input
const inputFocus = () => taskImput.focus();
//Atualizar tabela ao atualizar a página
(function () {
  completedTaks()
  clearUl();
  clearInputTask();
  setNewData()
  attTasks(tasks);
  gerarStatusCheck()
})()