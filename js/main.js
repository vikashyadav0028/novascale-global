/**
 * NovaScale Global - Agency Core Client Script
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide Icons
  if (window.lucide) {
    window.lucide.createIcons();
  }

  // Mobile Menu Drawer Controls
  const menuBtn = document.getElementById('mobile-menu-btn');
  const closeMenuBtn = document.getElementById('close-menu-btn');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const mobileBackdrop = document.getElementById('mobile-backdrop');

  function openMobileMenu() {
    if (mobileDrawer) {
      mobileDrawer.classList.remove('translate-x-full');
      if (mobileBackdrop) mobileBackdrop.classList.remove('hidden');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeMobileMenu() {
    if (mobileDrawer) {
      mobileDrawer.classList.add('translate-x-full');
      if (mobileBackdrop) mobileBackdrop.classList.add('hidden');
      document.body.style.overflow = 'auto';
    }
  }

  if (menuBtn) menuBtn.addEventListener('click', openMobileMenu);
  if (closeMenuBtn) closeMenuBtn.addEventListener('click', closeMobileMenu);
  if (mobileBackdrop) mobileBackdrop.addEventListener('click', closeMobileMenu);

  // Close mobile drawer on link click
  const drawerLinks = document.querySelectorAll('#mobile-drawer a');
  drawerLinks.forEach(link => {
    link.addEventListener('click', closeMobileMenu);
  });
});
