import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Search, User, ShoppingCart, Menu, X } from 'lucide-react';

const Header = () => {
  const [activeMenu, setActiveMenu] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setActiveMenu(null);
    }, 200);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="w-full bg-white">
      {/* Top Banner */}
      <div className="bg-gray-50 text-center py-2 text-sm text-gray-600 border-b">
        Welcome to our store
      </div>

      {/* Main Header - SINGLE LINE WITH LOGO AND NAV */}
      <div className="border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Logo - LEFT SIDE */}
            <div className="flex-shrink-0">
              <a href="/" className="text-xl md:text-2xl font-medium text-gray-700 hover:text-gray-900">
                Sri Furniture Village
              </a>
            </div>

            {/* Desktop Navigation - CENTER (HORIZONTAL) */}
            <nav className="hidden lg:flex items-center space-x-6 flex-1 justify-center">
              {Object.keys(menuData).map((menu) => (
                <div
                  key={menu}
                  className="relative"
                  onMouseEnter={() => handleMouseEnter(menu)}
                  onMouseLeave={handleMouseLeave}
                >
                  <button className="flex items-center text-sm text-gray-600 hover:text-gray-900 transition-colors whitespace-nowrap py-5">
                    {menu}
                    <ChevronDown className="ml-1 h-3.5 w-3.5" />
                  </button>

                  {/* Dropdown Menu */}
                  {activeMenu === menu && (
                    <div className="absolute left-0 top-full mt-0 w-64 bg-white border border-gray-200 shadow-lg z-50">
                      <div className="py-2">
                        {menuData[menu].sections.map((section, idx) => (
                          <div key={idx} className="px-4 py-2">
                            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 flex items-center justify-between">
                              {section.title}
                              <ChevronDown className="h-3 w-3" />
                            </h3>
                            <ul className="space-y-1">
                              {section.items.map((item, itemIdx) => (
                                <li key={itemIdx}>
                                  <a
                                    href={`/collections/${item.toLowerCase().replace(/\s+/g, '-').replace(/\+/g, '')}`}
                                    className="block py-1.5 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-50 px-2 rounded transition-colors"
                                  >
                                    {item}
                                  </a>
                                </li>
                              ))}
                            </ul>
                            {idx < menuData[menu].sections.length - 1 && (
                              <div className="border-b border-gray-100 mt-3"></div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </nav>

            {/* Right Icons */}
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-600 hover:text-gray-900 transition-colors">
                <Search className="h-5 w-5" />
              </button>
              <a href="/login" className="p-2 text-gray-600 hover:text-gray-900 transition-colors">
                <User className="h-5 w-5" />
              </a>
              <a href="/cart" className="p-2 text-gray-600 hover:text-gray-900 transition-colors relative">
                <ShoppingCart className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  0
                </span>
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

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-gray-200 bg-white absolute w-full z-40 shadow-lg">
          <div className="max-w-7xl mx-auto px-4 py-4 max-h-96 overflow-y-auto">
            {Object.keys(menuData).map((menu) => (
              <div key={menu} className="mb-4">
                <button
                  onClick={() => setActiveMenu(activeMenu === menu ? null : menu)}
                  className="flex items-center justify-between w-full py-2 text-left font-medium text-gray-900"
                >
                  {menu}
                  <ChevronDown className={`h-4 w-4 transition-transform ${activeMenu === menu ? 'rotate-180' : ''}`} />
                </button>
                
                {activeMenu === menu && (
                  <div className="pl-4 mt-2 space-y-3">
                    {menuData[menu].sections.map((section, idx) => (
                      <div key={idx}>
                        <h3 className="text-xs font-semibold text-gray-500 uppercase mb-1">
                          {section.title}
                        </h3>
                        <ul className="space-y-1">
                          {section.items.map((item, itemIdx) => (
                            <li key={itemIdx}>
                              <a
                                href={`/collections/${item.toLowerCase().replace(/\s+/g, '-').replace(/\+/g, '')}`}
                                className="block py-1 text-sm text-gray-700"
                                onClick={() => setIsMobileMenuOpen(false)}
                              >
                                {item}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Header;