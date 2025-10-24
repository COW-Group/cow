import { useState } from "react"
import { Link } from "react-router-dom"
import { Grip, Coins, Plane, Milk, Wheat, Train, Wine } from "lucide-react"
import { useBackgroundDetection } from "@/hooks/useBackgroundDetection"

export function ProductMenu() {
  const [isOpen, setIsOpen] = useState(false)
  const backgroundDetection = useBackgroundDetection()

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center justify-center p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all duration-200 ${
          backgroundDetection.backgroundType === 'light' ? 'light-bg' :
          backgroundDetection.backgroundType === 'dark' ? 'dark-bg' : ''
        }`}
        onBlur={(e) => {
          // Close dropdown when clicking outside
          if (!e.currentTarget.contains(e.relatedTarget)) {
            setTimeout(() => setIsOpen(false), 150)
          }
        }}
        aria-label="Products menu"
      >
        <Grip className="w-5 h-5 text-gray-600 dark:text-gray-300" />
      </button>
      {isOpen && (
        <div
          className="absolute top-full mt-3 right-0 w-96 border-0 overflow-y-auto max-h-[calc(100vh-120px)]"
          style={{
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px) saturate(180%)',
            borderRadius: '1.5rem',
            border: '1px solid rgba(255, 255, 255, 0.4)',
            boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.3), 0 8px 32px rgba(0, 0, 0, 0.08), 0 2px 8px rgba(0, 0, 0, 0.04)'
          }}
        >
          {/* Header */}
          <div 
            className="px-6 py-4"
            style={{
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0.1) 100%)',
              borderBottom: '1px solid rgba(255, 255, 255, 0.4)'
            }}
          >
            <h2 className="text-lg font-light tracking-tight text-gray-900">
              COW Asset Tokens
            </h2>
            <p className="text-xs mt-1 font-light text-gray-500">
              Performance Real-World Asset Tokens
            </p>
          </div>

          {/* Products Grid */}
          <div className="p-6 space-y-4">
            <Link 
              to="/ausiri" 
              className="block group" 
              onClick={() => setIsOpen(false)}
            >
              <div 
                className="p-5 rounded-2xl transition-all duration-300 group-hover:scale-[1.02]"
                style={{
                  background: 'rgba(255, 255, 255, 0.8)',
                  backdropFilter: 'blur(12px)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.4), 0 4px 12px rgba(0, 0, 0, 0.04)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.9)'
                  e.currentTarget.style.borderColor = 'rgba(245, 158, 11, 0.3)'
                  e.currentTarget.style.boxShadow = 'inset 0 1px 0 rgba(255, 255, 255, 0.5), 0 8px 24px rgba(245, 158, 11, 0.15)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.8)'
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)'
                  e.currentTarget.style.boxShadow = 'inset 0 1px 0 rgba(255, 255, 255, 0.4), 0 4px 12px rgba(0, 0, 0, 0.04)'
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div 
                        className="w-10 h-10 rounded-xl flex items-center justify-center"
                        style={{
                          background: 'linear-gradient(to bottom right, rgb(251, 191, 36), rgb(245, 158, 11))',
                          boxShadow: '0 8px 32px rgba(245, 158, 11, 0.4), 0 4px 16px rgba(245, 158, 11, 0.2)'
                        }}
                      >
                        <Coins className="w-5 h-5 text-white drop-shadow-sm" />
                        <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-xl"></div>
                      </div>
                      <div>
                        <h3 className="font-light text-base tracking-tight text-gray-900 mb-1">
                          AuSIRI
                        </h3>
                        <span 
                          className="text-xs px-3 py-1 rounded-full font-medium"
                          style={{
                            background: 'rgb(251, 243, 201)',
                            color: 'rgb(180, 83, 9)'
                          }}
                        >
                          Pre-Launch
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 font-light leading-relaxed">
                      Gold-backed performance token with verified reserves
                    </p>
                  </div>
                </div>
              </div>
            </Link>

            <Link 
              to="/auaero" 
              className="block group" 
              onClick={() => setIsOpen(false)}
            >
              <div 
                className="p-5 rounded-2xl transition-all duration-300 group-hover:scale-[1.02]"
                style={{
                  background: 'rgba(255, 255, 255, 0.8)',
                  backdropFilter: 'blur(12px)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.4), 0 4px 12px rgba(0, 0, 0, 0.04)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.9)'
                  e.currentTarget.style.borderColor = 'rgba(251, 146, 60, 0.3)'
                  e.currentTarget.style.boxShadow = 'inset 0 1px 0 rgba(255, 255, 255, 0.5), 0 8px 24px rgba(251, 146, 60, 0.15)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.8)'
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)'
                  e.currentTarget.style.boxShadow = 'inset 0 1px 0 rgba(255, 255, 255, 0.4), 0 4px 12px rgba(0, 0, 0, 0.04)'
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div 
                        className="w-10 h-10 rounded-xl flex items-center justify-center"
                        style={{
                          background: 'linear-gradient(to bottom right, rgb(251, 146, 60), rgb(239, 68, 68))',
                          boxShadow: '0 8px 32px rgba(251, 146, 60, 0.4), 0 4px 16px rgba(251, 146, 60, 0.2)'
                        }}
                      >
                        <Plane className="w-5 h-5 text-white drop-shadow-sm" />
                        <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-xl"></div>
                      </div>
                      <div>
                        <h3 className="font-light text-base tracking-tight text-gray-900 mb-1">
                          AuAERO
                        </h3>
                        <span 
                          className="text-xs px-3 py-1 rounded-full font-medium"
                          style={{
                            background: 'rgb(255, 237, 213)',
                            color: 'rgb(194, 65, 12)'
                          }}
                        >
                          Pre-Launch
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 font-light leading-relaxed">
                      Gold + Aviation assets with performance optimization
                    </p>
                  </div>
                </div>
              </div>
            </Link>

            <Link
              to="/dairy"
              className="block group"
              onClick={() => setIsOpen(false)}
            >
              <div
                className="p-5 rounded-2xl transition-all duration-300 group-hover:scale-[1.02]"
                style={{
                  background: 'rgba(255, 255, 255, 0.8)',
                  backdropFilter: 'blur(12px)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.4), 0 4px 12px rgba(0, 0, 0, 0.04)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.9)'
                  e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.3)'
                  e.currentTarget.style.boxShadow = 'inset 0 1px 0 rgba(255, 255, 255, 0.5), 0 8px 24px rgba(59, 130, 246, 0.15)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.8)'
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)'
                  e.currentTarget.style.boxShadow = 'inset 0 1px 0 rgba(255, 255, 255, 0.4), 0 4px 12px rgba(0, 0, 0, 0.04)'
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center"
                        style={{
                          background: 'linear-gradient(to bottom right, rgb(59, 130, 246), rgb(37, 99, 235))',
                          boxShadow: '0 8px 32px rgba(59, 130, 246, 0.4), 0 4px 16px rgba(59, 130, 246, 0.2)'
                        }}
                      >
                        <Milk className="w-5 h-5 text-white drop-shadow-sm" />
                        <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-xl"></div>
                      </div>
                      <div>
                        <h3 className="font-light text-base tracking-tight text-gray-900 mb-1">
                          Dairy
                        </h3>
                        <span
                          className="text-xs px-3 py-1 rounded-full font-medium"
                          style={{
                            background: 'rgb(219, 234, 254)',
                            color: 'rgb(29, 78, 216)'
                          }}
                        >
                          Coming Soon
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 font-light leading-relaxed">
                      Dairy production and distribution asset token
                    </p>
                  </div>
                </div>
              </div>
            </Link>

            <Link
              to="/food"
              className="block group"
              onClick={() => setIsOpen(false)}
            >
              <div
                className="p-5 rounded-2xl transition-all duration-300 group-hover:scale-[1.02]"
                style={{
                  background: 'rgba(255, 255, 255, 0.8)',
                  backdropFilter: 'blur(12px)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.4), 0 4px 12px rgba(0, 0, 0, 0.04)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.9)'
                  e.currentTarget.style.borderColor = 'rgba(34, 197, 94, 0.3)'
                  e.currentTarget.style.boxShadow = 'inset 0 1px 0 rgba(255, 255, 255, 0.5), 0 8px 24px rgba(34, 197, 94, 0.15)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.8)'
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)'
                  e.currentTarget.style.boxShadow = 'inset 0 1px 0 rgba(255, 255, 255, 0.4), 0 4px 12px rgba(0, 0, 0, 0.04)'
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center"
                        style={{
                          background: 'linear-gradient(to bottom right, rgb(34, 197, 94), rgb(22, 163, 74))',
                          boxShadow: '0 8px 32px rgba(34, 197, 94, 0.4), 0 4px 16px rgba(34, 197, 94, 0.2)'
                        }}
                      >
                        <Wheat className="w-5 h-5 text-white drop-shadow-sm" />
                        <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-xl"></div>
                      </div>
                      <div>
                        <h3 className="font-light text-base tracking-tight text-gray-900 mb-1">
                          Food
                        </h3>
                        <span
                          className="text-xs px-3 py-1 rounded-full font-medium"
                          style={{
                            background: 'rgb(220, 252, 231)',
                            color: 'rgb(21, 128, 61)'
                          }}
                        >
                          Coming Soon
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 font-light leading-relaxed">
                      Food supply chain and agriculture asset token
                    </p>
                  </div>
                </div>
              </div>
            </Link>

            <Link
              to="/aurail"
              className="block group"
              onClick={() => setIsOpen(false)}
            >
              <div
                className="p-5 rounded-2xl transition-all duration-300 group-hover:scale-[1.02]"
                style={{
                  background: 'rgba(255, 255, 255, 0.8)',
                  backdropFilter: 'blur(12px)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.4), 0 4px 12px rgba(0, 0, 0, 0.04)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.9)'
                  e.currentTarget.style.borderColor = 'rgba(168, 85, 247, 0.3)'
                  e.currentTarget.style.boxShadow = 'inset 0 1px 0 rgba(255, 255, 255, 0.5), 0 8px 24px rgba(168, 85, 247, 0.15)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.8)'
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)'
                  e.currentTarget.style.boxShadow = 'inset 0 1px 0 rgba(255, 255, 255, 0.4), 0 4px 12px rgba(0, 0, 0, 0.04)'
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center"
                        style={{
                          background: 'linear-gradient(to bottom right, rgb(168, 85, 247), rgb(147, 51, 234))',
                          boxShadow: '0 8px 32px rgba(168, 85, 247, 0.4), 0 4px 16px rgba(168, 85, 247, 0.2)'
                        }}
                      >
                        <Train className="w-5 h-5 text-white drop-shadow-sm" />
                        <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-xl"></div>
                      </div>
                      <div>
                        <h3 className="font-light text-base tracking-tight text-gray-900 mb-1">
                          AuRail
                        </h3>
                        <span
                          className="text-xs px-3 py-1 rounded-full font-medium"
                          style={{
                            background: 'rgb(243, 232, 255)',
                            color: 'rgb(107, 33, 168)'
                          }}
                        >
                          Coming Soon
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 font-light leading-relaxed">
                      Railway infrastructure and operations asset token
                    </p>
                  </div>
                </div>
              </div>
            </Link>

            <Link
              to="/sura"
              className="block group"
              onClick={() => setIsOpen(false)}
            >
              <div
                className="p-5 rounded-2xl transition-all duration-300 group-hover:scale-[1.02]"
                style={{
                  background: 'rgba(255, 255, 255, 0.8)',
                  backdropFilter: 'blur(12px)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.4), 0 4px 12px rgba(0, 0, 0, 0.04)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.9)'
                  e.currentTarget.style.borderColor = 'rgba(217, 119, 6, 0.3)'
                  e.currentTarget.style.boxShadow = 'inset 0 1px 0 rgba(255, 255, 255, 0.5), 0 8px 24px rgba(217, 119, 6, 0.15)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.8)'
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)'
                  e.currentTarget.style.boxShadow = 'inset 0 1px 0 rgba(255, 255, 255, 0.4), 0 4px 12px rgba(0, 0, 0, 0.04)'
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center"
                        style={{
                          background: 'linear-gradient(to bottom right, rgb(217, 119, 6), rgb(180, 83, 9))',
                          boxShadow: '0 8px 32px rgba(217, 119, 6, 0.4), 0 4px 16px rgba(217, 119, 6, 0.2)'
                        }}
                      >
                        <Wine className="w-5 h-5 text-white drop-shadow-sm" />
                        <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-xl"></div>
                      </div>
                      <div>
                        <h3 className="font-light text-base tracking-tight text-gray-900 mb-1">
                          Sura
                        </h3>
                        <span
                          className="text-xs px-3 py-1 rounded-full font-medium"
                          style={{
                            background: 'rgb(254, 243, 199)',
                            color: 'rgb(146, 64, 14)'
                          }}
                        >
                          Coming Soon
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 font-light leading-relaxed">
                      Premium whiskey production and cask investment token
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          </div>

          {/* Footer with More Products Link */}
          <div 
            className="px-6 py-4"
            style={{
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.1) 100%)',
              borderTop: '1px solid rgba(255, 255, 255, 0.3)'
            }}
          >
            <Link 
              to="/products" 
              className="block text-center group"
              onClick={() => setIsOpen(false)}
            >
              <span className="text-sm text-gray-500 hover:text-gray-900 font-light tracking-wide transition-colors duration-200">
                View All Products →
              </span>
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}