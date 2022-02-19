//Storage controller
const StorageCtrl = (function () {
  //publiic
  return {
    storeItem: function (item) {
      let calitems;
      //check if any items in locale Storage
      if (localStorage.getItem("calitems") === null) {
        calitems = [];
        calitems.push(item);
        localStorage.setItem("calitems", JSON.stringify(calitems));
      } else {
        calitems = JSON.parse(localStorage.getItem("calitems"));
        //push new item
        calitems.push(item);
        // re set locale storage
        localStorage.setItem("calitems", JSON.stringify(calitems));
      }
    },
    getItemFromStorage: function () {
      let calitems;
      if (localStorage.getItem("calitems") === null) {
        calitems = [];
      } else {
        calitems = JSON.parse(localStorage.getItem("calitems"));
      }
      return calitems;
    },
    updateItemStorage: function (updatedInput) {
      let calitems = JSON.parse(localStorage.getItem("calitems"));
      calitems.forEach(function (item, index) {
        if (updatedInput.id === item.id) {
          calitems.splice(index, 1, updatedInput);
        }
      });
      localStorage.setItem("calitems", JSON.stringify(calitems));
    },
    deleteItemFromStorage: function (id) {
      let calitems = JSON.parse(localStorage.getItem("calitems"));
      calitems.forEach((item, index) => {
        if (item.id === id) {
          calitems.splice(index, 1);
        }
      });
      localStorage.setItem("calitems", JSON.stringify(calitems));
    },
    clearItemFromStorage: function(){
        localStorage.removeItem("calitems");
    }
  };
})();

//Items controller
const ItemCtrl = (function () {
  //item constructor
  const Item = function (id, name, calories) {
    this.id = id;
    this.name = name;
    this.calories = calories;
  };
  //state
  const data = {
    items: StorageCtrl.getItemFromStorage(),
    currentItem: null,
    totalCalories: 0,
  };
  return {
    getItem: function () {
      return data.items;
    },
    addItem: function (name, calories) {
      let ID = 0;
      if (data.items.length > 0) {
        ID = data.items[data.items.length - 1].id + 1;
      } else ID = 0;

      calories = parseInt(calories);
      newItem = new Item(ID, name, calories);
      data.items.push(newItem);
      return newItem;
    },
    getItemById: function (id) {
      let found = null;
      data.items.forEach(function (item) {
        if (item.id == id) {
          found = item;
        }
      });
      return found;
    },
    updateItem: function (name, calories) {
      calories = parseInt(calories);

      let found2 = null;
      data.items.forEach(function (item) {
        if (item.id === data.currentItem.id) {
          item.name = name;
          item.calories = calories;
          found2 = item;
        }
      });
      return found2;
    },
    deleteItem: function (id) {
      const ids = data.items.map(function (item) {
        return item.id;
      });
      const index = ids.indexOf(id);

      data.items.splice(index, 1);
    },
    clearAllItems: function () {
      data.items = [];
    },
    setCurrentItem: function (item) {
      data.currentItem = item;
    },
    getCurrentItem: function () {
      return data.currentItem;
    },
    getTotalCalories: function () {
      let totalCal = 0;
      data.items.forEach(function (item) {
        totalCal += item.calories;
      });
      data.totalCalories = totalCal;
      return data.totalCalories;
    },
    logData: function () {
      return data;
    },
  };
})();

//UI controller
const UICtrl = (function () {
  const UIselectors = {
    itemList: "#item-list",
    addBtn: ".add-btn",
    updateBtn: ".update-btn",
    deleteBtn: ".delete-btn",
    backBtn: ".back-btn",
    itemName: "#item-name",
    itemCalories: "#item-calories",
    totalCalories: ".total-calories",
    listItems: "#item-list li",
    clearBtn: ".clear-btn",
  };
  return {
    populateItemList: function (items) {
      let html = "";
      items.forEach(function (item) {
        html += ` <li class="collection-item" id="item-${item.id}">
              <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
              <a href="#" class="secondary-content">
                <i class="edit-item fa fa-pencil"></i>
              </a>
            </li>`;
      });
      //insert list item
      document.querySelector(UIselectors.itemList).innerHTML = html;
    },
    getItemInput: function () {
      return {
        name: document.querySelector(UIselectors.itemName).value,
        calories: document.querySelector(UIselectors.itemCalories).value,
      };
    },
    addListItem: function (item) {
      document.querySelector(UIselectors.itemList).style.display = "block";
      const li = document.createElement("li");
      li.className = "collection-item";
      li.id = `item-${item.id}`;

      li.innerHTML = `
        <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
        <a href="#" class="secondary-content">
          <i class="edit-item fa fa-pencil"></i>
        </a>
        `;
      document
        .querySelector(UIselectors.itemList)
        .insertAdjacentElement("beforeend", li);
    },
    updateListItem: function (item) {
      let listItems = document.querySelectorAll(UIselectors.listItems);
      listItems = Array.from(listItems);
      listItems.forEach(function (listItem) {
        const itemId = listItem.getAttribute("id");
        if (itemId === `item-${item.id}`) {
          document.querySelector(`#${itemId}`).innerHTML = `
            <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
            <a href="#" class="secondary-content">
              <i class="edit-item fa fa-pencil"></i>
            </a>
            
            `;
        }
      });
    },
    deleteListItem: function (id) {
      const itemId = `#item-${id}`;
      const item = document.querySelector(itemId);
      item.remove();
    },
    showTotalCalories: function (totalCal) {
      document.querySelector(UIselectors.totalCalories).textContent =
        totalCal.toString();
    },

    clearInputs: function () {
      document.querySelector(UIselectors.itemName).value = "";
      document.querySelector(UIselectors.itemCalories).value = "";
    },
    addItemToForm: function () {
      document.querySelector(UIselectors.itemName).value =
        ItemCtrl.getCurrentItem().name;
      document.querySelector(UIselectors.itemCalories).value =
        ItemCtrl.getCurrentItem().calories;
      UICtrl.showEditStates();
    },
    removeItems: function () {
      let listItems = document.querySelectorAll(UIselectors.listItems);
      listItems = Array.from(listItems);
      listItems.forEach(function (item) {
        item.remove();
      });
    },
    hideList: function () {
      document.querySelector(UIselectors.itemList).style.display = "none";
    },
    clearEditState: function () {
      UICtrl.clearInputs();
      document.querySelector(UIselectors.updateBtn).style.display = "none";
      document.querySelector(UIselectors.backBtn).style.display = "none";
      document.querySelector(UIselectors.deleteBtn).style.display = "none";
      document.querySelector(UIselectors.addBtn).style.display = "inline";
    },
    showEditStates: function () {
      document.querySelector(UIselectors.updateBtn).style.display = "inline";
      document.querySelector(UIselectors.backBtn).style.display = "inline";
      document.querySelector(UIselectors.deleteBtn).style.display = "inline";
      document.querySelector(UIselectors.addBtn).style.display = "none";
    },
    getSelectors: function () {
      return UIselectors;
    },
  };
})();

