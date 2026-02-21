/**
 * Product Catalog Section — Full AJAX loading + category icons
 * Fetches ALL products from /collections/all/products.json, renders client-side
 * with category-specific Lucide SVG icons matching the Next.js prototype
 */

/* ============================================
   CATEGORY ICON SVG PATHS (Lucide)
   ============================================ */
const CATEGORY_ICONS = {
  'machine control': '<path d="M12 2v4"/><path d="m15.2 7.4 2.8-2.8"/><path d="M19 12h4"/><path d="m15.2 16.6 2.8 2.8"/><path d="M12 19v4"/><path d="m8.8 16.6-2.8 2.8"/><path d="M2 12h4"/><path d="m8.8 7.4L6 4.6"/><circle cx="12" cy="12" r="4"/>',
  'cables & connectors': '<path d="M17 21v-2a1 1 0 0 1-1-1v-1a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v1a1 1 0 0 1-1 1"/><path d="M13 21v-2a1 1 0 0 0 1-1v-1a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v1a1 1 0 0 0 1 1"/><path d="M3 7V5a2 2 0 0 1 2-2h2"/><path d="M17 3h2a2 2 0 0 1 2 2v2"/>',
  'mounting & brackets': '<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>',
  'gps equipment': '<path d="M13 7 8.7 2.7a2.41 2.41 0 0 0-3.4 0L2.7 5.3a2.41 2.41 0 0 0 0 3.4L7 13"/><path d="m8 6 2-2"/><path d="m18 16 2-2"/><path d="m17 11 4.3 4.3c.94.94.94 2.46 0 3.4l-2.6 2.6c-.94.94-2.46.94-3.4 0L11 17"/><circle cx="12" cy="12" r="2"/>',
  'accessories': '<path d="M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z"/><path d="M12 22V12"/><path d="m3.3 7 7.703 4.734a2 2 0 0 0 1.994 0L20.7 7"/>',
  'ground penetrating radar': '<path d="M19.07 4.93A10 10 0 0 0 6.99 3.34"/><path d="M4 6h.01"/><path d="M2.29 9.62A10 10 0 1 0 21.31 8.35"/><path d="M16.24 7.76A6 6 0 1 0 8.23 16.67"/><path d="M12 18h.01"/><circle cx="12" cy="12" r="2"/>',
  'lasers & levels': '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>',
  'rods & poles': '<path d="M21.3 15.3a2.4 2.4 0 0 1 0 3.4l-2.6 2.6a2.4 2.4 0 0 1-3.4 0L2.7 8.7a2.41 2.41 0 0 1 0-3.4l2.6-2.6a2.41 2.41 0 0 1 3.4 0Z"/><path d="m14.5 12.5 2-2"/>',
  'distance meters': '<path d="m18 8 4 4-4 4"/><path d="m6 8-4 4 4 4"/><path d="M8 12h8"/>',
  'drones & uav': '<path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/>',
  'gps rovers': '<polygon points="3 11 22 2 13 21 11 13 3 11"/>',
  'locators & transmitters': '<path d="M4.9 16.1C1 12.2 1 5.8 4.9 1.9"/><path d="M7.8 4.7a6.14 6.14 0 0 0-.8 7.5"/><circle cx="12" cy="9" r="2"/><path d="M16.2 4.7a6.14 6.14 0 0 1 .8 7.5"/><path d="M19.1 1.9a10.01 10.01 0 0 1 0 14.2"/><path d="M9.5 18h5"/><path d="M12 18v4"/>',
  'base & rover kits': '<path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/>',
  'radios & communication': '<path d="M4.9 19.1C1 15.2 1 8.8 4.9 4.9"/><path d="M7.8 16.2c-2.3-2.3-2.3-6.1 0-8.5"/><circle cx="12" cy="12" r="2"/><path d="M16.2 7.8c2.3 2.3 2.3 6.1 0 8.5"/><path d="M19.1 4.9C23 8.8 23 15.1 19.1 19"/>',
  'sensors': '<polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>',
  'training & services': '<path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z"/><path d="M22 10v6"/><path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5"/>',
  'training & install': '<path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z"/><path d="M22 10v6"/><path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5"/>',
  'grading attachments': '<rect x="2" y="6" width="20" height="8" rx="1"/><path d="M17 14v7"/><path d="M7 14v7"/><path d="M17 3v3"/><path d="M7 3v3"/><path d="M10 14 2.3 6.3"/><path d="m14 6 7.7 7.7"/>',
  'care plans': '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/>',
  'software': '<polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>',
  'supplies': '<path d="M2.97 12.92A2 2 0 0 0 2 14.63v3.24a2 2 0 0 0 .97 1.71l3 1.8a2 2 0 0 0 2.06 0L12 19v-5.5l-5-3-4.03 2.42Z"/><path d="m7 16.5-4.74-2.85"/><path d="m7 16.5 5-3"/><path d="M7 16.5v5.17"/><path d="M12 13.5V19l3.97 2.38a2 2 0 0 0 2.06 0l3-1.8a2 2 0 0 0 .97-1.71v-3.24a2 2 0 0 0-.97-1.71L17 10.5l-5 3Z"/><path d="m17 16.5-5-3"/><path d="m17 16.5 4.74-2.85"/><path d="M17 16.5v5.17"/><path d="M7.97 4.42A2 2 0 0 0 7 6.13v4.37l5 3 5-3V6.13a2 2 0 0 0-.97-1.71l-3-1.8a2 2 0 0 0-2.06 0l-3 1.8Z"/><path d="M12 8 7.26 5.15"/><path d="m12 8 4.74-2.85"/><path d="M12 13.5V8"/>',
  'machine parts': '<path d="M12 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z"/><path d="M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"/><path d="M12 2v2"/><path d="M12 22v-2"/><path d="m17 20.66-1-1.73"/><path d="M11 10.27 7 3.34"/><path d="m20.66 17-1.73-1"/><path d="m3.34 7 1.73 1"/><path d="M14 12h8"/><path d="M2 12h2"/><path d="m20.66 7-1.73 1"/><path d="m3.34 17 1.73-1"/><path d="m17 3.34-1 1.73"/><path d="m11 13.73-4 6.93"/>',
  'flagging & marking': '<path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" x2="4" y1="22" y2="15"/>',
  'detection': '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
  'power & batteries': '<path d="M15 7h1a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-2"/><path d="M6 7H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h1"/><path d="m11 7-3 5h4l-3 5"/><line x1="22" x2="22" y1="11" y2="13"/>',
  'receivers': '<path d="M12 20h.01"/><path d="M2 8.82a15 15 0 0 1 20 0"/><path d="M5 12.859a10 10 0 0 1 14 0"/><path d="M8.5 16.429a5 5 0 0 1 7 0"/>',
  'antennas': '<path d="M2 20h.01"/><path d="M7 20v-4"/><path d="M12 20v-8"/><path d="M17 20V8"/><path d="M22 4v16"/>',
  'masts & poles': '<path d="m5 12 7-7 7 7"/><path d="M12 19V5"/>',
  'connectivity': '<circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/>',
  'terrablade': '<path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z"/><path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65"/><path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65"/>',
  'total stations': '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>',
  'survey markers': '<path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/>',
  'scanning': '<path d="M3 7V5a2 2 0 0 1 2-2h2"/><path d="M17 3h2a2 2 0 0 1 2 2v2"/><path d="M21 17v2a2 2 0 0 1-2 2h-2"/><path d="M7 21H5a2 2 0 0 1-2-2v-2"/><path d="M7 12h10"/>',
  'tablets & controllers': '<rect width="10" height="14" x="3" y="8" rx="2"/><path d="M5 4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v4h-4"/><path d="M8 18h.01"/>',
  'base stations': '<path d="M3 22h18"/><path d="M6 18v4"/><path d="M18 18v4"/><path d="M6 18H4a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-2"/><path d="M6 10V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v6"/>',
  'gps corrections': '<path d="M14.106 5.553a2 2 0 0 0 1.788 0l3.659-1.83A1 1 0 0 1 21 4.619v12.764a1 1 0 0 1-.553.894l-4.553 2.277a2 2 0 0 1-1.788 0l-4.212-2.106a2 2 0 0 0-1.788 0l-3.659 1.83A1 1 0 0 1 3 19.381V6.618a1 1 0 0 1 .553-.894l4.553-2.277a2 2 0 0 1 1.788 0z"/><path d="M15 5.764v15"/><path d="M9 3.236v15"/>',
  'rentals': '<path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/>',
  'safety': '<path d="M10 10V5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v5"/><path d="M14 6a6 6 0 0 1 6 6v0"/><path d="M4 12a6 6 0 0 1 6-6"/><rect width="20" height="6" x="2" y="12" rx="2"/>',
  'measuring tools': '<circle cx="12" cy="12" r="10"/><path d="m16 12-4-4-4 4"/><path d="m16 12-4 4-4-4"/>',
  'tripods': '<path d="M13.73 4a2 2 0 0 0-3.46 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/>',
  'parts & equipment': '<path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/>',
  'drone': '<path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/>',
  'goods': '<path d="M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z"/><path d="M12 22V12"/><path d="m3.3 7 7.703 4.734a2 2 0 0 0 1.994 0L20.7 7"/>',
  'gps rods + prism poles': '<path d="M21.3 15.3a2.4 2.4 0 0 1 0 3.4l-2.6 2.6a2.4 2.4 0 0 1-3.4 0L2.7 8.7a2.41 2.41 0 0 1 0-3.4l2.6-2.6a2.41 2.41 0 0 1 3.4 0Z"/><path d="m14.5 12.5 2-2"/>',
};

