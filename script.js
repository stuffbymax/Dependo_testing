
    let games = [];

    async function loadGames() {
      const res = await fetch('https://raw.githubusercontent.com/stuffbymax/game-dependencies-db/main/games.json');
      games = await res.json();
      displayGames(games);
    }

    function displayGames(gameArray) {
      const container = document.getElementById('gameList');
      container.innerHTML = '';

      gameArray.forEach(game => {
        const div = document.createElement('div');
        div.className = 'game';
        div.setAttribute('role', 'listitem');

        div.innerHTML = `
          <img src="${game.image || 'https://via.placeholder.com/150?text=No+Image'}" alt="${game.name} image" />
          <div class="game-info">
            <h2>${game.name}</h2>
            <button class="view-details" aria-label="View details for ${game.name}">View Details</button>
          </div>
        `;

        // Add click listener for modal popup
        div.querySelector('button.view-details').addEventListener('click', () => openModal(game));
        container.appendChild(div);
      });
    }

    // Modal controls
    const modal = document.getElementById('modal');
    const modalTitle = document.getElementById('modalTitle');
    const modalImage = document.getElementById('modalImage');
    const modalDesc = document.getElementById('modalDesc');
    const modalClose = document.getElementById('modalClose');

    function openModal(game) {
      modalTitle.textContent = game.name;
      modalImage.src = game.image || 'https://via.placeholder.com/150?text=No+Image';
      modalImage.alt = `${game.name} image`;
      modalDesc.innerHTML = `
        <p><strong>DirectX:</strong> ${game.directx}</p>
        <p><strong>VC++:</strong> ${game.vcredist.join(', ')}</p>
        <p><strong>.NET:</strong> ${game.dotnet}</p>
        <p><strong>Missing DLLs:</strong> ${game.dlls.join(', ')}</p>
        <p><strong>Fixes:</strong></p>
        <ul>${game.fixes.map(fix => `<li>${fix}</li>`).join('')}</ul>
        <p><strong>Download Links:</strong></p>
        <ul>
          <li><a href="${game.downloads.directx}" target="_blank" rel="noopener noreferrer">DirectX</a></li>
          ${Object.entries(game.downloads.vcredist).map(([year, url]) => `<li><a href="${url}" target="_blank" rel="noopener noreferrer">VC++ ${year}</a></li>`).join('')}
          <li><a href="${game.downloads.dotnet}" target="_blank" rel="noopener noreferrer">.NET Framework</a></li>
        </ul>
      `;

      modal.style.display = 'flex';
      document.body.style.overflow = 'hidden'; // prevent background scroll
      modalClose.focus();
    }

    function closeModal() {
      modal.style.display = 'none';
      document.body.style.overflow = '';
    }

    modalClose.addEventListener('click', closeModal);

    // Close modal on outside click
    window.addEventListener('click', e => {
      if (e.target === modal) closeModal();
    });

    // Close modal on ESC key
    window.addEventListener('keydown', e => {
      if (e.key === 'Escape' && modal.style.display === 'flex') {
        closeModal();
      }
    });

    // Search filter
    document.getElementById('search').addEventListener('input', function () {
      const query = this.value.toLowerCase();
      const filtered = games.filter(g => g.name.toLowerCase().includes(query));
      displayGames(filtered);
    });

    // Light/Dark mode toggle
    const modeToggle = document.getElementById('modeToggle');
    modeToggle.addEventListener('click', () => {
      document.body.classList.toggle('light-mode');
      const isLight = document.body.classList.contains('light-mode');
      modeToggle.textContent = isLight ? 'Dark Mode' : 'Light Mode';
    });

    // Scroll to top button
    const toTopBtn = document.getElementById('toTopBtn');

    window.onscroll = () => {
      if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
        toTopBtn.style.display = 'block';
      } else {
        toTopBtn.style.display = 'none';
      }
    };

    toTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    loadGames();