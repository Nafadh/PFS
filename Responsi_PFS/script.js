// Data Game - disimpan di localStorage
let games = JSON.parse(localStorage.getItem('games')) || [];
let currentEditId = null;
let gameToDelete = null;

// DOM Elements
const gameForm = document.getElementById('game-form');
const gameList = document.getElementById('game-list');
const emptyState = document.getElementById('empty-state');
const deleteModal = document.getElementById('delete-modal');
const cancelDeleteBtn = document.getElementById('cancel-delete');
const confirmDeleteBtn = document.getElementById('confirm-delete');
const closeModalBtn = document.querySelector('.close-modal');
const formTitle = document.getElementById('form-title');
const submitBtn = document.getElementById('submit-btn');
const resetBtn = document.getElementById('reset-btn');

// Event Listeners
document.addEventListener('DOMContentLoaded', renderGames);
gameForm.addEventListener('submit', handleFormSubmit);
resetBtn.addEventListener('click', resetForm);
cancelDeleteBtn.addEventListener('click', closeDeleteModal);
confirmDeleteBtn.addEventListener('click', confirmDelete);
closeModalBtn.addEventListener('click', closeDeleteModal);

// Fungsi untuk merender daftar game
function renderGames() {
    gameList.innerHTML = '';
    
    if (games.length === 0) {
        emptyState.style.display = 'block';
        return;
    }
    
    emptyState.style.display = 'none';
    
    games.forEach(game => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${game.nama}</td>
            <td>${game.genre}</td>
            <td>${game.platform}</td>
            <td>${game.tahun}</td>
            <td>${game.developer}</td>
            <td class="actions">
                <button class="btn btn-warning btn-sm edit-btn" data-id="${game.id}">
                    <i class="fas fa-edit"></i> Edit
                </button>
                <button class="btn btn-danger btn-sm delete-btn" data-id="${game.id}">
                    <i class="fas fa-trash"></i> Hapus
                </button>
            </td>
        `;
        gameList.appendChild(row);
    });
    // Tambahkan event listener untuk tombol edit dan hapus
    document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', () => editGame(btn.dataset.id));
    });
    
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', () => openDeleteModal(btn.dataset.id));
    });
}

// Fungsi untuk menangani submit form
function handleFormSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(gameForm);
    const gameData = {
        id: currentEditId || Date.now().toString(),
        nama: formData.get('nama'),
        genre: formData.get('genre'),
        platform: formData.get('platform'),
        tahun: formData.get('tahun'),
        developer: formData.get('developer')
    };
    
    if (currentEditId) {
        // Update game yang sudah ada
        const index = games.findIndex(game => game.id === currentEditId);
        if (index !== -1) {
            games[index] = gameData;
        }
    } else {
        // Tambah game baru
        games.push(gameData);
    }
    
    // Simpan ke localStorage
    localStorage.setItem('games', JSON.stringify(games));
    
    // Reset form dan render ulang daftar
    resetForm();
    renderGames();
}

// Fungsi untuk mengedit game
function editGame(id) {
    const game = games.find(game => game.id === id);
    if (game) {
        document.getElementById('nama').value = game.nama;
        document.getElementById('genre').value = game.genre;
        document.getElementById('platform').value = game.platform;
        document.getElementById('tahun').value = game.tahun;
        document.getElementById('developer').value = game.developer;
        
        currentEditId = id;
        formTitle.textContent = 'Edit Game';
        submitBtn.textContent = 'Update Game';
    }
}

// Fungsi untuk membuka modal konfirmasi hapus
function openDeleteModal(id) {
    gameToDelete = id;
    deleteModal.style.display = 'flex';
}

// Fungsi untuk menutup modal konfirmasi hapus
function closeDeleteModal() {
    deleteModal.style.display = 'none';
    gameToDelete = null;
}

// Fungsi untuk mengkonfirmasi penghapusan
function confirmDelete() {
    if (gameToDelete) {
        games = games.filter(game => game.id !== gameToDelete);
        localStorage.setItem('games', JSON.stringify(games));
        renderGames();
        closeDeleteModal();
    }
}

// Fungsi untuk mereset form
function resetForm() {
    gameForm.reset();
    currentEditId = null;
    formTitle.textContent = 'Tambah Game Baru';
    submitBtn.textContent = 'Tambah Game';
}