import { Link } from "react-router-dom"
import { useState } from "react"
import { ChevronDown } from "lucide-react"

export function ResearchNavigation() {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)

  const handleMouseEnter = (menu: string) => {
    setOpenDropdown(menu)
  }

  const handleMouseLeave = () => {
    setOpenDropdown(null)
  }

  return (
    <nav className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50">
      <div
        className="px-8 py-4 flex items-center gap-8 transition-all duration-300"
        style={{
          background: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(25px) saturate(180%)',
          borderRadius: '20px',
          border: '1px solid rgba(255, 255, 255, 0.4)',
          boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.3), 0 8px 32px rgba(0, 0, 0, 0.08), 0 2px 8px rgba(0, 0, 0, 0.04)'
        }}
      >
        {/* Logo */}
        <Link
          to="/"
          className="text-2xl font-semibold tracking-tight hover:opacity-80 transition-opacity"
          style={{
            color: '#007BA7',
            letterSpacing: '-0.01em',
            fontWeight: '600'
          }}
        >
          COW
        </Link>

        {/* Research Dropdown */}
        <div
          className="relative"
          onMouseEnter={() => handleMouseEnter('research')}
          onMouseLeave={handleMouseLeave}
        >
          <button
            className="flex items-center gap-1 text-sm font-light hover:text-gray-900 transition-colors"
            style={{
              color: '#1f2937',
              letterSpacing: '0.01em'
            }}
          >
            Research
            <ChevronDown className="w-4 h-4" />
          </button>

          {openDropdown === 'research' && (
            <div
              className="absolute top-full mt-2 left-0 w-64 rounded-xl shadow-lg overflow-hidden"
              style={{
                background: 'rgba(255, 255, 255, 0.98)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(0, 0, 0, 0.08)'
              }}
            >
              <Link
                to="/research"
                className="block px-4 py-3 text-sm font-light hover:bg-gray-50 transition-colors"
                style={{ color: '#374151' }}
              >
                <div className="font-medium mb-1">Research Center</div>
                <div className="text-xs text-gray-500">Browse all research papers</div>
              </Link>
              <div className="border-t border-gray-100" />
              <Link
                to="/research"
                className="block px-4 py-3 text-sm font-light hover:bg-gray-50 transition-colors"
                style={{ color: '#374151' }}
              >
                Wealth Diagnostics
              </Link>
              <Link
                to="/research"
                className="block px-4 py-3 text-sm font-light hover:bg-gray-50 transition-colors"
                style={{ color: '#374151' }}
              >
                Asset Performance
              </Link>
              <Link
                to="/research"
                className="block px-4 py-3 text-sm font-light hover:bg-gray-50 transition-colors"
                style={{ color: '#374151' }}
              >
                Financial Architecture
              </Link>
            </div>
          )}
        </div>

        {/* Intelligence Integration Dropdown */}
        <div
          className="relative"
          onMouseEnter={() => handleMouseEnter('intelligence')}
          onMouseLeave={handleMouseLeave}
        >
          <button
            className="flex items-center gap-1 text-sm font-light hover:text-gray-900 transition-colors"
            style={{
              color: '#6b7280',
              letterSpacing: '0.01em'
            }}
          >
            Intelligence Integration
            <ChevronDown className="w-4 h-4" />
          </button>

          {openDropdown === 'intelligence' && (
            <div
              className="absolute top-full mt-2 left-0 w-64 rounded-xl shadow-lg overflow-hidden"
              style={{
                background: 'rgba(255, 255, 255, 0.98)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(0, 0, 0, 0.08)'
              }}
            >
              <Link
                to="#"
                className="block px-4 py-3 text-sm font-light hover:bg-gray-50 transition-colors"
                style={{ color: '#374151' }}
              >
                <div className="font-medium mb-1">AI-Powered Analytics</div>
                <div className="text-xs text-gray-500">Machine learning for asset optimization</div>
              </Link>
              <div className="border-t border-gray-100" />
              <Link
                to="#"
                className="block px-4 py-3 text-sm font-light hover:bg-gray-50 transition-colors"
                style={{ color: '#374151' }}
              >
                Algorithmic Optimization
              </Link>
              <Link
                to="#"
                className="block px-4 py-3 text-sm font-light hover:bg-gray-50 transition-colors"
                style={{ color: '#374151' }}
              >
                Predictive Modeling
              </Link>
            </div>
          )}
        </div>

        {/* Commitments Dropdown */}
        <div
          className="relative"
          onMouseEnter={() => handleMouseEnter('commitments')}
          onMouseLeave={handleMouseLeave}
        >
          <button
            className="flex items-center gap-1 text-sm font-light hover:text-gray-900 transition-colors"
            style={{
              color: '#6b7280',
              letterSpacing: '0.01em'
            }}
          >
            Commitments
            <ChevronDown className="w-4 h-4" />
          </button>

          {openDropdown === 'commitments' && (
            <div
              className="absolute top-full mt-2 left-0 w-64 rounded-xl shadow-lg overflow-hidden"
              style={{
                background: 'rgba(255, 255, 255, 0.98)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(0, 0, 0, 0.08)'
              }}
            >
              <Link
                to="#"
                className="block px-4 py-3 text-sm font-light hover:bg-gray-50 transition-colors"
                style={{ color: '#374151' }}
              >
                <div className="font-medium mb-1">Transparency</div>
                <div className="text-xs text-gray-500">Open research and methodology</div>
              </Link>
              <div className="border-t border-gray-100" />
              <Link
                to="#"
                className="block px-4 py-3 text-sm font-light hover:bg-gray-50 transition-colors"
                style={{ color: '#374151' }}
              >
                Accessibility
              </Link>
              <Link
                to="#"
                className="block px-4 py-3 text-sm font-light hover:bg-gray-50 transition-colors"
                style={{ color: '#374151' }}
              >
                Long-Duration Value
              </Link>
            </div>
          )}
        </div>

        {/* Learn Dropdown */}
        <div
          className="relative"
          onMouseEnter={() => handleMouseEnter('learn')}
          onMouseLeave={handleMouseLeave}
        >
          <button
            className="flex items-center gap-1 text-sm font-light hover:text-gray-900 transition-colors"
            style={{
              color: '#6b7280',
              letterSpacing: '0.01em'
            }}
          >
            Learn
            <ChevronDown className="w-4 h-4" />
          </button>

          {openDropdown === 'learn' && (
            <div
              className="absolute top-full mt-2 left-0 w-64 rounded-xl shadow-lg overflow-hidden"
              style={{
                background: 'rgba(255, 255, 255, 0.98)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(0, 0, 0, 0.08)'
              }}
            >
              <Link
                to="#"
                className="block px-4 py-3 text-sm font-light hover:bg-gray-50 transition-colors"
                style={{ color: '#374151' }}
              >
                <div className="font-medium mb-1">Documentation</div>
                <div className="text-xs text-gray-500">Guides and tutorials</div>
              </Link>
              <div className="border-t border-gray-100" />
              <Link
                to="#"
                className="block px-4 py-3 text-sm font-light hover:bg-gray-50 transition-colors"
                style={{ color: '#374151' }}
              >
                Performance RWAs 101
              </Link>
              <Link
                to="#"
                className="block px-4 py-3 text-sm font-light hover:bg-gray-50 transition-colors"
                style={{ color: '#374151' }}
              >
                Asset Classes
              </Link>
              <Link
                to="#"
                className="block px-4 py-3 text-sm font-light hover:bg-gray-50 transition-colors"
                style={{ color: '#374151' }}
              >
                Developer Docs
              </Link>
            </div>
          )}
        </div>

        {/* News Link */}
        <Link
          to="#"
          className="text-sm font-light hover:text-gray-900 transition-colors"
          style={{
            color: '#6b7280',
            letterSpacing: '0.01em'
          }}
        >
          News
        </Link>

        {/* Build COW CTA */}
        <button
          className="px-6 py-2 rounded-full text-sm font-medium transition-all hover:shadow-lg"
          style={{
            background: '#007BA7',
            color: 'white',
            letterSpacing: '0.01em'
          }}
        >
          Build COW
        </button>
      </div>
    </nav>
  )
}
