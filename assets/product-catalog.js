/**
 * Product Catalog Section — Custom web component
 * Handles search, filter (category + price), sort, view toggle
 * All filtering is client-side to match the Next.js prototype behavior
 */

if (!customElements.get('product-catalog-section')) {
  class ProductCatalogSection extends HTMLElement {
    constructor() {
      super();
      this.viewMode = sessionStorage.getItem('product-catalog-view') || this.dataset.defaultView || 'list';
      this.searchQuery = '';
      this.selectedCategories = new Set();
      this.priceMin = 0;
      this.priceMax = Infinity;
      this.sortBy = 'best-selling';
    }

    connectedCallback() {
      this.productItems = this.querySelectorAll('[data-product-item]');
      this.compactItems = this.querySelectorAll('[data-compact-item]');
      this.listContainer = this.querySelector('[data-product-list]');
      this.countEl = this.querySelector('[data-product-count]');
      this.totalCount = this.productItems.length;

      // Parse product data from DOM
      this.products = [];
      this.productItems.forEach((item, i) => {
        this.products.push({
          listEl: item,
          compactEl: this.compactItems[i],
          title: (item.dataset.title || '').toLowerCase(),
          category: (item.dataset.category || '').toLowerCase(),
          sku: (item.dataset.sku || '').toLowerCase(),
          price: parseFloat(item.dataset.price) || 0,
          tags: (item.dataset.tags || '').toLowerCase(),
        });
      });

      // Compute global price range
      const prices = this.products.map(p => p.price).filter(p => p > 0);
      this.globalPriceMax = prices.length ? Math.ceil(Math.max(...prices)) : 0;
      this.priceMax = this.globalPriceMax;

      // Build category counts
      this.categoryCounts = {};
      this.products.forEach(p => {
        if (p.category) {
          const cat = p.category;
          this.categoryCounts[cat] = (this.categoryCounts[cat] || 0) + 1;
        }
      });

      this.initSearch();
      this.initViewToggle();
      this.initSort();
      this.initPriceFilter();
      this.initCategoryFilter();
      this.initMobileFilter();
      this.initFilterReset();
      this.setView(this.viewMode, false);
      this.applyFilters();
    }

    // --- Search ---
    initSearch() {
      const searchInput = this.querySelector('[data-search-input]');
      if (!searchInput) return;
      let debounceTimer;
      searchInput.addEventListener('input', () => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
          this.searchQuery = searchInput.value.toLowerCase().trim();
          this.applyFilters();
        }, 200);
      });
    }

    // --- View Toggle ---
    initViewToggle() {
      const btns = this.querySelectorAll('[data-view-btn]');
      btns.forEach(btn => {
        btn.addEventListener('click', () => this.setView(btn.dataset.viewBtn));
      });
    }

    setView(mode, save = true) {
      this.viewMode = mode;
      if (save) sessionStorage.setItem('product-catalog-view', mode);

      if (this.listContainer) {
        this.listContainer.classList.toggle('product-catalog__list--compact', mode === 'compact');
      }

      this.querySelectorAll('[data-view-btn]').forEach(btn => {
        btn.classList.toggle('product-catalog__view-btn--active', btn.dataset.viewBtn === mode);
      });
    }

    // --- Sort ---
    initSort() {
      const sortSelect = this.querySelector('[data-sort-select]');
      if (!sortSelect) return;
      sortSelect.addEventListener('change', () => {
        this.sortBy = sortSelect.value;
        this.applyFilters();
      });
    }

    // --- Price Filter ---
    initPriceFilter() {
      this.priceMinSlider = this.querySelector('[data-price-min]');
      this.priceMaxSlider = this.querySelector('[data-price-max]');
      this.priceMinDisplay = this.querySelector('[data-price-min-display]');
      this.priceMaxDisplay = this.querySelector('[data-price-max-display]');
      this.priceTrackActive = this.querySelector('[data-price-track-active]');

      if (!this.priceMinSlider || !this.priceMaxSlider) return;

      // Set initial slider values
      this.priceMinSlider.max = this.globalPriceMax;
      this.priceMaxSlider.max = this.globalPriceMax;
      this.priceMinSlider.value = 0;
      this.priceMaxSlider.value = this.globalPriceMax;

      if (this.priceMinDisplay) this.priceMinDisplay.textContent = '$0';
      if (this.priceMaxDisplay) this.priceMaxDisplay.textContent = '$' + this.formatNumber(this.globalPriceMax);

      // Also update the bottom static labels
      const priceMaxLabel = this.querySelector('[data-price-max-label]');
      if (priceMaxLabel) priceMaxLabel.textContent = '$' + this.formatNumber(this.globalPriceMax);

      this.updatePriceTrack();

      const onPriceChange = () => {
        let min = parseInt(this.priceMinSlider.value);
        let max = parseInt(this.priceMaxSlider.value);
        if (min > max) {
          [min, max] = [max, min];
        }
        this.priceMin = min;
        this.priceMax = max;
        if (this.priceMinDisplay) this.priceMinDisplay.textContent = '$' + this.formatNumber(min);
        if (this.priceMaxDisplay) this.priceMaxDisplay.textContent = '$' + this.formatNumber(max);
        this.updatePriceTrack();
        this.applyFilters();
      };

      this.priceMinSlider.addEventListener('input', onPriceChange);
      this.priceMaxSlider.addEventListener('input', onPriceChange);
    }

    updatePriceTrack() {
      if (!this.priceTrackActive || !this.priceMinSlider || !this.priceMaxSlider) return;
      const max = this.globalPriceMax || 1;
      const minPercent = (parseInt(this.priceMinSlider.value) / max) * 100;
      const maxPercent = (parseInt(this.priceMaxSlider.value) / max) * 100;
      this.priceTrackActive.style.left = minPercent + '%';
      this.priceTrackActive.style.width = (maxPercent - minPercent) + '%';
    }

    // --- Category Filter ---
    initCategoryFilter() {
      const checkboxes = this.querySelectorAll('[data-category-checkbox]');
      checkboxes.forEach(cb => {
        cb.addEventListener('change', () => {
          const cat = cb.value.toLowerCase();
          if (cb.checked) {
            this.selectedCategories.add(cat);
          } else {
            this.selectedCategories.delete(cat);
          }
          this.applyFilters();
          this.updateFilterCount();
        });
      });

      // Category search
      const catSearch = this.querySelector('[data-category-search]');
      if (catSearch) {
        catSearch.addEventListener('input', () => {
          const q = catSearch.value.toLowerCase();
          this.querySelectorAll('[data-category-item]').forEach(item => {
            const name = item.dataset.categoryItem.toLowerCase();
            item.style.display = name.includes(q) ? '' : 'none';
          });
        });
      }
    }

    // --- Filter Reset ---
    initFilterReset() {
      const resetBtn = this.querySelector('[data-filter-reset]');
      if (!resetBtn) return;
      resetBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.searchQuery = '';
        this.selectedCategories.clear();
        this.priceMin = 0;
        this.priceMax = this.globalPriceMax;

        // Reset DOM
        const searchInput = this.querySelector('[data-search-input]');
        if (searchInput) searchInput.value = '';
        this.querySelectorAll('[data-category-checkbox]').forEach(cb => { cb.checked = false; });
        if (this.priceMinSlider) this.priceMinSlider.value = 0;
        if (this.priceMaxSlider) this.priceMaxSlider.value = this.globalPriceMax;
        if (this.priceMinDisplay) this.priceMinDisplay.textContent = '$0';
        if (this.priceMaxDisplay) this.priceMaxDisplay.textContent = '$' + this.formatNumber(this.globalPriceMax);
        this.updatePriceTrack();
        this.updateFilterCount();
        this.applyFilters();
      });
    }

    // --- Mobile filter ---
    initMobileFilter() {
      const openBtn = this.querySelector('[data-mobile-filter-open]');
      const closeBtn = this.querySelector('[data-mobile-filter-close]');
      const overlay = this.querySelector('[data-mobile-filter-overlay]');
      const sidebar = this.querySelector('[data-mobile-filter-sidebar]');

      if (openBtn && sidebar) {
        openBtn.addEventListener('click', () => {
          sidebar.classList.add('product-catalog__sidebar-mobile--open');
          if (overlay) overlay.classList.add('product-catalog__sidebar-overlay--open');
          document.body.style.overflow = 'hidden';
        });
      }

      const closeMobile = () => {
        if (sidebar) sidebar.classList.remove('product-catalog__sidebar-mobile--open');
        if (overlay) overlay.classList.remove('product-catalog__sidebar-overlay--open');
        document.body.style.overflow = '';
      };

      if (closeBtn) closeBtn.addEventListener('click', closeMobile);
      if (overlay) overlay.addEventListener('click', closeMobile);
    }

    // --- Apply Filters + Sort ---
    applyFilters() {
      // 1) Sort products
      this.sortProducts();

      // 2) Reorder DOM elements according to sorted order
      const container = this.querySelector('[data-products-container]');
      const compactHeader = this.querySelector('.product-catalog__compact-header');
      if (container) {
        this.products.forEach(product => {
          if (product.listEl) container.appendChild(product.listEl);
          if (product.compactEl) container.appendChild(product.compactEl);
        });
        // Keep pagination at the end
        const pagination = container.querySelector('.pagination-wrapper, nav.pagination');
        if (pagination) container.appendChild(pagination);
        // Keep compact header at the top
        if (compactHeader) container.insertBefore(compactHeader, container.firstChild);
      }

      // 3) Filter visibility
      let visibleCount = 0;

      this.products.forEach(product => {
        let visible = true;

        // Search filter
        if (this.searchQuery) {
          const q = this.searchQuery;
          if (!product.title.includes(q) && !product.sku.includes(q) && !product.category.includes(q) && !product.tags.includes(q)) {
            visible = false;
          }
        }

        // Category filter
        if (visible && this.selectedCategories.size > 0) {
          if (!this.selectedCategories.has(product.category)) {
            visible = false;
          }
        }

        // Price filter
        if (visible) {
          if (product.price < this.priceMin || product.price > this.priceMax) {
            visible = false;
          }
        }

        // Apply visibility
        if (product.listEl) product.listEl.dataset.hidden = !visible;
        if (product.compactEl) product.compactEl.dataset.hidden = !visible;

        if (visible) visibleCount++;
      });

      // Update count
      if (this.countEl) {
        if (visibleCount === this.totalCount) {
          this.countEl.innerHTML = '<strong>' + visibleCount + '</strong> products';
        } else {
          this.countEl.innerHTML = '<strong>' + visibleCount + '</strong> of ' + this.totalCount + ' products';
        }
      }

      // Show/hide empty state
      const emptyEl = this.querySelector('[data-empty-state]');
      const productsContainer = this.querySelector('[data-products-container]');
      if (emptyEl && productsContainer) {
        if (visibleCount === 0) {
          emptyEl.style.display = '';
          productsContainer.style.display = 'none';
        } else {
          emptyEl.style.display = 'none';
          productsContainer.style.display = '';
        }
      }
    }

    sortProducts() {
      const sortBy = this.sortBy;
      this.products.sort((a, b) => {
        switch (sortBy) {
          case 'title-ascending':
            return a.title.localeCompare(b.title);
          case 'title-descending':
            return b.title.localeCompare(a.title);
          case 'price-ascending':
            return a.price - b.price;
          case 'price-descending':
            return b.price - a.price;
          case 'created-ascending':
          case 'created-descending':
          case 'best-selling':
          default:
            return 0; // keep server-rendered order
        }
      });
    }

    updateFilterCount() {
      const countEl = this.querySelector('[data-filter-count]');
      const count = this.selectedCategories.size +
        (this.priceMin > 0 || this.priceMax < this.globalPriceMax ? 1 : 0);
      if (countEl) {
        countEl.textContent = count;
        countEl.dataset.count = count;
      }
    }

    formatNumber(n) {
      return n.toLocaleString('en-US');
    }
  }

  customElements.define('product-catalog-section', ProductCatalogSection);
}
