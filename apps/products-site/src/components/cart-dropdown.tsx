import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ShoppingCartIcon, TrashIcon } from "lucide-react"
import { useCart } from "@/contexts/cart-context"
import { useBackgroundDetection } from "@/hooks/useBackgroundDetection"

export function CartDropdown() {
  const { cart, removeFromCart, clearCart, getTotalItems, getTotalPrice } = useCart()
  const [isOpen, setIsOpen] = useState(false)
  const backgroundDetection = useBackgroundDetection()

  const totalItems = getTotalItems()
  const totalPrice = getTotalPrice()

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size="icon" 
          className={`relative border-0 hover:scale-105 transition-all duration-300 adaptive-nav-button ${
            backgroundDetection.backgroundType === 'light' ? 'light-bg' : 
            backgroundDetection.backgroundType === 'dark' ? 'dark-bg' : ''
          }`}
        >
          <ShoppingCartIcon className="h-5 w-5" />
          {totalItems > 0 && (
            <span 
              className={`absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full text-xs font-medium badge-indicator ${
                backgroundDetection.backgroundType === 'light' ? 'light-bg' : 
                backgroundDetection.backgroundType === 'dark' ? 'dark-bg' : ''
              }`}
              style={{
                background: backgroundDetection.backgroundType === 'light' 
                  ? 'linear-gradient(135deg, rgba(239, 68, 68, 0.9) 0%, rgba(220, 38, 38, 0.85) 100%)'
                  : 'linear-gradient(135deg, rgba(239, 68, 68, 0.85) 0%, rgba(220, 38, 38, 0.8) 100%)',
                backdropFilter: 'blur(4px)',
                border: backgroundDetection.backgroundType === 'light' 
                  ? '1px solid rgba(255,255,255,0.3)'
                  : '1px solid rgba(255,255,255,0.2)'
              }}
            >
              {totalItems}
            </span>
          )}
          <span className="sr-only">Shopping Cart</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="w-80 border-0 p-0 overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.9) 100%)',
          backdropFilter: 'blur(25px) saturate(180%)',
          borderRadius: '1.5rem',
          border: '1px solid rgba(255, 255, 255, 0.4)',
          boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.3), 0 8px 32px rgba(0, 0, 0, 0.08), 0 2px 8px rgba(0, 0, 0, 0.04)'
        }}
      >
        {/* Refined Glass Header */}
        <div 
          className="px-6 py-4"
          style={{
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0.1) 100%)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.4)'
          }}
        >
          <DropdownMenuLabel 
            className="text-gray-900"
            style={{
              fontSize: '1.125rem',
              fontWeight: '300',
              letterSpacing: '-0.01em'
            }}
          >
            Your Cart
          </DropdownMenuLabel>
        </div>
        
        {/* Content Area */}
        <div className="p-4">
          {cart.length === 0 ? (
            <div 
              className="text-center py-8 px-4 rounded-lg"
              style={{
                background: 'rgba(255, 255, 255, 0.5)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)'
              }}
            >
              <p 
                className="text-gray-600 font-light"
                style={{
                  fontSize: '15px',
                  fontWeight: '300',
                  letterSpacing: '0.01em'
                }}
              >
                Your cart is empty.
              </p>
            </div>
          ) : (
            <>
              <div className="space-y-3 mb-4">
                {cart.map((item) => (
                  <div 
                    key={item.id} 
                    className="flex items-center justify-between p-3 rounded-lg"
                    style={{
                      background: 'rgba(255, 255, 255, 0.6)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)'
                    }}
                  >
                    <div className="flex-1">
                      <p 
                        className="font-medium text-gray-900"
                        style={{
                          fontSize: '15px',
                          fontWeight: '400',
                          letterSpacing: '0.01em'
                        }}
                      >
                        {item.name}
                      </p>
                      <p 
                        className="text-sm text-gray-600"
                        style={{
                          fontSize: '13px',
                          fontWeight: '300',
                          letterSpacing: '0.01em'
                        }}
                      >
                        {item.quantity} x ${item.price.toFixed(2)}
                      </p>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => removeFromCart(item.id)}
                      className="hover:scale-110 transition-transform duration-200"
                      style={{
                        background: 'rgba(239, 68, 68, 0.08)',
                        border: '1px solid rgba(239, 68, 68, 0.2)',
                        borderRadius: '0.5rem'
                      }}
                    >
                      <TrashIcon className="h-4 w-4 text-red-600" />
                      <span className="sr-only">Remove item</span>
                    </Button>
                  </div>
                ))}
              </div>
              
              {/* Total Section */}
              <div 
                className="p-3 rounded-lg mb-4"
                style={{
                  background: 'rgba(255, 255, 255, 0.8)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(242, 184, 64, 0.2)',
                  boxShadow: '0 2px 8px rgba(242, 184, 64, 0.05)'
                }}
              >
                <div className="flex justify-between font-bold">
                  <span 
                    className="text-gray-900"
                    style={{ fontSize: '15px', fontWeight: '400', letterSpacing: '0.01em' }}
                  >
                    Total:
                  </span>
                  <span 
                    className="text-gray-900"
                    style={{ fontSize: '15px', fontWeight: '500', letterSpacing: '0.01em' }}
                  >
                    ${totalPrice.toFixed(2)}
                  </span>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex gap-2">
                <Button
                  className="flex-1 py-2 rounded-lg border-0 text-white font-medium transition-all duration-300"
                  style={{
                    background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                    boxShadow: '0 4px 12px rgba(245, 158, 11, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-1px)'
                    e.currentTarget.style.boxShadow = '0 6px 16px rgba(245, 158, 11, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.3)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(245, 158, 11, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
                  }}
                  onClick={() => {
                    setIsOpen(false)
                  }}
                >
                  Checkout
                </Button>
                <Button 
                  variant="outline" 
                  className="flex-1 py-2 font-light text-gray-700 border-0 transition-all duration-300" 
                  onClick={clearCart}
                  style={{
                    background: 'rgba(255, 255, 255, 0.6)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(0, 0, 0, 0.1)',
                    fontSize: '14px',
                    fontWeight: '300',
                    letterSpacing: '0.01em'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.8)'
                    e.currentTarget.style.transform = 'translateY(-1px)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.6)'
                    e.currentTarget.style.transform = 'translateY(0)'
                  }}
                >
                  Clear
                </Button>
              </div>
            </>
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}