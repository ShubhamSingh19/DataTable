//global variables
const storageKey = "appData";
var dataArray = [];
const formContainer = document.getElementById("form-container");
const tableContainer = document.getElementById("table-container");
const form = document.getElementById("dataForm");
const firstNameSelector = document.getElementById("firstName");
const secondNameSelector = document.getElementById("secondName");
const emailSelector = document.getElementById("email");
const formTitleSelctor = document.getElementById("formTitle");
var editFlag = false;
var editId;

// Generates unique id for data
function generateId() {
  return Date.now() * 1000 + Math.floor(Math.random() * 1000);
}

// Dummy data for localstorage to show something, first time on new machine.
function generateDummyData(dataCount) {
  var dummyArray = [];
  var firstNameArray = [
    "Aman",
    "Shubham",
    "Sneha",
    "Manthan",
    "Riya",
    "Ritik",
    "Ishan",
    "Neha",
    "Vanshika",
    "Priya",
  ];
  var secondNameArray = [
    "Singh",
    "Sharma",
    "Jain",
    "Srivastava",
    "Gupta",
    "Mehra",
    "Agarwal",
    "Ahuja",
    "Verma",
    "Joshi",
  ];

  while (dataCount--) {
    let firstRandomName =
      firstNameArray[Math.floor(Math.random() * firstNameArray.length)];
    let secondRandomName =
      secondNameArray[Math.floor(Math.random() * secondNameArray.length)];
    var data = {
      id: generateId(),
      firstName: firstRandomName,
      secondName: secondRandomName,
      email: firstRandomName + secondRandomName + "@gmail.com",
    };
    dummyArray.push(data);
  }
  return dummyArray;
}

//saving on storage
function saveOnStorage(storageKey, data) {
  localStorage.setItem(storageKey, JSON.stringify(data));
}

//fetch data from storage
function fetchingFromStorage(storageKey) {
  return JSON.parse(localStorage.getItem(storageKey));
}

//check if the given key value pair is in localstorage.
function checkDatabase(storageKey) {
  var array;
  if (fetchingFromStorage(storageKey) === null) {
    array = generateDummyData(10); //10 is total number of random data
    saveOnStorage(storageKey, array);
  } else {
    array = fetchingFromStorage(storageKey);
  }
  return array;
}

//view Form
function viewForm() {
  editFlag
    ? (formTitleSelctor.innerHTML = "Edit Data")
    : (formTitleSelctor.innerHTML = "New Data");
  tableContainer.classList.add("hidden");
  formContainer.classList.remove("hidden");
}

//viw Table
function viewTable() {
  formContainer.classList.add("hidden");
  form.reset();
  tableContainer.classList.remove("hidden");
  editFlag = false;
}

// add all data from array to view
function viewAllData(dataArray) {
  var tableData = document.getElementById("table-data");
  if (dataArray.length === 0)
    tableData.innerHTML = "<div class='p-5 fs-14 dimmed'>No Data<div>";
  else {
    tableData.innerHTML = "";
    let nodes = dataArray.map((element, index) => {
      let div = document.createElement("div");
      div.classList.add("grid-row");
      div.innerHTML =
        '<div class="grid-item">' +
        (index + 1) +
        "</div>" +
        '<div class="grid-item">' +
        element.firstName +
        "</div>" +
        '<div class="grid-item">' +
        element.secondName +
        "</div>" +
        '<div class="grid-item email">' +
        element.email +
        "</div>" +
        '<div class="grid-item">' +
        '<span class="hidden">' +
        element.id +
        "</span>" +
        '<button class="button primary small" onclick="editData(this)">Edit</button>' +
        '<button class="button danger small" onclick="deleteData(this)">Delete</button>' +
        "</div>";
      return div;
    });
    tableData.prepend(...nodes);
  }
}

//cleaning the table view
function removeDataFromView() {
  var tableData = document.getElementById("table-data");
  tableData.innerHTML = "";
}

//Adding Data with updated one in the view
function reRender(dataArray) {
  removeDataFromView();
  viewAllData(dataArray);
}
//Edit 1 data in dataTable;
function editOldData() {
  const index = dataArray.findIndex((data) => data.id === editId);
  dataArray[index].firstName = firstNameSelector.value;
  dataArray[index].secondName = secondNameSelector.value;
  dataArray[index].email = emailSelector.value;
  reRender(dataArray);
  editFlag = false;
}

//Add 1 data in dataTable
function addNewData() {
  var firstNameValue = firstNameSelector.value.trim();
  var secondNameValue = secondNameSelector.value.trim();
  var emailValue = emailSelector.value;
  if (!(firstNameValue && secondNameValue)) {
    alert("You cannot save empty names");
    throw Error;
  }
  var data = {
    id: generateId(),
    firstName: firstNameValue,
    secondName: secondNameValue,
    email: emailValue,
  };
  firstNameValue;
  dataArray.unshift(data);
  reRender(dataArray);
}

//get hidden Id of data from the element
function getId(element) {
  let childArray = element.parentElement.children;
  let id = Number(childArray[0].innerHTML);
  return id;
}

//function to delete a data by pressing delete button
function deleteData(element) {
  let id = getId(element);
  let updatedArray = dataArray.filter((data) => data.id !== id);
  reRender(updatedArray);
  dataArray = updatedArray;
  saveOnStorage(storageKey, dataArray);
}

function setFormInputValues(array) {
  firstNameSelector.value = array[1].innerHTML;
  secondNameSelector.value = array[2].innerHTML;
  emailSelector.value = array[3].innerHTML;
}

//Edit a data by pressing edit button
function editData(element) {
  editFlag = true;
  editId = getId(element);
  let childArray = element.parentElement.parentElement.children;
  setFormInputValues(childArray);
  //data will be edited on form and saved from there only
  viewForm();
}

//function called on submitting the form. Saves data
function save(e) {
  e.preventDefault();
  try {
    editFlag ? editOldData() : addNewData();
    viewTable();
    saveOnStorage(storageKey, dataArray);
  } catch (e) {
    throw new Error(e.message);
  }
}

//main function()
function init() {
  dataArray = checkDatabase(storageKey);
  viewAllData(dataArray);
}
