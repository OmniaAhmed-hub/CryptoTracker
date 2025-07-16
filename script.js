const API_URL = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false';

const tableBody = document.getElementById('cryptoTable');
const searchInput = document.getElementById('searchInput');
const themeToggle = document.getElementById('themeToggle');

async function fetchCrypto() {
  try {
    const res = await fetch(API_URL);
    const data = await res.json();
    renderTable(data);
    window.cryptoData = data; // store for filtering
  } catch (err) {
    console.error("Failed to fetch data:", err);
  }
}

function renderTable(data) {
  const filterText = searchInput.value.toLowerCase();
  const filtered = data.filter(coin =>
    coin.name.toLowerCase().includes(filterText) ||
    coin.symbol.toLowerCase().includes(filterText)
  );

  tableBody.innerHTML = filtered.map((coin, index) => `
    <tr>
      <td>${index + 1}</td>
      <td>
        <img src="${coin.image}" alt="${coin.name}" width="20" style="vertical-align:middle" />
        ${coin.name} (${coin.symbol.toUpperCase()})
      </td>
      <td>$${coin.current_price.toLocaleString()}</td>
      <td class="${coin.price_change_percentage_24h >= 0 ? 'positive' : 'negative'}">
        ${coin.price_change_percentage_24h.toFixed(2)}%
      </td>
      <td>$${coin.market_cap.toLocaleString()}</td>
      <td>$${coin.total_volume.toLocaleString()}</td>
    </tr>
  `).join('');
}

// Theme toggle
themeToggle.onclick = () => {
  const current = document.documentElement.getAttribute('data-theme');
  const newTheme = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', newTheme);
  themeToggle.textContent = newTheme === 'dark' ? '☀️' : '🌙';
  localStorage.setItem('theme', newTheme);
};

searchInput.addEventListener('input', () => {
  renderTable(window.cryptoData || []);
});

// Load saved theme
window.onload = () => {
  const savedTheme = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);
  themeToggle.textContent = savedTheme === 'dark' ? '☀️' : '🌙';
  fetchCrypto();
  setInterval(fetchCrypto, 60000); // refresh every 60s
};
