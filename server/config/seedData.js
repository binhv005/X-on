import bcrypt from 'bcryptjs';

export function seedInitialData() {
  const salt = bcrypt.genSaltSync(10);
  const adminPasswordHash = bcrypt.hashSync('admin123', salt);
  const demoUserPasswordHash = bcrypt.hashSync('user123', salt);

  const categories = [
    { id: 'cat-1', name: 'Handmade Press-On Nails', slug: 'handmade-press-on-nails', type: 'product_type', status: 'active', sort_order: 1 },
    { id: 'cat-2', name: 'Nail Essentials', slug: 'nail-essentials', type: 'product_type', status: 'active', sort_order: 2 },
    { id: 'cat-3', name: 'Best Sellers', slug: 'best-sellers', type: 'product_type', status: 'active', sort_order: 3 },
    { id: 'shape-1', name: 'Almond', slug: 'almond', type: 'shape', status: 'active', sort_order: 1 },
    { id: 'shape-2', name: 'Coffin', slug: 'coffin', type: 'shape', status: 'active', sort_order: 2 },
    { id: 'shape-3', name: 'Oval', slug: 'oval', type: 'shape', status: 'active', sort_order: 3 },
    { id: 'shape-4', name: 'Round', slug: 'round', type: 'shape', status: 'active', sort_order: 4 },
    { id: 'shape-5', name: 'Square', slug: 'square', type: 'shape', status: 'active', sort_order: 5 },
    { id: 'shape-6', name: 'Stiletto', slug: 'stiletto', type: 'shape', status: 'active', sort_order: 6 },
    { id: 'theme-1', name: 'Minimalist Chic', slug: 'minimalist-chic', type: 'theme', status: 'active', sort_order: 1 },
    { id: 'theme-2', name: 'Glitz & Glamour', slug: 'glitz-glamour', type: 'theme', status: 'active', sort_order: 2 },
    { id: 'theme-3', name: 'French Modern', slug: 'french-modern', type: 'theme', status: 'active', sort_order: 3 },
    { id: 'theme-4', name: 'Cat Eye & Chrome', slug: 'cat-eye-chrome', type: 'theme', status: 'active', sort_order: 4 }
  ];

  const products = [
    {
      id: 'prod-1',
      name: 'CF-35-0961 Luxury Chrome Velvet',
      slug: 'cf-35-0961-luxury-chrome-velvet',
      SKU: 'XON-CF-0961',
      images: [
        '/assets/images/IMG_7098.webp',
        '/assets/images/IMG_7098.webp',
        '/assets/images/IMG_7098.webp'
      ],
      price: 48.00,
      sale_price: 39.00,
      sizes: ['XS', 'S', 'M', 'L', 'Custom'],
      variants: [
        { name: 'Short Coffin', stock: 25 },
        { name: 'Medium Coffin', stock: 18 },
        { name: 'Long Coffin', stock: 12 }
      ],
      stock: 55,
      status: 'active',
      product_type: 'Handmade Press-On Nails',
      categories: ['Handmade Press-On Nails', 'Best Sellers'],
      shape: 'Coffin',
      themes: ['Cat Eye & Chrome', 'Glitz & Glamour'],
      is_best_seller: true,
      is_bundle: false,
      description: 'Handcrafted with salon-grade multi-layer gel and infused with ethereal velvet magnetic shimmer. Designed to deliver an ultra-luxe, durable finish that lasts for up to 3 weeks with proper application.',
      additional_info: {
        included: '10 Handcrafted Nails, Application Kit (Salon Glue, 24 Adhesive Tabs, Cuticle Pusher, Mini File, Prep Alcohol Pads)',
        finish: 'Glossy Cat-Eye Magnetic Velvet',
        wear_time: 'Tabs: 3-7 days | Glue: Up to 3 weeks',
        reusable: 'Yes, with gentle removal'
      },
      rating: 4.9,
      reviews_count: 38
    },
    {
      id: 'prod-2',
      name: 'AL-12-0442 Ethereal French Rose Almond',
      slug: 'al-12-0442-ethereal-french-rose-almond',
      SKU: 'XON-AL-0442',
      images: [
        '/assets/images/IMG_7098.webp',
        '/assets/images/IMG_7098.webp'
      ],
      price: 42.00,
      sale_price: 36.00,
      sizes: ['XS', 'S', 'M', 'L'],
      variants: [
        { name: 'Medium Almond', stock: 30 }
      ],
      stock: 45,
      status: 'active',
      product_type: 'Handmade Press-On Nails',
      categories: ['Handmade Press-On Nails', 'Best Sellers'],
      shape: 'Almond',
      themes: ['French Modern', 'Minimalist Chic'],
      is_best_seller: true,
      is_bundle: false,
      description: 'A timeless reimagination of the classic French manicure featuring a delicate soft-blush translucent base with crisp micro-sculpted white tips and pearl dust overspray.',
      additional_info: {
        included: '10 Handcrafted Nails, Full Professional Prep Kit',
        finish: 'High-Gloss Glass Topcoat',
        wear_time: 'Up to 3 weeks'
      },
      rating: 5.0,
      reviews_count: 24
    },
    {
      id: 'prod-3',
      name: 'ST-99-0118 Obsidian Gold Foil Stiletto',
      slug: 'st-99-0118-obsidian-gold-foil-stiletto',
      SKU: 'XON-ST-0118',
      images: [
        '/assets/images/IMG_7098.webp',
        '/assets/images/IMG_7098.webp'
      ],
      price: 52.00,
      sale_price: 45.00,
      sizes: ['XS', 'S', 'M', 'L'],
      variants: [
        { name: 'Long Stiletto', stock: 15 }
      ],
      stock: 22,
      status: 'active',
      product_type: 'Handmade Press-On Nails',
      categories: ['Handmade Press-On Nails'],
      shape: 'Stiletto',
      themes: ['Glitz & Glamour'],
      is_best_seller: false,
      is_bundle: false,
      description: 'Dramatic pitch-black stiletto silhouette embellished with 24k gold leaf foil accents and encapsulated in ultra-clarity builder gel for an impenetrable luxury shield.',
      additional_info: {
        included: '10 Nails + Application Toolkit',
        finish: 'Encapsulated Foil High Gloss'
      },
      rating: 4.8,
      reviews_count: 19
    },
    {
      id: 'prod-4',
      name: 'SQ-44-0312 Nude Glaze Classic Square',
      slug: 'sq-44-0312-nude-glaze-classic-square',
      SKU: 'XON-SQ-0312',
      images: [
        '/assets/images/IMG_7098.webp'
      ],
      price: 38.00,
      sale_price: null,
      sizes: ['XS', 'S', 'M', 'L', 'Custom'],
      variants: [
        { name: 'Short Square', stock: 40 },
        { name: 'Medium Square', stock: 25 }
      ],
      stock: 65,
      status: 'active',
      product_type: 'Handmade Press-On Nails',
      categories: ['Handmade Press-On Nails'],
      shape: 'Square',
      themes: ['Minimalist Chic'],
      is_best_seller: false,
      is_bundle: false,
      description: 'The everyday luxury essential. Clean, square contours with a translucent glazed donut milky finish that complements every skin tone effortlessly.',
      additional_info: {
        included: '10 Nails, Prep Kit',
        finish: 'Milky Glaze Gloss'
      },
      rating: 4.7,
      reviews_count: 15
    },
    {
      id: 'prod-5',
      name: 'OV-08-0720 Pearl Aurora Oval',
      slug: 'ov-08-0720-pearl-aurora-oval',
      SKU: 'XON-OV-0720',
      images: [
        '/assets/images/IMG_7098.webp'
      ],
      price: 44.00,
      sale_price: 38.00,
      sizes: ['S', 'M', 'L'],
      variants: [{ name: 'Medium Oval', stock: 20 }],
      stock: 35,
      status: 'active',
      product_type: 'Handmade Press-On Nails',
      categories: ['Handmade Press-On Nails', 'Best Sellers'],
      shape: 'Oval',
      themes: ['Cat Eye & Chrome'],
      is_best_seller: true,
      is_bundle: false,
      description: 'Iridescent pearl powder buffed over a nude jelly base. Shifts between lavender, baby pink, and gold under natural light.',
      additional_info: {
        included: '10 Nails + Application Tools',
        finish: 'Aurora Chrome Mirror Effect'
      },
      rating: 4.9,
      reviews_count: 29
    },
    {
      id: 'prod-6',
      name: 'RD-19-0551 Ruby Jewel Round Short',
      slug: 'rd-19-0551-ruby-jewel-round-short',
      SKU: 'XON-RD-0551',
      images: [
        '/assets/images/IMG_7098.webp'
      ],
      price: 46.00,
      sale_price: null,
      sizes: ['XS', 'S', 'M'],
      variants: [{ name: 'Short Round', stock: 18 }],
      stock: 28,
      status: 'active',
      product_type: 'Handmade Press-On Nails',
      categories: ['Handmade Press-On Nails'],
      shape: 'Round',
      themes: ['Glitz & Glamour'],
      is_best_seller: false,
      is_bundle: false,
      description: 'Deep crimson glass gel infused with micro garnet crystals. Perfect for compact active nail lengths without losing bold aesthetic impact.',
      additional_info: {
        included: '10 Nails + Complete Kit',
        finish: 'Glass Gel'
      },
      rating: 4.8,
      reviews_count: 11
    },
    // Nail Essentials
    {
      id: 'prod-7',
      name: 'X-ON Salon Pro Hold Nail Adhesive (15ml)',
      slug: 'x-on-salon-pro-hold-nail-adhesive',
      SKU: 'XON-ESS-001',
      images: [
        '/assets/images/IMG_7098.webp'
      ],
      price: 14.00,
      sale_price: 11.50,
      sizes: ['15ml'],
      variants: [{ name: '15ml Bottle with Brush', stock: 150 }],
      stock: 150,
      status: 'active',
      product_type: 'Nail Essentials',
      categories: ['Nail Essentials', 'Best Sellers'],
      shape: null,
      themes: ['Minimalist Chic'],
      is_best_seller: true,
      is_bundle: false,
      description: 'Professional grade, fast-drying brush-on nail adhesive engineered for maximum adhesion, zero air bubble retention, and up to 4 weeks of secure wear.',
      additional_info: {
        volume: '15ml',
        formula: 'Ethyl Cyanoacrylate with Vitamin E nourishers',
        drying_time: '10-15 seconds'
      },
      rating: 5.0,
      reviews_count: 82
    },
    {
      id: 'prod-8',
      name: 'Ultra-Bond Waterproof Gel Adhesive Tabs (Pack of 120)',
      slug: 'ultra-bond-waterproof-gel-adhesive-tabs',
      SKU: 'XON-ESS-002',
      images: [
        '/assets/images/IMG_7098.webp'
      ],
      price: 9.00,
      sale_price: null,
      sizes: ['Pack of 120 Tabs (5 Sheets)'],
      variants: [{ name: '120 Tabs', stock: 200 }],
      stock: 200,
      status: 'active',
      product_type: 'Nail Essentials',
      categories: ['Nail Essentials'],
      shape: null,
      themes: [],
      is_best_seller: false,
      is_bundle: false,
      description: 'High-viscosity medical-grade double-sided gel tabs for damage-free nail application, ideal for weekend wear and effortless removal.',
      additional_info: {
        count: '120 tabs (12 various sizes per sheet)',
        benefit: '0% natural nail damage'
      },
      rating: 4.8,
      reviews_count: 45
    },
    {
      id: 'prod-9',
      name: 'Organic Cuticle Recovery Elixir & Prep Kit',
      slug: 'organic-cuticle-recovery-elixir-prep-kit',
      SKU: 'XON-ESS-003',
      images: [
        '/assets/images/IMG_7098.webp'
      ],
      price: 18.00,
      sale_price: 15.00,
      sizes: ['Standard'],
      variants: [{ name: 'Full Kit', stock: 80 }],
      stock: 80,
      status: 'active',
      product_type: 'Nail Essentials',
      categories: ['Nail Essentials'],
      shape: null,
      themes: [],
      is_best_seller: false,
      is_bundle: false,
      description: 'Cold-pressed jojoba, sweet almond, and rosehip oil blend paired with dual-ended stainless steel precision cuticle tool and glass etching buffer.',
      additional_info: {
        ingredients: 'Simmondsia Chinensis Seed Oil, Prunus Amygdalus Dulcis, Tocopherol',
        includes: '10ml Oil Dropper, Glass Buffer, Cuticle Tool'
      },
      rating: 4.9,
      reviews_count: 31
    },
    // Bundles
    {
      id: 'prod-bundle-1',
      name: 'Ultimate Luxury Velvet & Essentials Trio Bundle',
      slug: 'ultimate-luxury-velvet-essentials-trio-bundle',
      SKU: 'XON-BND-001',
      images: [
        '/assets/images/IMG_7098.webp',
        '/assets/images/IMG_7098.webp'
      ],
      price: 98.00,
      sale_price: 74.00,
      discount_percentage: 25,
      sizes: ['S', 'M', 'L'],
      variants: [{ name: 'Standard Bundle', stock: 30 }],
      stock: 30,
      status: 'active',
      product_type: 'Handmade Press-On Nails',
      categories: ['Handmade Press-On Nails', 'Best Sellers'],
      shape: 'Coffin',
      themes: ['Cat Eye & Chrome'],
      is_best_seller: true,
      is_bundle: true,
      description: 'Save 25% with this complete luxury set including 2 handcrafted designer nail sets (Chrome Velvet + French Rose) plus our Full Salon Pro Hold Adhesive & Prep toolkit.',
      additional_info: {
        bundle_includes: '2x 10-piece Handcrafted Nail Sets, 1x Salon Pro Hold Glue (15ml), 1x 120-pack Adhesive Tabs, 1x Glass Buffer'
      },
      rating: 5.0,
      reviews_count: 56
    },
    {
      id: 'prod-bundle-2',
      name: 'Glamour Stiletto & Aurora Duo Bundle',
      slug: 'glamour-stiletto-aurora-duo-bundle',
      SKU: 'XON-BND-002',
      images: [
        '/assets/images/IMG_7098.webp'
      ],
      price: 88.00,
      sale_price: 68.00,
      discount_percentage: 23,
      sizes: ['S', 'M', 'L'],
      variants: [{ name: 'Duo Set', stock: 25 }],
      stock: 25,
      status: 'active',
      product_type: 'Handmade Press-On Nails',
      categories: ['Handmade Press-On Nails'],
      shape: 'Stiletto',
      themes: ['Glitz & Glamour'],
      is_best_seller: false,
      is_bundle: true,
      description: 'Get our Obsidian Gold Foil Stiletto and Pearl Aurora Oval sets in one exclusive discounted luxury bundle.',
      additional_info: {
        bundle_includes: '2x Premium Nail Sets, 2x Application Kits'
      },
      rating: 4.9,
      reviews_count: 22
    }
  ];

  const pageContents = {
    home: {
      hero_heading: 'X-ON',
      hero_tagline: 'Press On. Slay On. Repeat.',
      hero_description: 'Where modern nail artistry meets effortless beauty. Handcrafted press-on sets and curated nail essentials designed for nail lovers and salon professionals alike.',
      hero_image: '/assets/images/IMG_7098.webp',
      hero_cta_text: 'Shop The Collection',
      hero_cta_link: '/shop',
      brand_info_title: 'The X-ON Standard',
      brand_info_body: 'X-ON is where modern nail artistry meets effortless beauty. Created for nail lovers and professionals alike, X-ON offers handmade press-on nails and carefully selected nail essentials designed with quality, style, and performance in mind. From statement-making nail sets to everyday professional supplies, every X-ON product is chosen to make beautiful nails easier, faster, and more accessible—without compromising on a polished, luxury finish.',
      find_us_heading: 'Find Us',
      find_us_address: '3168 Bill Beck Blvd, Kissimmee, FL 34744',
      find_us_phone: '689-212-8888',
      find_us_note: 'Visit our flagship showcase or connect with our master artists.'
    },
    about: {
      page_title: 'About X-ON',
      brand_line: 'Press On. Slay On. Repeat.',
      tagline: 'X-ON is where modern nail artistry meets effortless beauty.',
      brand_description: 'Created for nail lovers and professionals alike, X-ON offers handmade press-on nails and carefully selected nail essentials designed with quality, style, and performance in mind.\n\nFrom statement-making nail sets to everyday professional supplies, every X-ON product is chosen to make beautiful nails easier, faster, and more accessible—without compromising on a polished, luxury finish.\n\nX-ON — Press On. Slay On. Repeat.',
      address: '3168 Bill Beck Blvd, Kissimmee, FL 34744',
      phone: '689-212-8888',
      image: '/assets/images/IMG_7098.webp'
    },
    sizing: {
      page_title: 'Sizing Chart & Fit Guide',
      intro_heading: 'Finding Your Perfect X-ON Fit',
      intro_body: 'Measure once for a bespoke salon fit — use XS–L presets or custom mm sizing below.',
      mapping_headers: ['Size', 'Thumb', 'Index', 'Middle', 'Ring', 'Pinky'],
      sizes: [
        { size: 'XS', thumb: '14mm', index: '10mm', middle: '11mm', ring: '10mm', pinky: '7mm' },
        { size: 'S', thumb: '15mm', index: '11mm', middle: '12mm', ring: '11mm', pinky: '8mm' },
        { size: 'M', thumb: '16mm', index: '12mm', middle: '13mm', ring: '12mm', pinky: '9mm' },
        { size: 'L', thumb: '18mm', index: '13mm', middle: '14mm', ring: '13mm', pinky: '10mm' },
        { size: 'Custom', thumb: 'Your custom mm', index: 'Your custom mm', middle: 'Your custom mm', ring: 'Your custom mm', pinky: 'Your custom mm' }
      ],
      shapes_heading: 'Nail Shapes & Length Guide',
      shapes_description: 'We craft our press-on nails across 6 signature silhouettes: Almond, Coffin, Oval, Round, Square, and Stiletto, each engineered with reinforced apex curves for natural durability.',
      length_details: [
        { name: 'Short', length: '14mm - 16mm', recommendation: 'Everyday typing, active lifestyle & effortless natural look.' },
        { name: 'Medium', length: '18mm - 22mm', recommendation: 'Our most popular balance of elegant length and practical day-to-day comfort.' },
        { name: 'Long', length: '24mm - 28mm', recommendation: 'Dramatic, statement-making length for glamour events & photoshoots.' },
        { name: 'Extra Long', length: '30mm+', recommendation: 'High-fashion editorial couture finish.' }
      ]
    },
    bundle: {
      page_title: 'Bundle & Save',
      heading: 'Bundle and Save',
      subheading: 'Luxury nail pairings & essential toolkits at exclusive bundle prices.',
      banner_discount: 'Up to 25% OFF',
      disclaimer: 'Discounts automatically applied at checkout when purchasing bundle packages.'
    },
    contact: {
      page_title: 'Contact Us',
      brand_headline: 'X-ON — handmade press-on nails & carefully selected nail essentials.',
      brand_intro: 'X-ON is where modern nail artistry meets effortless beauty.',
      benefits: [
        { title: 'Handmade Press-On Nails', desc: 'Sculpted individually with multi-layered salon builder gel.' },
        { title: 'Nail Essentials', desc: 'Curated formulas and professional tools for seamless application and care.' },
        { title: 'Quality, Style & Performance', desc: 'Crafted for nail lovers and salon professionals alike.' },
        { title: 'Accessible Luxury', desc: 'Easier, faster, and more accessible beauty with a polished, luxury finish.' }
      ],
      address: '3168 Bill Beck Blvd, Kissimmee, FL 34744',
      phone: '689-212-8888',
      form_heading: 'Contact X-ON Team',
      form_description: 'Have questions about sizing, bespoke designs, wholesale applications, or existing orders? Send us a message.'
    },
    legal: {
      terms: {
        title: 'Terms & Conditions',
        last_updated: 'September 2026',
        body: `Welcome to X-ON. By accessing or using our website and purchasing our handmade press-on nails and nail essentials, you agree to comply with and be bound by the following terms and conditions.\n\n### 1. Brand Identity & Product Quality\nX-ON is where modern nail artistry meets effortless beauty. All our press-on nail sets are handmade and crafted with salon-grade materials. Due to the handmade nature of our products, subtle variations may occur, enhancing the unique artisan character of each set.\n\n### 2. Sizing and Custom Orders\nCustomers are responsible for providing accurate sizing measurements according to our Sizing Chart before finalizing custom orders. X-ON provides detailed measurement guidelines to ensure a bespoke fit.\n\n### 3. Shipping & Delivery\nOrders are processed from our Kissimmee, FL studio (3168 Bill Beck Blvd, Kissimmee, FL 34744). Handmade sets require a 3-5 business day production window prior to dispatch.\n\n### 4. Contact\nFor questions regarding terms, contact us at 689-212-8888.`
      },
      privacy: {
        title: 'Privacy Policy',
        last_updated: 'September 2026',
        body: `At X-ON (3168 Bill Beck Blvd, Kissimmee, FL 34744; Phone: 689-212-8888), we are committed to safeguarding your privacy.\n\n### Information We Collect\nWe collect personal information necessary to fulfill your orders, process wholesale applications, and send newsletter updates when you explicitly opt-in. This includes your name, email, phone number, and shipping details.\n\n### Data Protection\nYour information is protected with industry-standard encryption. We never sell or distribute your private contact details to third-party marketing brokers.\n\n### Your Rights\nYou may request access, correction, or deletion of your personal account data by contacting our team.`
      }
    }
  };

  const blogPosts = [
    {
      id: 'blog-1',
      title: 'Extra Long Handmade Nail Luxury: Modern Artistry Meets Effortless Wear',
      slug: 'extra-long-handmade-nail-luxury',
      cover: '/assets/images/IMG_7098.webp',
      publish_date: '2026-09-20',
      author: 'X-ON Master Artist',
      status: 'published',
      excerpt: 'Discover why handmade salon-grade press-on nails are overtaking traditional acrylics in fashion runways and professional studios.',
      content_blocks: [
        {
          type: 'heading',
          text: 'The Evolution of Modern Nail Artistry'
        },
        {
          type: 'paragraph',
          text: 'X-ON is where modern nail artistry meets effortless beauty. For years, nail enthusiasts were forced to choose between hours spent inhaling salon fumes or flimsy plastic store-bought press-ons. Today, handcrafted gel press-ons bridge this divide, offering runway-worthy couture styling without compromising natural nail health.'
        },
        {
          type: 'image',
          url: '/assets/images/IMG_7098.webp',
          caption: 'Hand-painted cat eye chrome finish with multi-layered builder gel.'
        },
        {
          type: 'heading',
          text: 'Statement-Making Style with Professional Durability'
        },
        {
          type: 'paragraph',
          text: 'From statement-making nail sets to everyday professional supplies, every X-ON product is chosen to make beautiful nails easier, faster, and more accessible—without compromising on a polished, luxury finish.'
        },
        {
          type: 'list',
          items: [
            '100% Real Salon Soft Gel & Builder Gel Layers',
            'Reusable up to 5+ times with proper tab and glue removal',
            'Zero salon damage to the natural nail plate',
            'Instant application in under 10 minutes'
          ]
        }
      ],
      comments: [
        {
          id: 'comm-1',
          name: 'Elena Rostova',
          date: '2026-09-21',
          comment: 'The quality of X-ON nails is unmatched! The chrome shine looks exactly like a $120 salon manicure.'
        }
      ]
    },
    {
      id: 'blog-2',
      title: 'The Ultimate Guide to Measuring Your Nail Beds at Home',
      slug: 'ultimate-guide-measuring-nail-beds',
      cover: '/assets/images/IMG_7098.webp',
      publish_date: '2026-09-15',
      author: 'X-ON Studio Team',
      status: 'published',
      excerpt: 'Learn the millimeter tape method to ensure your custom press-on nails look completely seamless and feel natural.',
      content_blocks: [
        {
          type: 'heading',
          text: 'Why Sizing Precision Matters'
        },
        {
          type: 'paragraph',
          text: 'A flawless press-on application begins with finding your true nail width in millimeters across thumb, index, middle, ring, and pinky. When your press-ons fit comfortably from sidewall to sidewall without overflowing onto cuticle skin, wear time increases by up to 300%.'
        }
      ],
      comments: []
    },
    {
      id: 'blog-3',
      title: 'Press On. Slay On. Repeat: Caring for Reusable Nails',
      slug: 'press-on-slay-on-repeat-caring-guide',
      cover: '/assets/images/IMG_7098.webp',
      publish_date: '2026-09-10',
      author: 'X-ON Care Specialist',
      status: 'published',
      excerpt: 'Step-by-step techniques to gently soak off your handmade nails and preserve the gel integrity for repeat wear.',
      content_blocks: [
        {
          type: 'heading',
          text: 'Maximize Your Reusable Investment'
        },
        {
          type: 'paragraph',
          text: 'Our handmade sets are built to withstand multiple applications. Using warm water, oil, and soap soak-off methods allows you to dissolve the adhesive bonds without stripping the handcrafted gel structure.'
        }
      ],
      comments: []
    }
  ];

  const galleryItems = [
    {
      id: 'gal-1',
      title: 'Ethereal Velvet Chrome Cat-Eye',
      collection: 'Now Selling',
      media: '/assets/images/IMG_7098.webp',
      linked_product: 'prod-1',
      size_labels: ['S', 'M', 'L'],
      status: 'published',
      sort_order: 1
    },
    {
      id: 'gal-2',
      title: 'French Blossom Rosebud Almond',
      collection: 'Now Selling',
      media: '/assets/images/IMG_7098.webp',
      linked_product: 'prod-2',
      size_labels: ['S', 'M'],
      status: 'published',
      sort_order: 2
    },
    {
      id: 'gal-3',
      title: 'Obsidian 24K Leaf Stiletto',
      collection: 'Now Selling',
      media: '/assets/images/IMG_7098.webp',
      linked_product: 'prod-3',
      size_labels: ['M', 'L'],
      status: 'published',
      sort_order: 3
    },
    {
      id: 'gal-4',
      title: 'Pearl Aurora Glaze Square',
      collection: 'Now Selling',
      media: '/assets/images/IMG_7098.webp',
      linked_product: 'prod-5',
      size_labels: ['S', 'M', 'L'],
      status: 'published',
      sort_order: 4
    },
    {
      id: 'gal-5',
      title: 'Ruby Crystal Petite Round',
      collection: 'Now Selling',
      media: '/assets/images/IMG_7098.webp',
      linked_product: 'prod-6',
      size_labels: ['S', 'M'],
      status: 'published',
      sort_order: 5
    },
    {
      id: 'gal-6',
      title: 'Modern Minimalist Milk Glaze',
      collection: 'Now Selling',
      media: '/assets/images/IMG_7098.webp',
      linked_product: 'prod-4',
      size_labels: ['XS', 'S', 'M', 'L'],
      status: 'published',
      sort_order: 6
    }
  ];

  const comingSoonCollections = [
    {
      id: 'csc-1',
      title: 'Upcoming / Seasonal Collection 01 — Celestial Twilight',
      collection_name: 'Upcoming / Seasonal Collection 01',
      subtitle: 'Deep galaxy blues, holographic constellation charting, and luminous quartz accents.',
      media: '/assets/images/IMG_7098.webp',
      status: 'active',
      display_order: 1,
      expected_launch: 'Winter 2026'
    },
    {
      id: 'csc-2',
      title: 'Upcoming / Seasonal Collection 02 — Golden Baroque Couture',
      collection_name: 'Upcoming / Seasonal Collection 02',
      subtitle: '3D ornate gold filigree, antique pearls, and textured rococo gilding.',
      media: '/assets/images/IMG_7098.webp',
      status: 'active',
      display_order: 2,
      expected_launch: 'Holiday 2026'
    },
    {
      id: 'csc-3',
      title: 'Upcoming / Seasonal Collection 03 — Cyberpunk Chrome Fluid',
      collection_name: 'Upcoming / Seasonal Collection 03',
      subtitle: 'Molten liquid silver chrome 3D sculpting over smoked translucent glass.',
      media: '/assets/images/IMG_7098.webp',
      status: 'active',
      display_order: 3,
      expected_launch: 'Spring 2027'
    },
    {
      id: 'csc-4',
      title: 'Featured / New Collection — High-Artisan Runway Series',
      collection_name: 'Featured / New Collection',
      subtitle: 'Limited-edition bespoke wearable art handcrafted by master technicians.',
      media: '/assets/images/IMG_7098.webp',
      status: 'active',
      display_order: 4,
      expected_launch: 'Exclusively for Members'
    }
  ];

  const users = [
    {
      id: 'user-admin-1',
      username: 'admin',
      email: 'admin@x-on.com',
      password_hash: adminPasswordHash,
      role: 'admin',
      status: 'active',
      name: 'X-ON System Administrator'
    },
    {
      id: 'user-demo-1',
      username: 'nailartist_sarah',
      email: 'sarah.salon@example.com',
      password_hash: demoUserPasswordHash,
      role: 'wholesale_customer',
      status: 'active',
      name: 'Sarah Jenkins (Studio Belle)'
    },
    {
      id: 'user-demo-2',
      username: 'chloe_nails',
      email: 'chloe.k@example.com',
      password_hash: demoUserPasswordHash,
      role: 'customer',
      status: 'active',
      name: 'Chloe Kim'
    }
  ];

  const wholesaleApplications = [
    {
      id: 'ws-1',
      username: 'belle_studios_fl',
      email: 'contact@bellestudiosfl.com',
      business_name: 'Belle Studios Nail Salon & Spa',
      business_address: '4200 Orange Blossom Trail, Orlando, FL 32839',
      phone: '407-555-0192',
      membership: 'Wholesale customer',
      status: 'approved',
      notes: 'Verified Florida beauty salon tax certificate. Approved for 40% Tier 1 wholesale volume.',
      createdAt: '2026-09-18T10:14:00Z'
    },
    {
      id: 'ws-2',
      username: 'miami_glam_lounge',
      email: 'orders@miamiglamlounge.com',
      business_name: 'Miami Glam Nail Lounge LLC',
      business_address: '888 Brickell Ave, Miami, FL 33131',
      phone: '305-555-0841',
      membership: 'Wholesale customer',
      status: 'pending',
      notes: 'Awaiting business license confirmation document.',
      createdAt: '2026-09-22T14:30:00Z'
    }
  ];

  const inquiries = [
    {
      id: 'inq-1',
      name: 'Sophia Montgomery',
      email: 'sophia.m@gmail.com',
      order_number: 'XON-ORD-8821',
      message: 'Hello X-ON team! I am interested in placing an order for 6 custom-sized sets for my bridal party. Could we customize the base pink shade?',
      status: 'in_review',
      note: 'Sent bridal custom consultation color palette via email.',
      createdAt: '2026-09-22T16:45:00Z'
    },
    {
      id: 'inq-2',
      name: 'Marcus Vance',
      email: 'marcus.vance@studio.org',
      order_number: '',
      message: 'Inquiring about bulk distributor pricing for our salon chain in Tampa.',
      status: 'new',
      note: '',
      createdAt: '2026-09-23T08:15:00Z'
    }
  ];

  const orders = [
    {
      id: 'XON-ORD-9012',
      customer: {
        name: 'Chloe Kim',
        email: 'chloe.k@example.com',
        phone: '407-222-9988'
      },
      line_items: [
        { product_id: 'prod-1', name: 'CF-35-0961 Luxury Chrome Velvet', size: 'M', quantity: 1, price: 39.00 },
        { product_id: 'prod-7', name: 'X-ON Salon Pro Hold Nail Adhesive (15ml)', size: '15ml', quantity: 1, price: 11.50 }
      ],
      subtotal: 50.50,
      shipping: 5.00,
      total: 55.50,
      status: 'Processing',
      payment_status: 'Paid',
      payment_metadata: { method: 'Credit Card (Stripe Ref)', transaction_id: 'ch_3N8x7721' },
      shipping_metadata: {
        address: '1420 Lakeview Dr, Kissimmee, FL 34741',
        carrier: 'USPS Priority',
        tracking: '9405511206213456789012'
      },
      createdAt: '2026-09-22T11:20:00Z'
    },
    {
      id: 'XON-ORD-8821',
      customer: {
        name: 'Elena Rostova',
        email: 'elena.rostova@example.com',
        phone: '689-555-1234'
      },
      line_items: [
        { product_id: 'prod-bundle-1', name: 'Ultimate Luxury Velvet & Essentials Trio Bundle', size: 'S', quantity: 1, price: 74.00 }
      ],
      subtotal: 74.00,
      shipping: 0.00,
      total: 74.00,
      status: 'Completed',
      payment_status: 'Paid',
      payment_metadata: { method: 'Apple Pay', transaction_id: 'ap_9901412' },
      shipping_metadata: {
        address: '772 Palm Way, Orlando, FL 32801',
        carrier: 'FedEx Home Delivery',
        tracking: '782109843210'
      },
      createdAt: '2026-09-20T09:10:00Z'
    }
  ];

  const reviews = [
    {
      id: 'rev-1',
      product_id: 'prod-1',
      rating: 5,
      name: 'Jessica Vance',
      email: 'jess.vance@example.com',
      comment: 'Obsessed is an understatement. The velvet cat eye magnetic sparkle is so dimensional in real life. I have worn them for 18 days now with the X-ON Salon Pro Glue without a single nail lifting!',
      date: '2026-09-19'
    },
    {
      id: 'rev-2',
      product_id: 'prod-1',
      rating: 5,
      name: 'Camila Diaz',
      email: 'camila.d@example.com',
      comment: 'The apex structure on these coffins is flawless. They feel completely sturdy like acrylic extensions but take 5 minutes to put on.',
      date: '2026-09-17'
    },
    {
      id: 'rev-3',
      product_id: 'prod-2',
      rating: 5,
      name: 'Hannah Lee',
      email: 'hannah.l@example.com',
      comment: 'The French smile lines are micro-painted to perfection. Cleanest almond shape I have ever purchased.',
      date: '2026-09-12'
    },
    {
      id: 'rev-4',
      product_id: 'prod-7',
      rating: 5,
      name: 'Rachel Green',
      email: 'rachel.g@example.com',
      comment: 'Best glue hands down. No white residue, no burning sensation, and holds like super cement.',
      date: '2026-09-15'
    }
  ];

  return {
    categories,
    products,
    pageContents,
    blogPosts,
    galleryItems,
    comingSoonCollections,
    users,
    wholesaleApplications,
    inquiries,
    orders,
    reviews
  };
}