//App controller
const AppCtrl = (function (ItemCtrl, UICtrl, storageCtrl) {
  const loadEvents = function () {
    const UISelectors = UICtrl.getSelectors();

    document
      .querySelector(UISelectors.addBtn)
      .addEventListener("click", itemAddSubmit);
    //disable submit on enter
    document.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        return false;
      }
    });
    //Edit icon click
    document
      .querySelector(UISelectors.itemList)
      .addEventListener("click", itemEditClick);
    document
      .querySelector(UISelectors.updateBtn)
      .addEventListener("click", itemUpdateSubmit);
    document
      .querySelector(UISelectors.deleteBtn)
      .addEventListener("click", itemDeleteSubmit);
    document
      .querySelector(UISelectors.backBtn)
      .addEventListener("click", UICtrl.clearEditState);
    document
      .querySelector(UISelectors.clearBtn)
      .addEventListener("click", clearAll);
  };
  const itemAddSubmit = function (e) {
    const input = UICtrl.getItemInput();
    if (input.name !== "" && input.calories !== "") {
      const newItem = ItemCtrl.addItem(input.name, input.calories);
      UICtrl.addListItem(newItem);
      const totalCalories = ItemCtrl.getTotalCalories();
      UICtrl.showTotalCalories(totalCalories);

      //store in localeStorage
      StorageCtrl.storeItem(newItem);

      UICtrl.clearInputs();
    }

    e.preventDefault();
  };
  const itemEditClick = function (e) {
    if (e.target.classList.contains("edit-item")) {
      //get list item ID
      const listid = e.target.parentNode.parentNode.id;
      //break into an array
      const listIdArray = listid.split("-");
      //get actual id
      const actualId = parseInt(listIdArray[1]);
      //get item
      const getItemToedit = ItemCtrl.getItemById(actualId);
      //set current item
      ItemCtrl.setCurrentItem(getItemToedit);
      //add item to form
      UICtrl.addItemToForm();
    }
    e.preventDefault();
  };
  const itemUpdateSubmit = function (e) {
    const input = UICtrl.getItemInput();
    const updatedInput = ItemCtrl.updateItem(input.name, input.calories);
    UICtrl.updateListItem(updatedInput);
    const totalCalories = ItemCtrl.getTotalCalories();
    UICtrl.showTotalCalories(totalCalories);
    //Update locale Storage
    StorageCtrl.updateItemStorage(updatedInput);
    UICtrl.clearEditState();

    e.preventDefault();
  };
  const itemDeleteSubmit = function (e) {
    const currItem = ItemCtrl.getCurrentItem();
    ItemCtrl.deleteItem(currItem.id);
    //delete from ui
    UICtrl.deleteListItem(currItem.id);
    const totalCalories = ItemCtrl.getTotalCalories();
    UICtrl.showTotalCalories(totalCalories);
    StorageCtrl.deleteItemFromStorage(currItem.id);
    UICtrl.clearEditState();
    e.preventDefault();
  };
  const clearAll = function (e) {
    ItemCtrl.clearAllItems();
    const totalCalories = ItemCtrl.getTotalCalories();
    UICtrl.showTotalCalories(totalCalories);
    // UICtrl.clearEditState();
    //remove from UI elements
    UICtrl.removeItems();
    //remove from ls 
    StorageCtrl.clearItemFromStorage();
    UICtrl.hideList();
  };
  return {
    init: function () {
      //set initial state
      UICtrl.clearEditState();
      const items = ItemCtrl.getItem();

      if (items.length == 0) {
        UICtrl.hideList();
      } else {
        UICtrl.populateItemList(items);
      }
      const totalCalories = ItemCtrl.getTotalCalories();
      UICtrl.showTotalCalories(totalCalories);

      loadEvents();
    },
  };
})(ItemCtrl, UICtrl, StorageCtrl);

AppCtrl.init();
