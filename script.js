const addBtns = document.querySelectorAll(".add-btn:not(.solid)");
const saveItemBtns = document.querySelectorAll(".solid");
const addItemContainers = document.querySelectorAll(".add-container");
const addItems = document.querySelectorAll(".add-item");
// item lists
const listColumns = document.querySelectorAll(".drag-item-list");
const backlogList = document.querySelector("#backlog-list");
const progressList = document.querySelector("#progress-list");
const completeList = document.querySelector("#complete-list");
const onHoldList = document.querySelector("#on-hold-list");

let updatedOnLoad = false;

// initialize arrays
let backlogListArray = [];
let progressListArray = [];
let completeListArray = [];
let onHoldListArray = [];
let listArrays = [];

// drag functionality

let draggedItem;
let dragging = false;
let currentColumn;

function getSavedColumns() {
  if (localStorage.getItem("backlogItems")) {
    backlogListArray = JSON.parse(localStorage.backlogItems);
    progressListArray = JSON.parse(localStorage.progressItems);
    completeListArray = JSON.parse(localStorage.completeItems);
    onHoldListArray = JSON.parse(localStorage.onHoldItems);
  }
}

// set localStorage arrays
function updateSavedColumns() {
  listArrays = [
    backlogListArray,
    progressListArray,
    completeListArray,
    onHoldListArray,
  ];
  const arrayNames = ["backlog", "progress", "complete", "onHold"];
  arrayNames.forEach((arrayName, i) => {
    localStorage.setItem(`${arrayName}Items`, JSON.stringify(listArrays[i]));
  });
}

// filter arrays to remove empty items
function filterArray(arr) {
  const filteredArray = arr.filter((item) => item !== null);
  return filteredArray;
}

// create DOM elements for each list item
function createItemEl(columnEl, column, item, index) {
  // list item
  const listEl = document.createElement("li");
  listEl.classList.add("drag-item");
  listEl.textContent = item;
  listEl.draggable = true;
  listEl.setAttribute("ondragstart", "drag(event)");
  listEl.contentEditable = true;
  listEl.id = index;
  listEl.setAttribute("onfocusout", `updateItem(${index}, ${column})`);
  columnEl.appendChild(listEl);
}

// update columns in DOM - reset HTML, filter array, update localStorage
function updateDOM() {
  // check localStorage once
  if (!updatedOnLoad) {
    getSavedColumns();
  }
  // backlog Column
  backlogList.textContent = "";
  backlogListArray.forEach((backlogItem, i) => {
    createItemEl(backlogList, 0, backlogItem, i);
  });
  backlogListArray = filterArray(backlogListArray);
  // progress Column
  progressList.textContent = "";
  progressListArray.forEach((progressItem, i) => {
    createItemEl(progressList, 1, progressItem, i);
  });
  progressListArray = filterArray(progressListArray);
  // complete Column
  completeList.textContent = "";
  completeListArray.forEach((completeItem, i) => {
    createItemEl(completeList, 2, completeItem, i);
  });
  completeListArray = filterArray(completeListArray);
  // on Hold Column
  onHoldList.textContent = "";
  onHoldListArray.forEach((onHoldItem, i) => {
    createItemEl(onHoldList, 3, onHoldItem, i);
  });
  onHoldListArray = filterArray(onHoldListArray);
  // run getSavedColumns only once, update local storage
  updatedOnLoad = true;
  updateSavedColumns();
}

//update item - delete if necessary, or update array value
function updateItem(id, column) {
  const selectedArray = listArrays[column];
  const selectedColumnEl = listColumns[column].children;
  if (!dragging) {
    if (!selectedColumnEl[id].textContent) {
      delete selectedArray[id];
    } else {
      selectedArray[id] = selectedColumnEl[id].textContent;
    }
    updateDOM();
  }
}
// add to column list, reset textbox
function addToColumn(column) {
  const itemText = addItems[column].textContent;
  const selectedArray = listArrays[column];
  selectedArray.push(itemText);
  addItems[column].textContent = "";
  updateDOM();
}
// show add item input box
function showInputBox(column) {
  addBtns[column].style.visibility = "hidden";
  saveItemBtns[column].style.display = "flex";
  addItemContainers[column].style.display = "flex";
}
// hide item input box
function hideInputBox(column) {
  addBtns[column].style.visibility = "visible";
  saveItemBtns[column].style.display = "none";
  addItemContainers[column].style.display = "none";
  addToColumn(column);
}
// allows arrays to reflect drag and drop items
function rebuildArrays() {
  backlogListArray = Array.from(backlogList.children).map((i) => i.textContent);
  progressListArray = Array.from(progressList.children).map(
    (i) => i.textContent
  );
  completeListArray = Array.from(completeList.children).map(
    (i) => i.textContent
  );
  onHoldListArray = Array.from(onHoldList.children).map((i) => i.textContent);
  updateDOM();
}
// when item starts dragging
function drag(e) {
  draggedItem = e.target;
  dragging = true;
}
// column allows for item to drop
function allowDrop(e) {
  e.preventDefault();
}
// when item enters column area
function dragEnter(column) {
  listColumns[column].classList.add("over");
  currentColumn = column;
}
// dropping item in column
function drop(e) {
  e.preventDefault();
  //remove background color/padding
  listColumns.forEach((column) => {
    column.classList.remove("over");
  });
  // add item to column
  const parent = listColumns[currentColumn];
  parent.appendChild(draggedItem);
  dragging = false;
  rebuildArrays();
}

updateDOM();
