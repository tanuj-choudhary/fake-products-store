// MODEL
const Model = (() => {
  let products = [];

  return {
    fetchProducts: async function getProducts() {
      const res = await axios.get('https://fakestoreapi.com/products');
      return res.data;
    },

    getProducts: function () {
      return products;
    },

    setProducts: function (productsData) {
      products = productsData;
    },
  };
})();

// VIEW
const UI = (() => {
  const inputBox = document.querySelector('.search-box-input');
  const productsList = document.querySelector('.products-list');

  function getProductHTML(product, index) {
    return `<div>${index}.</div> ${product.title}`;
  }

  return {
    getDOMElements: function () {
      return {
        inputBox,
        productsList,
      };
    },

    renderProducts: function (products) {
      // Remove products List
      productsList.innerHTML = '';

      // If no products found
      if (products.length === 0) {
        productsList.textContent = 'No Products found';
        return;
      }

      // Render Products
      products.map((product, index) => {
        const productElem = document.createElement('li');
        productElem.innerHTML = getProductHTML(product, index + 1);
        productElem.id = `product-${product.id}`;
        productsList.appendChild(productElem);
      });
    },
  };
})();

// CONTROLLER
const Controller = (() => {
  const { inputBox } = UI.getDOMElements();

  async function setInitialProducts() {
    const products = await Model.fetchProducts();
    Model.setProducts(products);
    UI.renderProducts(products);
  }

  function onSearchInputChange(e) {
    // Get search query
    const searchValue = e.target.value;
    searchValue.toLowerCase();

    // Get products
    const products = Model.getProducts();

    // Filter Products with search value
    const productsWithSearchValue = products.filter((product) =>
      product.title.toLowerCase().includes(searchValue)
    );

    // Render Products
    UI.renderProducts(productsWithSearchValue);
  }

  function setupEventListeners() {
    inputBox.addEventListener('input', onSearchInputChange);
  }

  return {
    init: function () {
      setInitialProducts();
      setupEventListeners();
    },
  };
})();

Controller.init();
