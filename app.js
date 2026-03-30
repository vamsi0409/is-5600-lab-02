/* add your code here */
document.addEventListener('DOMContentLoaded', () => {
  const stocksData = JSON.parse(stockContent);
  const userData = JSON.parse(userContent);

  const saveButton = document.querySelector('#btnSave');
  const deleteButton = document.querySelector('#btnDelete');

  // Initial render
  generateUserList(userData, stocksData);

  // DELETE USER
  deleteButton.addEventListener('click', (event) => {
    event.preventDefault();

    const userId = document.querySelector('#userID').value;
    const index = userData.findIndex(u => u.id == userId);

    if (index !== -1) {
      userData.splice(index, 1);
      generateUserList(userData, stocksData);

      // Clear UI after delete
      document.querySelector('.portfolio-list').innerHTML = '';
      document.querySelector('.userEntry').reset();
    }
  });

  // SAVE USER
  saveButton.addEventListener('click', (event) => {
    event.preventDefault();

    const id = document.querySelector('#userID').value;

    for (let i = 0; i < userData.length; i++) {
      if (userData[i].id == id) {
        userData[i].user.firstname = document.querySelector('#firstname').value;
        userData[i].user.lastname = document.querySelector('#lastname').value;
        userData[i].user.address = document.querySelector('#address').value;
        userData[i].user.city = document.querySelector('#city').value;
        userData[i].user.email = document.querySelector('#email').value;

        generateUserList(userData, stocksData);
        break;
      }
    }
  });
});


/**
 * Render user list
 */
function generateUserList(users, stocks) {
  const userList = document.querySelector('.user-list');

  userList.innerHTML = '';

  users.forEach(({ user, id }) => {
    const li = document.createElement('li');
    li.innerText = `${user.lastname}, ${user.firstname}`;
    li.setAttribute('id', id);
    userList.appendChild(li);
  });

  userList.onclick = (event) => handleUserListClick(event, users, stocks);
}


/**
 * Handle user click
 */
function handleUserListClick(event, users, stocks) {
  const userId = event.target.id;
  if (!userId) return;

  const user = users.find(u => u.id == userId);

  populateForm(user);
  renderPortfolio(user, stocks);
}


/**
 * Populate form
 */
function populateForm(data) {
  const { user, id } = data;

  document.querySelector('#userID').value = id;
  document.querySelector('#firstname').value = user.firstname;
  document.querySelector('#lastname').value = user.lastname;
  document.querySelector('#address').value = user.address;
  document.querySelector('#city').value = user.city;
  document.querySelector('#email').value = user.email;
}


/**
 * Render portfolio
 */
function renderPortfolio(user, stocks) {
  const container = document.querySelector('.portfolio-list');

  // Keep headers
  container.innerHTML = `
    <h3>Symbol</h3>
    <h3># Shares</h3>
    <h3>Actions</h3>
  `;

  user.portfolio.forEach(({ symbol, owned }) => {
    const symbolEl = document.createElement('p');
    const sharesEl = document.createElement('p');
    const btn = document.createElement('button');

    symbolEl.innerText = symbol;
    sharesEl.innerText = owned;
    btn.innerText = 'View';
    btn.id = symbol;

    container.append(symbolEl, sharesEl, btn);
  });

  // Event delegation for buttons
  container.onclick = (event) => {
    if (event.target.tagName === 'BUTTON') {
      viewStock(event.target.id, stocks);
    }
  };
}


/**
 * View stock details
 */
function viewStock(symbol, stocks) {
  const stock = stocks.find(s => s.symbol == symbol);
  if (!stock) return;

  document.querySelector('#stockName').textContent = stock.name;
  document.querySelector('#stockSector').textContent = stock.sector;
  document.querySelector('#stockIndustry').textContent = stock.subIndustry;
  document.querySelector('#stockAddress').textContent = stock.address;

  document.querySelector('#logo').src = `logos/${symbol}.svg`;
}


