class NotFoundView {
  render() {
    return `
      <div class="not-found-container" style="
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        min-height: 80vh;
        text-align: center;
        padding: 2rem;
      ">
        <div class="not-found-icon" style="
          font-size: 6rem;
          color: #2563eb;
          margin-bottom: 1rem;
        ">
          <i class="fas fa-exclamation-circle"></i>
        </div>
        <h1 style="
          font-size: 2.5rem;
          color: #1e40af;
          margin-bottom: 1rem;
        ">404 - Halaman Tidak Ditemukan</h1>
        <p style="
          font-size: 1.2rem;
          color: #4b5563;
          margin-bottom: 2rem;
          max-width: 600px;
        ">Maaf, halaman yang Anda cari tidak dapat ditemukan. Silakan periksa URL atau kembali ke halaman utama.</p>
        <a href="#/" class="back-home-btn" style="
          background-color: #2563eb;
          color: white;
          padding: 0.75rem 1.5rem;
          border-radius: 0.5rem;
          text-decoration: none;
          font-weight: 500;
          transition: background-color 0.2s;
        " onmouseover="this.style.backgroundColor='#1d4ed8'" onmouseout="this.style.backgroundColor='#2563eb'">
          <i class="fas fa-home"></i> Kembali ke Beranda
        </a>
      </div>
    `;
  }
}

export default NotFoundView; 