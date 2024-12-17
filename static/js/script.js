let inventory = JSON.parse(localStorage.getItem('inventory')) || [
  { id: 1, name: "Мяч футбольный", quantity: 10, status: "new" , price: 800, image:"https://avatars.mds.yandex.net/get-mpic/4319926/img_id1609212522468597836/orig"},
  { id: 2, name: "Скакалка", quantity: 20, status: "used" , price: 300, image:"https://sportcity.ua/wp-content/uploads/2022/03/skakalka-dlya-fitnesa.jpg"},
  { id: 3, name: "Гимнастический коврик", quantity: 15, status: "new", price: 1500, image:"https://cdn1.ozone.ru/s3/multimedia-b/6141990325.jpg"},
  { id: 4, name: "Баскетбольный мяч", quantity: 5, status: "broken", price: 2000, image: "https://avatars.mds.yandex.net/get-mpic/1622738/img_id3729552636604857234/orig"}
];
let users = JSON.parse(localStorage.getItem('users')) || [];
let requests = JSON.parse(localStorage.getItem('requests')) || [];
let purchaseList = JSON.parse(localStorage.getItem('purchaseList')) || [];
let assignList = JSON.parse(localStorage.getItem('assignList')) || [];
let repairRequests = JSON.parse(localStorage.getItem('repairRequests')) || [];

function login() {
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  const loginStatus = document.getElementById('login-status');
  if (username && password){
    const user = {
      username: username,
      password: password
    }
    req = fetch('http://127.0.0.1:5000/api/login/', {
      method: "POST",
      body: JSON.stringify(user)
    })
    .then(response => {
      return response.json();
    }).then( data => {
      if (data.is_super_user) {
        window.location.replace('http://127.0.0.1:5000/admin')
      } else {
        window.location.replace('http://127.0.0.1:5000/user')
      }
    });

  }
  
//   if (username === 'admin' && password === 'admin') {
//     window.location.href = 'admin.html'; // Перенаправление для админа
// } else if (username === 'user' && password === 'user') {
//     window.location.href = 'user.html'; // Перенаправление для пользователя
// }
}


function saveToLocalStorage() {
  localStorage.setItem('inventory', JSON.stringify(inventory));
  localStorage.setItem('users', JSON.stringify(users));
  localStorage.setItem('requests', JSON.stringify(requests));
  localStorage.setItem('purchaseList', JSON.stringify(purchaseList));
  localStorage.setItem('assignList', JSON.stringify(assignList));
  localStorage.setItem('repairRequests', JSON.stringify(repairRequests));
}

function updateInventoryList() {
  const inventoryList = document.getElementById("inventory-items");
  inventoryList.innerHTML = "";
  inventory.filter(item => item.status !== "broken").forEach(item => {
      const listItem = document.createElement("li");
      listItem.textContent = `${item.name} (Количество: ${item.quantity}, Состояние: ${item.status})`;
      inventoryList.appendChild(listItem);
  });
}
function updateAdminInventoryList() {
const adminInventoryList = document.getElementById("admin-inventory-items");
adminInventoryList.innerHTML = "";
inventory.forEach(item => {
  const listItem = document.createElement("li");
  listItem.innerHTML = `
    <img src="${item.image}" alt="${item.name}" >
     ID: ${item.id}, ${item.name} (Количество: ${item.quantity}, Состояние: ${item.status}, Цена: ${item.price} руб.)
  `;
  adminInventoryList.appendChild(listItem);
});
}

