const productList = document.querySelector('#product-list');
const productCount = document.querySelector('#product-count');
const searchInput = document.querySelector('#search');
const notice = document.querySelector('#notice');
const emptyState = document.querySelector('#empty-state');
const emptyTitle = document.querySelector('#empty-title');
const emptyDescription = document.querySelector('#empty-description');

const productDialog = document.querySelector('#product-dialog');
const productForm = document.querySelector('#product-form');
const dialogEyebrow = document.querySelector('#dialog-eyebrow');
const dialogTitle = document.querySelector('#dialog-title');
const dialogDescription = document.querySelector('#dialog-description');
const productNameInput = document.querySelector('#product-name');
const productPriceInput = document.querySelector('#product-price');
const saveButton = document.querySelector('#save-product');
const formError = document.querySelector('#form-error');

const deleteDialog = document.querySelector('#delete-dialog');
const deletePreview = document.querySelector('#delete-preview');
const deleteError = document.querySelector('#delete-error');
const confirmDeleteButton = document.querySelector('#confirm-delete');

const rupiah = new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
  maximumFractionDigits: 0,
});

let products = [];
let editingProductId = null;
let deletingProductId = null;

async function request(endpoint, options) {
  const response = await fetch(endpoint, options);
  let payload;

  try {
    payload = await response.json();
  } catch {
    throw new Error('Server mengirim respons yang tidak dapat dibaca.');
  }

  if (!response.ok) {
    throw new Error(payload.message || `Permintaan gagal (${response.status}).`);
  }

  return payload;
}

function showNotice(message) {
  notice.textContent = message;
  notice.hidden = !message;
}

function makeProductCard(product) {
  const card = document.createElement('article');
  card.className = 'product-card';

  const id = document.createElement('p');
  id.className = 'product-id';
  id.textContent = `ID: ${product.id}`;

  const name = document.createElement('h2');
  name.className = 'product-name';
  name.textContent = product.name;
  name.title = product.name;

  const price = document.createElement('p');
  price.className = 'product-price';
  price.textContent = rupiah.format(product.price);

  const actions = document.createElement('div');
  actions.className = 'card-actions';

  const editButton = document.createElement('button');
  editButton.className = 'button button-outline';
  editButton.type = 'button';
  editButton.textContent = 'Edit';
  editButton.setAttribute('aria-label', `Edit ${product.name}`);
  editButton.addEventListener('click', () => openEditDialog(product));

  const deleteButton = document.createElement('button');
  deleteButton.className = 'button button-outline';
  deleteButton.type = 'button';
  deleteButton.textContent = 'Hapus';
  deleteButton.setAttribute('aria-label', `Hapus ${product.name}`);
  deleteButton.addEventListener('click', () => openDeleteDialog(product));

  actions.append(editButton, deleteButton);
  card.append(id, name, price, actions);
  return card;
}

function renderProducts() {
  const query = searchInput.value.trim().toLocaleLowerCase('id');
  const filteredProducts = products.filter((product) =>
    product.name.toLocaleLowerCase('id').includes(query),
  );

  productList.replaceChildren(...filteredProducts.map(makeProductCard));
  productCount.textContent = `Menampilkan ${filteredProducts.length} dari ${products.length} produk`;
  emptyState.hidden = filteredProducts.length > 0;

  if (products.length === 0) {
    emptyTitle.textContent = 'Belum ada produk';
    emptyDescription.textContent = 'Tambahkan produk pertama untuk mulai mengelola inventaris.';
  } else {
    emptyTitle.textContent = 'Produk tidak ditemukan';
    emptyDescription.textContent = 'Coba kata kunci lain atau periksa kembali nama produk.';
  }
}

async function loadProducts() {
  showNotice('');
  productList.setAttribute('aria-busy', 'true');

  try {
    products = await request('/products');
    renderProducts();
  } catch (error) {
    products = [];
    renderProducts();
    showNotice(`Gagal memuat produk: ${error.message}`);
  } finally {
    productList.removeAttribute('aria-busy');
  }
}

function openCreateDialog() {
  editingProductId = null;
  productForm.reset();
  dialogEyebrow.textContent = 'Produk baru';
  dialogTitle.textContent = 'Tambah Produk';
  dialogDescription.textContent = 'Masukkan informasi produk baru.';
  saveButton.textContent = 'Simpan Produk';
  formError.hidden = true;
  productDialog.showModal();
  productNameInput.focus();
}

function openEditDialog(product) {
  editingProductId = product.id;
  productForm.reset();
  productNameInput.value = product.name;
  productPriceInput.value = String(product.price);
  dialogEyebrow.textContent = `ID: ${product.id}`;
  dialogTitle.textContent = 'Edit Produk';
  dialogDescription.textContent = 'Perbarui informasi produk yang dipilih.';
  saveButton.textContent = 'Simpan Perubahan';
  formError.hidden = true;
  productDialog.showModal();
  productNameInput.focus();
}

function openDeleteDialog(product) {
  deletingProductId = product.id;
  deleteError.hidden = true;
  deletePreview.replaceChildren();

  const id = document.createElement('p');
  id.className = 'product-id';
  id.textContent = `ID: ${product.id}`;

  const name = document.createElement('p');
  name.className = 'product-name';
  name.textContent = product.name;

  const price = document.createElement('p');
  price.className = 'product-price';
  price.textContent = rupiah.format(product.price);

  deletePreview.append(id, name, price);
  deleteDialog.showModal();
}

function closeProductDialog() {
  productDialog.close();
}

productForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  formError.hidden = true;
  saveButton.disabled = true;

  const product = {
    name: productNameInput.value.trim(),
    price: Number(productPriceInput.value),
  };
  const isEditing = editingProductId !== null;

  if (isEditing) {
    product.id = editingProductId;
  }

  try {
    await request('/products', {
      method: isEditing ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product),
    });
    closeProductDialog();
    await loadProducts();
  } catch (error) {
    formError.textContent = `Gagal menyimpan produk: ${error.message}`;
    formError.hidden = false;
  } finally {
    saveButton.disabled = false;
  }
});

confirmDeleteButton.addEventListener('click', async () => {
  if (deletingProductId === null) {
    return;
  }

  deleteError.hidden = true;
  confirmDeleteButton.disabled = true;

  try {
    await request(`/products/${deletingProductId}`, { method: 'DELETE' });
    deleteDialog.close();
    await loadProducts();
  } catch (error) {
    deleteError.textContent = `Gagal menghapus produk: ${error.message}`;
    deleteError.hidden = false;
  } finally {
    confirmDeleteButton.disabled = false;
  }
});

document.querySelector('#add-product').addEventListener('click', openCreateDialog);
document.querySelector('#close-dialog').addEventListener('click', closeProductDialog);
document.querySelector('#cancel-dialog').addEventListener('click', closeProductDialog);
document.querySelector('#close-delete-dialog').addEventListener('click', () => deleteDialog.close());
document.querySelector('#cancel-delete').addEventListener('click', () => deleteDialog.close());
searchInput.addEventListener('input', renderProducts);

productDialog.addEventListener('click', (event) => {
  if (event.target === productDialog) {
    closeProductDialog();
  }
});

deleteDialog.addEventListener('click', (event) => {
  if (event.target === deleteDialog) {
    deleteDialog.close();
  }
});

loadProducts();
