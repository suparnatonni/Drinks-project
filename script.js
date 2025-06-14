  const drinkList = document.getElementById('drinkList');
  const groupList = document.getElementById('groupList');
  const countEl = document.getElementById('count');
  const modalTitle = document.getElementById('modalTitle');
  const modalContent = document.getElementById('modalContent');
  let group = [];

  
  fetchDefaultDrinks();

  function fetchDefaultDrinks() {
    fetch('https://www.thecocktaildb.com/api/json/v1/1/search.php?f=a')
      .then(res => res.json())
      .then(data => {
        const first8 = data.drinks ? data.drinks.slice(0, 8) : [];
        displayDrinks(first8);
      });
  }

  
  function searchDrink() {
    const term = document.getElementById('search').value.trim();
    if (!term) return;

    fetch(`https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${term}`)
      .then(res => res.json())
      .then(data => {
        if (data.drinks) displayDrinks(data.drinks);
        else drinkList.innerHTML = '<p class="text-danger">Not Found</p>';
      });
  }

  
  function displayDrinks(drinks) {
    drinkList.innerHTML = '<div class="row g-3"></div>';
    const row = drinkList.querySelector('.row');

    drinks.forEach(drink => {
      const col = document.createElement('div');
      col.className = 'col-md-4';
      col.innerHTML = `
        <div class="card h-100">
          <img src="${drink.strDrinkThumb}" class="card-img-top">
          <div class="card-body">
            <h6 class="card-title">Name: ${drink.strDrink}</h6>
            <p class="card-text">Category: ${drink.strCategory || 'N/A'}</p>
            <p class="card-text">Instructions: ${(drink.strInstructions || '').substring(0, 15)}...</p>
            <button class="btn btn-outline-primary btn-sm me-2" onclick='addToGroup("${drink.strDrink}", "${drink.strDrinkThumb}")' 
              ${group.find(g => g.name === drink.strDrink) ? "disabled class='btn btn-danger btn-sm'" : ''}>
              ${group.find(g => g.name === drink.strDrink) ? 'Already Selected' : 'Add to Group'}
            </button>
            <button class="btn btn-outline-secondary btn-sm" onclick='showDetails(${drink.idDrink})' data-bs-toggle="modal" data-bs-target="#drinkModal">Details</button>
          </div>
        </div>
      `;
      row.appendChild(col);
    });
  }


  function addToGroup(name, img) {
    if (group.length >= 7) return alert('Maximum 7 drinks allowed!');
    if (!group.find(g => g.name === name)) {
      group.push({ name, img });
      renderGroup();
    }
  }

  
  function renderGroup() {
    groupList.innerHTML = '';
    group.forEach((item, index) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `<td>${index + 1}</td><td><img src="${item.img}" width="40"></td><td>${item.name}</td>`;
      groupList.appendChild(tr);
    });
    countEl.innerText = group.length;
  }

  function showDetails(id) {
    fetch(`https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${id}`)
      .then(res => res.json())
      .then(data => {
        const d = data.drinks[0];
        modalTitle.innerText = d.strDrink;
        modalContent.innerHTML = `
          <img src="${d.strDrinkThumb}" class="img-fluid mb-2">
          <p><b>Category:</b>${d.strCategory}</p>
          <p><b>Alcoholic:</b> ${d.strAlcoholic}</p>
          <p><b>Glass:</b> ${d.strGlass}</p>
          <p><b>Instructions:</b> ${d.strInstructions}</p>
          <p><b>Ingredient 1:</b> ${d.strIngredient1 || 'N/A'}</p>
        `;
      });
  }