// Default fallback icon (settings gear)
const DEFAULT_ICON = '<path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/>';

function getCategoryIcon(category) {
  if (!category) return DEFAULT_ICON;
  const key = category.toLowerCase().trim();
  return CATEGORY_ICONS[key] || DEFAULT_ICON;
}

function makeSvg(pathData, size = 24) {
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">${pathData}</svg>`;
}

/* ============================================
   PRODUCT CATALOG WEB COMPONENT
   ============================================ */
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
      this.allProducts = [];
      this.allCategories = {};
      this.globalPriceMax = 0;
      this.collectionHandle = this.dataset.collection || 'all';
    }

    connectedCallback() {
      this.listContainer = this.querySelector('[data-product-list]');
      this.countEl = this.querySelector('[data-product-count]');
      this.sidebarEl = this.querySelector('[data-filter-sidebar]');
      this.productsContainer = this.querySelector('[data-products-container]');
      this.emptyEl = this.querySelector('[data-empty-state]');
      this.loadingEl = this.querySelector('[data-loading]');

      this.initSearch();
      this.initViewToggle();
      this.initSort();
      this.initMobileFilter();
      this.initFilterReset();
      this.setView(this.viewMode, false);

      // Start loading all products
      this.fetchAllProducts();
    }

    /* ============================================
       AJAX PRODUCT LOADER
       ============================================ */
    async fetchAllProducts() {
      // Show loading state
      if (this.loadingEl) this.loadingEl.style.display = '';
      if (this.productsContainer) this.productsContainer.style.display = 'none';
      if (this.emptyEl) this.emptyEl.style.display = 'none';

      try {
        this.allProducts = [];
        this.allCategories = {};
        this.globalPriceMax = 0;
        this.priceMax = 0;
        
        let page = 1;
        const url = `/collections/${this.collectionHandle}/products.json?limit=250&page=${page}`;
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();

        if (data.products && data.products.length > 0) {
          this.processProductsChunk(data.products, true);
          
          if (data.products.length === 250) {
            // Load the rest progressively in the background
            this.loadRemainingProductsSilently(2);
          } else {
            if (this.loadingEl) this.loadingEl.style.display = 'none';
          }
        } else {
          if (this.loadingEl) this.loadingEl.style.display = 'none';
          this.renderProducts();
        }
      } catch (err) {
        console.error('Product Catalog: Failed to load products', err);
        if (this.loadingEl) this.loadingEl.style.display = 'none';
        if (this.emptyEl) {
          this.emptyEl.querySelector('h3').textContent = 'Failed to load products';
          this.emptyEl.querySelector('p').textContent = 'Please refresh the page to try again.';
          this.emptyEl.style.display = '';
        }
      }
    }

    async loadRemainingProductsSilently(startPage) {
      let page = startPage;
      let hasMore = true;
      let changed = false;

      while (hasMore) {
        try {
          const url = `/collections/${this.collectionHandle}/products.json?limit=250&page=${page}`;
          const response = await fetch(url);
          if (!response.ok) break;
          const data = await response.json();
          
          if (data.products && data.products.length > 0) {
            this.processProductsChunk(data.products, false);
            changed = true;
            page++;
            if (data.products.length < 250) hasMore = false;
          } else {
            hasMore = false;
          }
        } catch(e) {
          hasMore = false;
        }
      }
      if (this.loadingEl) this.loadingEl.style.display = 'none';
      if (changed) {
        // One final rebuild and sorted render to finalize data completeness
        this.buildCategorySidebar(); 
        this.renderProducts();
      }
    }

    processProductsChunk(rawProducts, isFirstRun) {
      // Process raw Shopify product JSON into our working format
      const newItems = rawProducts.map(p => {
        const variant = p.variants && p.variants[0] ? p.variants[0] : {};
        const price = parseFloat(variant.price) || 0;
        const category = (p.product_type || '').trim();
        // Filter system tags
        const systemPrefixes = ['zoho-item', 'zoho-composite'];
        const rawTags = Array.isArray(p.tags) ? p.tags : (typeof p.tags === 'string' ? p.tags.split(',') : []);
        const tags = rawTags.map(t => String(t).trim()).filter(t => {
          if (!t) return false;
          const tl = t.toLowerCase();
          for (const prefix of systemPrefixes) {
            if (tl.includes(prefix)) return false;
          }
          // Skip ALL_CAPS tags that look like system tags
          if (t === t.toUpperCase() && !t.includes(' ') && t.length > 3) return false;
          return true;
        });

        return {
          handle: p.handle,
          title: p.title || '',
          category: category,
          sku: variant.sku || '',
          price: price,
          tags: tags,
          url: `/products/${p.handle}`,
          image: p.images && p.images.length > 0 ? p.images[0].src : null,
          searchText: [
            (p.title || '').toLowerCase(),
            category.toLowerCase(),
            (variant.sku || '').toLowerCase(),
            tags.join(' ').toLowerCase()
          ].join(' ')
        };
      });
      
      this.allProducts.push(...newItems);

      // Build or update category map natively
      newItems.forEach(p => {
        if (p.category) {
          const key = p.category.toLowerCase();
          if (!this.allCategories[key]) {
            this.allCategories[key] = { name: p.category, count: 0 };
          }
          this.allCategories[key].count++;
        }
      });

      // Update max price range incrementally
      const prices = this.allProducts.map(p => p.price).filter(p => p > 0);
      const newMax = prices.length ? Math.ceil(Math.max(...prices)) : 0;
      
      let maxUpgraded = false;
      if (newMax > this.globalPriceMax) {
        const wasAtMax = this.priceMax >= this.globalPriceMax;
        this.globalPriceMax = newMax;
        if (wasAtMax || isFirstRun) {
          this.priceMax = newMax;
        }
        maxUpgraded = true;
      }

      if (isFirstRun) {
        this.buildCategorySidebar();
        this.initPriceFilter();
      } else {
        this.updateCategorySidebarCounts();
        if (maxUpgraded) this.updatePriceFilterSilently();
      }
      
      // Update the product grid dynamically to provide instant results if they aren't filtering heavily
      if (this.searchQuery === '' && this.selectedCategories.size === 0 && this.sortBy === 'best-selling') {
        this.renderProducts();
      } else if (isFirstRun) {
        this.renderProducts();
      }

      // Hide loading if first run done
      if (isFirstRun && this.loadingEl) {
         if (this.allProducts.length < 250) this.loadingEl.style.display = 'none';
      }
    }

    /* ============================================
       BUILD CATEGORY SIDEBAR
       ============================================ */
    buildCategorySidebar() {
      const catContainer = this.querySelector('[data-category-list]');
      if (!catContainer) return;
      catContainer.innerHTML = '';

      const sortedCategories = Object.entries(this.allCategories)
        .sort((a, b) => a[1].name.localeCompare(b[1].name));

      sortedCategories.forEach(([key, { name, count }]) => {
        const li = document.createElement('li');
        li.className = 'product-catalog__category-item';
        li.dataset.categoryItem = key;

        const iconSvg = makeSvg(getCategoryIcon(key), 16);
        li.innerHTML = `
          <input type="checkbox" value="${key}" data-category-checkbox id="cat-${key.replace(/[^a-z0-9]/g, '-')}">
          <span class="product-catalog__category-icon">${iconSvg}</span>
          <label class="product-catalog__category-name" for="cat-${key.replace(/[^a-z0-9]/g, '-')}">${this.escapeHtml(name)}</label>
          <span class="product-catalog__category-count">${count}</span>
        `;
        catContainer.appendChild(li);
      });

      // Bind checkbox events
      catContainer.querySelectorAll('[data-category-checkbox]').forEach(cb => {
        cb.addEventListener('change', () => {
          const cat = cb.value;
          if (cb.checked) {
            this.selectedCategories.add(cat);
          } else {
            this.selectedCategories.delete(cat);
          }
          this.renderProducts();
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
    
    updateCategorySidebarCounts() {
      const catContainer = this.querySelector('[data-category-list]');
      if (!catContainer) return;
      
      Object.entries(this.allCategories).forEach(([key, { name, count }]) => {
        let li = catContainer.querySelector(`[data-category-item="${key}"]`);
        if (!li) {
          li = document.createElement('li');
          li.className = 'product-catalog__category-item';
          li.dataset.categoryItem = key;
          const iconSvg = makeSvg(getCategoryIcon(key), 16);
          li.innerHTML = `
            <input type="checkbox" value="${key}" data-category-checkbox id="cat-${key.replace(/[^a-z0-9]/g, '-')}">
            <span class="product-catalog__category-icon">${iconSvg}</span>
            <label class="product-catalog__category-name" for="cat-${key.replace(/[^a-z0-9]/g, '-')}">${this.escapeHtml(name)}</label>
            <span class="product-catalog__category-count">${count}</span>
          `;
          catContainer.appendChild(li);
          const cb = li.querySelector('input');
          cb.addEventListener('change', () => {
            if (cb.checked) this.selectedCategories.add(cb.value);
            else this.selectedCategories.delete(cb.value);
            this.renderProducts();
            this.updateFilterCount();
          });
        } else {
          const countEl = li.querySelector('.product-catalog__category-count');
          if (countEl) countEl.textContent = count;
        }
      });
    }

    /* ============================================
       RENDER PRODUCTS
       ============================================ */
    renderProducts() {
      if (!this.productsContainer) return;

      // 1. Filter
      let filtered = this.allProducts.filter(p => {
        // Search
        if (this.searchQuery && !p.searchText.includes(this.searchQuery)) return false;
        // Category
        if (this.selectedCategories.size > 0 && !this.selectedCategories.has(p.category.toLowerCase())) return false;
        // Price
        if (p.price < this.priceMin || p.price > this.priceMax) return false;
        return true;
      });

      // 2. Sort
      filtered = this.sortProductList(filtered);

      // 3. Update count
      if (this.countEl) {
        if (filtered.length === this.allProducts.length) {
          this.countEl.innerHTML = `<strong>${filtered.length}</strong> products`;
        } else {
          this.countEl.innerHTML = `<strong>${filtered.length}</strong> of ${this.allProducts.length} products`;
        }
      }

      // 4. Show/hide empty
      if (filtered.length === 0) {
        if (this.emptyEl) this.emptyEl.style.display = '';
        this.productsContainer.style.display = 'none';
        return;
      } else {
        if (this.emptyEl) this.emptyEl.style.display = 'none';
        this.productsContainer.style.display = '';
      }

      // 5. Build HTML
      let html = '';

      // Compact header
      html += `
        <div class="product-catalog__compact-header">
          <span class="col-icon"></span>
          <span class="col-product">Product</span>
          <span class="col-category">Category</span>
          <span class="col-sku">SKU</span>
          <span class="col-price">Price</span>
        </div>
      `;

      filtered.forEach(p => {
        const iconSvg = makeSvg(getCategoryIcon(p.category), 24);
        const iconSvgSmall = makeSvg(getCategoryIcon(p.category), 14);
        const priceFormatted = this.formatPrice(p.price);
        const categoryBadge = p.category ? `<span class="product-catalog__item-category">${this.escapeHtml(p.category)}</span>` : '';
        const skuHtml = p.sku ? `<span class="product-catalog__item-sku">${this.escapeHtml(p.sku)}</span>` : '';

        // Tags (limit 5)
        let tagsHtml = '';
        if (p.tags.length > 0) {
          const tagItems = p.tags.slice(0, 5).map(t => `<span class="product-catalog__item-tag">${this.escapeHtml(t)}</span>`).join('');
          tagsHtml = `<div class="product-catalog__item-tags">${tagItems}</div>`;
        }

        // List view item
        html += `
          <article class="product-catalog__item">
            <div class="product-catalog__item-icon">${iconSvg}</div>
            <div class="product-catalog__item-content">
              <div class="product-catalog__item-header">
                <div class="product-catalog__item-title-wrap">
                  <h3 class="product-catalog__item-title">
                    <a href="${p.url}">${this.escapeHtml(p.title)}</a>
                  </h3>
                  <div class="product-catalog__item-meta">
                    ${categoryBadge}
                    ${skuHtml}
                  </div>
                </div>
                <div class="product-catalog__item-price">${priceFormatted}</div>
              </div>
              ${tagsHtml}
            </div>
            <div class="product-catalog__item-arrow">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
            </div>
          </article>
        `;

        // Compact view item
        html += `
          <a href="${p.url}" class="product-catalog__compact-item">
            <div class="col-icon">${iconSvgSmall}</div>
            <span class="col-product">${this.escapeHtml(p.title)}</span>
            <span class="col-category">${p.category ? `<span>${this.escapeHtml(p.category)}</span>` : ''}</span>
            <span class="col-sku">${this.escapeHtml(p.sku || '—')}</span>
            <span class="col-price">${priceFormatted}</span>
          </a>
        `;
      });

      this.productsContainer.innerHTML = html;

      // Re-apply view mode class
      if (this.listContainer) {
        this.listContainer.classList.toggle('product-catalog__list--compact', this.viewMode === 'compact');
      }
    }

    sortProductList(products) {
      const list = [...products];
      switch (this.sortBy) {
        case 'title-ascending':
          list.sort((a, b) => a.title.localeCompare(b.title));
          break;
        case 'title-descending':
          list.sort((a, b) => b.title.localeCompare(a.title));
          break;
        case 'price-ascending':
          list.sort((a, b) => a.price - b.price);
          break;
        case 'price-descending':
          list.sort((a, b) => b.price - a.price);
          break;
        // best-selling, created: keep original order
      }
      return list;
    }

    /* ============================================
       SEARCH
       ============================================ */
    initSearch() {
      const searchInput = this.querySelector('[data-search-input]');
      if (!searchInput) return;
      let debounceTimer;
      searchInput.addEventListener('input', () => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
          this.searchQuery = searchInput.value.toLowerCase().trim();
          this.renderProducts();
        }, 200);
      });
    }

    /* ============================================
       VIEW TOGGLE
       ============================================ */
    initViewToggle() {
      this.querySelectorAll('[data-view-btn]').forEach(btn => {
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

    /* ============================================
       SORT
       ============================================ */
    initSort() {
      const sortSelect = this.querySelector('[data-sort-select]');
      if (!sortSelect) return;
      sortSelect.addEventListener('change', () => {
        this.sortBy = sortSelect.value;
        this.renderProducts();
      });
    }

    /* ============================================
       PRICE FILTER
       ============================================ */
    initPriceFilter() {
      this.priceMinSlider = this.querySelector('[data-price-min]');
      this.priceMaxSlider = this.querySelector('[data-price-max]');
      this.priceMinDisplay = this.querySelector('[data-price-min-display]');
      this.priceMaxDisplay = this.querySelector('[data-price-max-display]');
      this.priceTrackActive = this.querySelector('[data-price-track-active]');
      const priceMaxLabel = this.querySelector('[data-price-max-label]');

      if (!this.priceMinSlider || !this.priceMaxSlider) return;

      this.priceMinSlider.max = this.globalPriceMax;
      this.priceMaxSlider.max = this.globalPriceMax;
      this.priceMinSlider.value = 0;
      this.priceMaxSlider.value = this.globalPriceMax;

      if (this.priceMinDisplay) this.priceMinDisplay.textContent = '$0';
      if (this.priceMaxDisplay) this.priceMaxDisplay.textContent = '$' + this.formatNumber(this.globalPriceMax);
      if (priceMaxLabel) priceMaxLabel.textContent = '$' + this.formatNumber(this.globalPriceMax);

      this.updatePriceTrack();

      const onPriceChange = () => {
        let min = parseInt(this.priceMinSlider.value);
        let max = parseInt(this.priceMaxSlider.value);
        if (min > max) [min, max] = [max, min];
        this.priceMin = min;
        this.priceMax = max;
        if (this.priceMinDisplay) this.priceMinDisplay.textContent = '$' + this.formatNumber(min);
        if (this.priceMaxDisplay) this.priceMaxDisplay.textContent = '$' + this.formatNumber(max);
        this.updatePriceTrack();
        this.renderProducts();
      };

      this.priceMinSlider.addEventListener('input', onPriceChange);
      this.priceMaxSlider.addEventListener('input', onPriceChange);
    }

    updatePriceTrack() {
      if (!this.priceTrackActive || !this.priceMinSlider || !this.priceMaxSlider) return;
      const max = this.globalPriceMax || 1;
      const minPct = (parseInt(this.priceMinSlider.value) / max) * 100;
      const maxPct = (parseInt(this.priceMaxSlider.value) / max) * 100;
      this.priceTrackActive.style.left = minPct + '%';
      this.priceTrackActive.style.width = (maxPct - minPct) + '%';
    }

    updatePriceFilterSilently() {
      if (!this.priceMinSlider || !this.priceMaxSlider) return;
      this.priceMinSlider.max = this.globalPriceMax;
      this.priceMaxSlider.max = this.globalPriceMax;
      
      if (this.priceMax >= this.globalPriceMax || parseInt(this.priceMaxSlider.value) >= parseInt(this.priceMaxSlider.max)) {
        this.priceMaxSlider.value = this.globalPriceMax;
        this.priceMax = this.globalPriceMax;
        if (this.priceMaxDisplay) this.priceMaxDisplay.textContent = '$' + this.formatNumber(this.globalPriceMax);
        const priceMaxLabel = this.querySelector('[data-price-max-label]');
        if (priceMaxLabel) priceMaxLabel.textContent = '$' + this.formatNumber(this.globalPriceMax);
      }
      this.updatePriceTrack();
    }

    /* ============================================
       FILTER RESET
       ============================================ */
    initFilterReset() {
      const resetBtn = this.querySelector('[data-filter-reset]');
      if (!resetBtn) return;
      resetBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.searchQuery = '';
        this.selectedCategories.clear();
        this.priceMin = 0;
        this.priceMax = this.globalPriceMax;

        const searchInput = this.querySelector('[data-search-input]');
        if (searchInput) searchInput.value = '';
        this.querySelectorAll('[data-category-checkbox]').forEach(cb => { cb.checked = false; });
        if (this.priceMinSlider) this.priceMinSlider.value = 0;
        if (this.priceMaxSlider) this.priceMaxSlider.value = this.globalPriceMax;
        if (this.priceMinDisplay) this.priceMinDisplay.textContent = '$0';
        if (this.priceMaxDisplay) this.priceMaxDisplay.textContent = '$' + this.formatNumber(this.globalPriceMax);
        this.updatePriceTrack();
        this.updateFilterCount();
        this.renderProducts();
      });
    }

    /* ============================================
       MOBILE FILTER
       ============================================ */
    initMobileFilter() {
      const openBtn = this.querySelector('[data-mobile-filter-open]');
      const closeBtn = this.querySelector('[data-mobile-filter-close]');
      const overlay = this.querySelector('[data-mobile-filter-overlay]');
      const sidebar = this.querySelector('[data-filter-sidebar]');

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

    updateFilterCount() {
      const countEl = this.querySelector('[data-filter-count]');
      const count = this.selectedCategories.size + (this.priceMin > 0 || this.priceMax < this.globalPriceMax ? 1 : 0);
      if (countEl) {
        countEl.textContent = count;
        countEl.dataset.count = count;
      }
    }

    /* ============================================
       UTILITIES
       ============================================ */
    formatPrice(price) {
      if (price === 0) return '$0';
      if (price % 1 === 0) return '$' + price.toLocaleString('en-US');
      return '$' + price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }

    formatNumber(n) {
      return n.toLocaleString('en-US');
    }

    escapeHtml(str) {
      const div = document.createElement('div');
      div.textContent = str;
      return div.innerHTML;
    }
  }

  customElements.define('product-catalog-section', ProductCatalogSection);
}
