/**
 * Product Catalog Section — Custom web component
 * Handles view toggle (list/compact) and integrates with Dawn's facets.js
 */

if (!customElements.get('product-catalog-section')) {
  class ProductCatalogSection extends HTMLElement {
    constructor() {
      super();
      this.viewMode = sessionStorage.getItem('product-catalog-view') || this.dataset.defaultView || 'list';
      this.listContainer = null;
      this.viewButtons = null;
    }

    connectedCallback() {
      this.listContainer = this.querySelector('[data-product-list]');
      this.viewButtons = this.querySelectorAll('[data-view-btn]');

      // Apply initial view
      this.setView(this.viewMode, false);

      // Bind view toggle buttons
      this.viewButtons.forEach((btn) => {
        btn.addEventListener('click', () => {
          this.setView(btn.dataset.viewBtn);
        });
      });

      // Re-apply view after facets.js swaps content via AJAX
      this.observeGridChanges();
    }

    setView(mode, save = true) {
      this.viewMode = mode;
      if (save) {
        sessionStorage.setItem('product-catalog-view', mode);
      }

      // Update list container class
      if (this.listContainer) {
        this.listContainer.classList.toggle('product-catalog__list--compact', mode === 'compact');
        this.listContainer.classList.toggle('product-catalog__list--list', mode === 'list');
      }

      // Update active state on buttons
      this.viewButtons.forEach((btn) => {
        btn.classList.toggle('product-catalog__view-btn--active', btn.dataset.viewBtn === mode);
      });

      // Show/hide appropriate product elements
      const listItems = this.querySelectorAll('[data-view-list]');
      const compactItems = this.querySelectorAll('[data-view-compact]');

      listItems.forEach((el) => {
        el.style.display = mode === 'list' ? '' : 'none';
      });

      compactItems.forEach((el) => {
        el.style.display = mode === 'compact' ? '' : 'none';
      });
    }

    observeGridChanges() {
      const gridContainer = document.getElementById('ProductGridContainer');
      if (!gridContainer) return;

      const observer = new MutationObserver(() => {
        // Re-query elements after AJAX swap
        this.listContainer = this.querySelector('[data-product-list]');
        this.viewButtons = this.querySelectorAll('[data-view-btn]');
        // Re-bind view toggle
        this.viewButtons.forEach((btn) => {
          btn.addEventListener('click', () => {
            this.setView(btn.dataset.viewBtn);
          });
        });
        // Re-apply current view
        this.setView(this.viewMode, false);
      });

      observer.observe(gridContainer, { childList: true, subtree: false });
    }
  }

  customElements.define('product-catalog-section', ProductCatalogSection);
}
