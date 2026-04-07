<template>
  <footer class="kb-footer py-4 mt-auto">
    <div class="container">
      <div class="row align-items-center">
        <div class="col-md-4 mb-3 mb-md-0">
          <div class="d-flex align-items-center gap-2">
            <div class="kb-footer-logo">
              <i class="bi bi-bank2 text-white" style="font-size: 0.9rem;"></i>
            </div>
            <div>
              <div class="text-white fw-bold" style="font-size: 0.95rem;">KB 가계부</div>
              <div style="font-size: 0.72rem; color: rgba(255,255,255,0.5);">국민은행 스마트 가계부</div>
            </div>
          </div>
        </div>
        <div class="col-md-4 text-md-center mb-3 mb-md-0">
          <div class="d-flex justify-content-md-center gap-3">
            <a href="#" class="footer-link">이용약관</a>
            <a href="#" class="footer-link">개인정보처리방침</a>
            <a href="#" class="footer-link">고객센터</a>
          </div>
        </div>
        <div class="col-md-4 text-md-end">
          <p class="mb-0" style="font-size: 0.78rem; color: rgba(255,255,255,0.4);">
            © 2024 KB국민은행. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.kb-footer-logo {
  width: 32px;
  height: 32px;
  background: linear-gradient(135deg, var(--kb-orange), var(--kb-orange-dark));
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.footer-link {
  color: rgba(255,255,255,0.6);
  text-decoration: none;
  font-size: 0.8rem;
  transition: color 0.2s;
}
.footer-link:hover {
  color: var(--kb-orange);
}
</style>
