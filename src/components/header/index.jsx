import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Search, User, ShoppingCart, Menu, X } from 'lucide-react';

const Header = () => {
  const [activeMenu, setActiveMenu] = useState(null);
  const [activeSubmenu, setActiveSubmenu] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeMobileSubmenu, setActiveMobileSubmenu] = useState({});
  const timeoutRef = useRef(null);

  const menuData = {
    'Sofas': {
      sections: [
        {
          title: 'SOFA SETS',
          items: ['Wooden Sofas', 'Sofa Cum Beds', '3+1+1 Sofa Sets', '3 Seater Sofas', '1 Seater Sofas', 'L Shaped Sofas']
        },
        {
          title: 'SEATING',
          items: ['Wooden Diwan', 'Benches', 'Wooden Stools']
        },
        {
          title: 'SOFA CUM BEDS',
          items: ['Fabric Sofa Cum Beds', 'Wooden Sofa Cum Beds']
        }
      ]
    },
    'Living': {
      sections: [
        {
          title: 'STORAGE',
          items: ['TV Units', 'Cabinets', 'Shoe Racks', 'Bookshelves']
        },
        {
          title: 'TABLES',
          items: ['Coffee Tables', 'Nesting Tables', 'Side Tables']
        }
      ]
    },
    'Bedroom': {
      sections: [
        {
          title: 'BEDS',
          items: ['King Size Beds', 'Queen Size Beds', 'Single Beds', 'Hydraulic Beds']
        },
        {
          title: 'STORAGE',
          items: ['Wardrobes', 'Chest of Drawers', 'Bedside Tables']
        }
      ]
    },
    'Dining & Kitchen': {
      sections: [
        {
          title: 'DINING',
          items: ['Dining Sets', 'Dining Tables', 'Dining Chairs', 'Bar Furniture']
        },
        {
          title: 'KITCHEN',
          items: ['Kitchen Cabinets', 'Kitchen Trolleys']
        }
      ]
    },
    'Storage': {
      sections: [
        {
          title: 'STORAGE UNITS',
          items: ['Wardrobes', 'Cabinets', 'Shoe Racks', 'Bookshelves', 'Chest of Drawers']
        }
      ]
    },
    'Study & Office': {
      sections: [
        {
          title: 'OFFICE FURNITURE',
          items: ['Study Tables', 'Office Tables', 'Office Chairs', 'Bookshelves']
        }
      ]
    },
    'Mattresses': {
      sections: [
        {
          title: 'MATTRESSES',
          items: ['Memory Foam', 'Orthopedic', 'Spring Mattresses']
        }
      ]
    },
    'Home Furnishing': {
      sections: [
        {
          title: 'FURNISHING',
          items: ['Cushions', 'Curtains', 'Bed Sheets', 'Rugs']
        }
      ]
    }
  };

  const handleMouseEnter = (menu) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setActiveMenu(menu);
    setActiveSubmenu(null);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setActiveMenu(null);
      setActiveSubmenu(null);
    }, 200);
  };

  const toggleSubmenu = (submenuName) => {
    setActiveSubmenu(activeSubmenu === submenuName ? null : submenuName);
  };

  const toggleMobileSubmenu = (menu, section) => {
    const key = `${menu}-${section}`;
    setActiveMobileSubmenu(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isMobileMenuOpen]);

  return (
    <>
      {/* Fixed Header */}
      <header className="w-full bg-white fixed top-0 left-0 right-0 z-50 shadow-sm">
        {/* Top Banner */}
        <div className="bg-white text-center py-2.5 text-sm text-gray-600 border-b border-gray-200">
          <p className="font-light">Welcome to our store</p>
        </div>

        {/* Main Header - Single Line */}
        <div className="border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-20">
              
              {/* Logo - LEFT */}
              <div className="flex-shrink-0">
                <a 
                  href="/" 
                  className="text-xl md:text-2xl font-normal text-gray-800 hover:text-gray-900 transition-colors"
                >
                  Sri Furniture Village
                </a>
              </div>

              {/* Navigation Menu - CENTER (Single horizontal line) */}
              <nav className="hidden lg:flex items-center space-x-6">
                {Object.keys(menuData).map((menu) => (
                  <div
                    key={menu}
                    className="relative"
                    onMouseEnter={() => handleMouseEnter(menu)}
                    onMouseLeave={handleMouseLeave}
                  >
                    <button 
                      className="flex items-center text-sm text-gray-600 hover:text-gray-900 transition-colors py-6 whitespace-nowrap"
                    >
                      {menu}
                      <ChevronDown className="ml-1 h-4 w-4" />
                    </button>

                    {/* Desktop Dropdown */}
                    {activeMenu === menu && (
                      <div 
                        className="absolute left-0 top-full w-56 bg-white border border-gray-200 shadow-lg z-50"
                        onMouseEnter={() => handleMouseEnter(menu)}
                        onMouseLeave={handleMouseLeave}
                      >
                        {menuData[menu].sections.map((section, idx) => (
                          <div key={idx}>
                            <button
                              onClick={() => toggleSubmenu(section.title)}
                              className="w-full flex items-center justify-between px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 border-b border-gray-200 text-left"
                            >
                              <span className="uppercase text-xs tracking-wide font-medium">{section.title}</span>
                              <ChevronDown 
                                className={`h-4 w-4 transition-transform ${activeSubmenu === section.title ? 'rotate-180' : ''}`} 
                              />
                            </button>
                            
                            {/* Nested Items */}
                            {activeSubmenu === section.title && (
                              <div className="bg-white">
                                {section.items.map((item, itemIdx) => (
                                  <a
                                    key={itemIdx}
                                    href={`/collections/${item.toLowerCase().replace(/\s+/g, '-').replace(/\+/g, '')}`}
                                    className="block px-6 py-2.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                                  >
                                    {item}
                                  </a>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </nav>

              {/* Right Icons - FIXED POSITION */}
              <div className="flex items-center space-x-2">
                <button className="p-2 text-gray-600 hover:text-gray-900 transition-colors">
                  <Search className="h-5 w-5" />
                </button>
                <a href="/login" className="p-2 text-gray-600 hover:text-gray-900 transition-colors">
                  <User className="h-5 w-5" />
                </a>
                <a href="/cart" className="p-2 text-gray-600 hover:text-gray-900 transition-colors">
                  <ShoppingCart className="h-5 w-5" />
                </a>
                
                {/* Mobile Menu Button */}
                <button 
                  className="lg:hidden p-2 text-gray-600 hover:text-gray-900"
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                  {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Spacer to prevent content from hiding under fixed header */}
      <div className="h-[108px]"></div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Menu */}
      <div 
        className={`lg:hidden fixed top-[108px] left-0 right-0 bottom-0 bg-white z-40 transform transition-transform duration-300 ease-in-out overflow-y-auto shadow-xl ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="px-4 py-6">
          {Object.keys(menuData).map((menu) => (
            <div key={menu} className="border-b border-gray-200 last:border-b-0">
              <button
                onClick={() => setActiveMenu(activeMenu === menu ? null : menu)}
                className="flex items-center justify-between w-full py-4 text-left text-sm text-gray-700"
              >
                {menu}
                <ChevronDown 
                  className={`h-4 w-4 transition-transform ${activeMenu === menu ? 'rotate-180' : ''}`} 
                />
              </button>
              
              {activeMenu === menu && (
                <div className="pl-4 mt-2 space-y-2">
                  {menuData[menu].sections.map((section, idx) => (
                    <div key={idx}>
                      <button
                        onClick={() => toggleMobileSubmenu(menu, section.title)}
                        className="flex items-center justify-between w-full text-xs font-semibold text-gray-500 uppercase mb-1"
                      >
                        {section.title}
                        <ChevronDown 
                          className={`h-3 w-3 transition-transform ${activeMobileSubmenu[`${menu}-${section.title}`] ? 'rotate-180' : ''}`} 
                        />
                      </button>
                      {activeMobileSubmenu[`${menu}-${section.title}`] && (
                        <ul className="space-y-1 pl-2">
                          {section.items.map((item, itemIdx) => (
                            <li key={itemIdx}>
                              <a
                                href={`/collections/${item.toLowerCase().replace(/\s+/g, '-').replace(/\+/g, '')}`}
                                className="block py-1 text-sm text-gray-600"
                                onClick={() => {
                                  setIsMobileMenuOpen(false);
                                  setActiveMenu(null);
                                  setActiveMobileSubmenu({});
                                }}
                              >
                                {item}
                              </a>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Demo Content for Scrolling Test */}
      {/* <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="space-y-4">
          {[...Array(20)].map((_, i) => (
            <div key={i} className="bg-gray-100 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Product {i + 1}</h3>
              <p className="text-gray-600">This is sample content to demonstrate scrolling behavior with fixed header.</p>
            </div>
          ))}
        </div>
      </div> */}
    </>
  );
};

export default Header;