function openAddItemModal() {
  document.getElementById('add-item-modal').style.display = 'block';
}
function closeAddItemModal() {
  document.getElementById('add-item-modal').style.display = 'none';
}
function addItem() {
  const itemName = document.getElementById("modal-item-name").value;
    const itemPrice = document.getElementById("modal-item-price").value;
  const itemQuantity = document.getElementById("modal-item-quantity").value;
  const itemStatus = document.getElementById("modal-item-status").value;
  const itemImage = document.getElementById("modal-item-image").value;
  const newItem = {
      id: Date.now(),
      name: itemName,
      price: parseInt(itemPrice),
      quantity: parseInt(itemQuantity),
      status: itemStatus,
      image:itemImage
  };
  inventory.push(newItem);
  addInventoryCard(newItem); 
  saveToLocalStorage();
  closeAddItemModal();
  alert('Инвентарь успешно добавлен!');
  document.getElementById("modal-item-name").value = "";
  document.getElementById("modal-item-price").value = "";
  document.getElementById("modal-item-quantity").value = "";
  document.getElementById("modal-item-status").value = "";
   document.getElementById("modal-item-image").value = "";
}
function addInventoryCard(item) {
 const adminInventoryList = document.getElementById("admin-inventory-items");
const listItem = document.createElement("li");
 listItem.innerHTML = `
    <img src="${item.image}" alt="${item.name}" >
     ID: ${item.id}, ${item.name} (Количество: ${item.quantity}, Состояние: ${item.status}, Цена: ${item.price} руб.)
  `;
  adminInventoryList.appendChild(listItem);
}


function editItem(){
  const editItemId = parseInt(document.getElementById("edit-item-id").value);
  const editItemName = document.getElementById("edit-item-name").value;
   const editItemPrice = document.getElementById("edit-item-price").value;
  const editItemQuantity = document.getElementById("edit-item-quantity").value;
   const editItemImage = document.getElementById("edit-item-image").value;
  const editItemStatus = document.getElementById("edit-item-status").value;
  const editItemIndex = inventory.findIndex(item => item.id === editItemId)
  if(editItemIndex !== -1){
      inventory[editItemIndex].name = editItemName;
      inventory[editItemIndex].price = parseInt(editItemPrice);
      inventory[editItemIndex].quantity = parseInt(editItemQuantity);
      inventory[editItemIndex].status = editItemStatus;
      inventory[editItemIndex].image = editItemImage;
      updateInventoryList();
      updateAdminInventoryList();
      saveToLocalStorage();
      alert('Инвентарь успешно отредактирован!');
  }else{
      alert('Инвентарь с таким ID не найден');
  }
  document.getElementById("edit-item-id").value = "";
  document.getElementById("edit-item-name").value = "";
    document.getElementById("edit-item-price").value = "";
  document.getElementById("edit-item-quantity").value = "";
  document.getElementById("edit-item-status").value = "";
   document.getElementById("edit-item-image").value = "";
}
function assignItem(){
  const assignItemId = parseInt(document.getElementById("assign-item-id").value);
  const assignUserId = parseInt(document.getElementById("assign-user-id").value);
  const assignItemIndex = inventory.findIndex(item => item.id === assignItemId);
  const assignUserIndex = users.findIndex(user => user.id === assignUserId);
  if(assignItemIndex !== -1 && assignUserIndex !== -1){
      const assign = {
          itemId: assignItemId,
          userId: assignUserId
      };
      assignList.push(assign);
      saveToLocalStorage();
      alert('Инвентарь успешно закреплен за пользователем!');
  }else{
      alert('Инвентарь или пользователь с таким ID не найден');
  }
  document.getElementById("assign-item-id").value = "";
  document.getElementById("assign-user-id").value = "";
}
function addPurchase(){
  const purchaseName = document.getElementById("purchase-name").value;
  const purchaseQuantity = document.getElementById("purchase-quantity").value;
  const purchasePrice = document.getElementById("purchase-price").value;
  const purchaseSupplier = document.getElementById("purchase-supplier").value;
  const newPurchase = {
      id: Date.now(),
      name: purchaseName,
      quantity: parseInt(purchaseQuantity),
      price: parseInt(purchasePrice),
      supplier: purchaseSupplier
  };
  purchaseList.push(newPurchase);
  updatePurchaseList();
  saveToLocalStorage();
  alert('Закупка добавлена в план!');
  document.getElementById("purchase-name").value = "";
  document.getElementById("purchase-quantity").value = "";
  document.getElementById("purchase-price").value = "";
  document.getElementById("purchase-supplier").value = "";
}
function updatePurchaseList(){
  const purchaseListContainer = document.getElementById("purchase-list");
  purchaseListContainer.innerHTML = "<h2>Список закупок</h2>";
  const ul = document.createElement("ul");
  purchaseList.forEach(item => {
      const li = document.createElement("li");
      li.textContent = `ID: ${item.id}, ${item.name} (Количество: ${item.quantity}, Цена: ${item.price}, Поставщик: ${item.supplier})`;
      ul.appendChild(li);
  });
  purchaseListContainer.appendChild(ul);
}
function register() {
  const registerUsername = document.getElementById("register-username").value;
  const registerPassword = document.getElementById("register-password").value;

  if(registerUsername && registerPassword){
      const newUser = {
          username: registerUsername,
          password: registerPassword
      };
      // users.push(newUser);
      req = fetch("http://127.0.0.1:5000/api/register/", {
        method: "POST",
        body: JSON.stringify(newUser)
      });
        document.getElementById("registration-status").textContent = 'Регистрация успешна!';
        document.getElementById("register-username").value = "";
        document.getElementById("register-password").value = "";
      
  }else{
      document.getElementById("registration-status").textContent = 'Пожалуйста заполните все поля';
  }
}

function updateUserInventoryList(){
  const userInventoryList = document.getElementById("user-inventory-list");
  userInventoryList.innerHTML = "";
  inventory.filter(item => item.status !== "broken").forEach(item => {
      const listItem = document.createElement("li");
      listItem.textContent = `ID: ${item.id}, ${item.name} (Количество: ${item.quantity}, Состояние: ${item.status})`;
      userInventoryList.appendChild(listItem);
  });
}
//Создание заявок на получение инвентаря
function createRequest(){
  const requestItemId = parseInt(document.getElementById("request-item-id").value);
  const requestItemIndex = inventory.findIndex(item => item.id === requestItemId);
  if(requestItemIndex !== -1){
      const newRequest = {
          id: Date.now(),
          itemId: requestItemId,
          status: "Ожидает"
      };
      requests.push(newRequest);
      updateUserRequestsList();
      saveToLocalStorage();
      alert('Заявка на получение инвентаря создана');
  }else{
      alert('Инвентарь с таким ID не найден');
  }
  document.getElementById("request-item-id").value = "";
}
function updateUserRequestsList(){
  const userRequestsList = document.getElementById("user-request-items");
  userRequestsList.innerHTML = "";
  requests.forEach(request => {
      const requestItem = inventory.find(item => item.id === request.itemId);
      const listItem = document.createElement("li");
      listItem.textContent = `ID: ${request.id}, Инвентарь: ${requestItem.name}, Статус: ${request.status}`;
      userRequestsList.appendChild(listItem);
  });
}
function createRepairRequest(){
  const repairItemId = document.getElementById("repair-item-id").value;
  const repairDescription = document.getElementById("repair-description").value;
  if(repairItemId && repairDescription){
      const newRepairRequest = {
          id: Date.now(),
          itemId: repairItemId,
          description: repairDescription,
      };
      repairRequests.push(newRepairRequest);
       saveToLocalStorage();
      document.getElementById("repair-request-status").textContent = 'Заявка отправлена!';
  }else{
      document.getElementById("repair-request-status").textContent = 'Пожалуйста заполните все поля';
  }
  document.getElementById("repair-item-id").value = "";
  document.getElementById("repair-description").value = "";
}

function createReport() {
  const reportContainer = document.getElementById("reports");
  reportContainer.innerHTML = "";
  let reportText = "Отчёт по инвентарю:\n\n";
  inventory.forEach(item => {
      reportText += `ID: ${item.id}, Название: ${item.name}, Количество: ${item.quantity}, Состояние: ${item.status}, Цена: ${item.price} руб. \n`;
  });
  reportText += "\nСписок закупок:\n\n";
  purchaseList.forEach(item => {
      reportText += `ID: ${item.id}, Название: ${item.name}, Количество: ${item.quantity}, Цена: ${item.price}, Поставщик: ${item.supplier}\n`;
  });
  reportText += "\nЗаявки на ремонт\n\n";
  repairRequests.forEach(item => {
      reportText += `ID: ${item.id}, ID инвентаря: ${item.itemId}, Описание: ${item.description}\n`;
  });
  const reportElement = document.createElement("pre");
  reportElement.textContent = reportText;
  reportContainer.appendChild(reportElement)
}

updateInventoryList();
updateAdminInventoryList();
updatePurchaseList();
updateUserInventoryList();
updateUserRequestsList();