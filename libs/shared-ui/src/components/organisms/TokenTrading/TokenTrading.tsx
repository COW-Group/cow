/**
 * COW Token Trading Component
 * Comprehensive trading interface with order management
 */

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../molecules/Card';
import { Button } from '../../atoms/Button';
import { Input } from '../../atoms/Input';
import { Text } from '../../atoms/Text';
import { Badge, NetworkBadge } from '../../atoms/Badge';
import { WalletButton } from '../../molecules/WalletButton';
import { 
  TrendingUp, 
  TrendingDown, 
  ArrowUpDown, 
  Clock, 
  Check, 
  X,
  AlertTriangle,
  Info
} from 'lucide-react';
import { cn } from '../../../utils/cn';

// Trading interfaces
interface TokenInfo {
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  volume24h: number;
  marketCap: number;
  network: 'ethereum' | 'polygon' | 'solana' | 'bitcoin';
  icon?: string;
}

interface OrderBook {
  asks: Array<{ price: number; amount: number; total: number }>;
  bids: Array<{ price: number; amount: number; total: number }>;
}

interface Transaction {
  id: string;
  type: 'buy' | 'sell';
  token: string;
  amount: number;
  price: number;
  total: number;
  status: 'pending' | 'completed' | 'failed';
  timestamp: Date;
  hash?: string;
}

// Trading component props
export interface TokenTradingProps {
  selectedToken?: TokenInfo;
  tokens?: TokenInfo[];
  orderBook?: OrderBook;
  recentTransactions?: Transaction[];
  walletConnected?: boolean;
  userBalance?: Record<string, number>;
  onTrade?: (order: { type: 'buy' | 'sell'; amount: number; price: number }) => Promise<void>;
  onTokenSelect?: (token: TokenInfo) => void;
}

// Default data
const defaultTokens: TokenInfo[] = [
  {
    symbol: 'TECH',
    name: 'TechCorp Token',
    price: 125.50,
    change24h: 8.2,
    volume24h: 2450000,
    marketCap: 15600000,
    network: 'ethereum',
  },
  {
    symbol: 'GREEN',
    name: 'GreenEnergy Co',
    price: 98.75,
    change24h: 15.1,
    volume24h: 1850000,
    marketCap: 12400000,
    network: 'polygon',
  },
  {
    symbol: 'FIN',
    name: 'FinTech Solutions',
    price: 67.30,
    change24h: 6.7,
    volume24h: 980000,
    marketCap: 8900000,
    network: 'solana',
  },
];

const defaultOrderBook: OrderBook = {
  asks: [
    { price: 125.60, amount: 150, total: 18840 },
    { price: 125.55, amount: 200, total: 25110 },
    { price: 125.50, amount: 175, total: 21962.5 },
  ],
  bids: [
    { price: 125.45, amount: 180, total: 22581 },
    { price: 125.40, amount: 220, total: 27588 },
    { price: 125.35, amount: 160, total: 20056 },
  ],
};

// Order book component
const OrderBookDisplay: React.FC<{ orderBook: OrderBook }> = ({ orderBook }) => {
  return (
    <Card variant=\"glass\">
      <CardHeader>
        <CardTitle level={5}>Order Book</CardTitle>
      </CardHeader>
      <CardContent>
        <div className=\"space-y-4\">
          {/* Asks (Sell orders) */}
          <div>
            <Text variant=\"caption\" color=\"muted\" className=\"mb-2\">
              Asks (Sell Orders)
            </Text>
            <div className=\"space-y-1\">
              {orderBook.asks.map((ask, i) => (
                <div key={i} className=\"grid grid-cols-3 gap-2 text-xs p-1 hover:bg-red-50 rounded\">
                  <Text variant=\"caption\" className=\"text-red-600\">
                    ${ask.price.toFixed(2)}
                  </Text>
                  <Text variant=\"caption\" color=\"muted\">
                    {ask.amount}
                  </Text>
                  <Text variant=\"caption\" color=\"muted\">
                    ${ask.total.toLocaleString()}
                  </Text>
                </div>
              ))}
            </div>
          </div>

          {/* Current price */}
          <div className=\"text-center py-2 border-y border-gray-200\">
            <Text variant=\"small\" weight=\"bold\" color=\"growth\">
              $125.50
            </Text>
            <Text variant=\"caption\" color=\"muted\">
              Last Price
            </Text>
          </div>

          {/* Bids (Buy orders) */}
          <div>
            <Text variant=\"caption\" color=\"muted\" className=\"mb-2\">
              Bids (Buy Orders)
            </Text>
            <div className=\"space-y-1\">
              {orderBook.bids.map((bid, i) => (
                <div key={i} className=\"grid grid-cols-3 gap-2 text-xs p-1 hover:bg-green-50 rounded\">
                  <Text variant=\"caption\" className=\"text-green-600\">
                    ${bid.price.toFixed(2)}
                  </Text>
                  <Text variant=\"caption\" color=\"muted\">
                    {bid.amount}
                  </Text>
                  <Text variant=\"caption\" color=\"muted\">
                    ${bid.total.toLocaleString()}
                  </Text>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Trading form component
const TradingForm: React.FC<{
  token: TokenInfo;
  userBalance?: Record<string, number>;
  onTrade?: (order: { type: 'buy' | 'sell'; amount: number; price: number }) => Promise<void>;
}> = ({ token, userBalance = {}, onTrade }) => {
  const [orderType, setOrderType] = useState<'buy' | 'sell'>('buy');
  const [amount, setAmount] = useState('');
  const [price, setPrice] = useState(token.price.toString());
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!onTrade) return;

    setIsLoading(true);
    try {
      await onTrade({
        type: orderType,
        amount: parseFloat(amount),
        price: parseFloat(price),
      });
      setAmount('');
    } finally {
      setIsLoading(false);
    }
  };

  const total = (parseFloat(amount) || 0) * (parseFloat(price) || 0);
  const tokenBalance = userBalance[token.symbol] || 0;
  const usdBalance = userBalance['USD'] || 0;

  return (
    <Card variant=\"glass\">
      <CardHeader>
        <div className=\"flex items-center justify-between\">
          <CardTitle level={5}>Trade {token.symbol}</CardTitle>
          <div className=\"flex gap-2\">
            <Button
              variant={orderType === 'buy' ? 'success' : 'ghost'}
              size=\"sm\"
              onClick={() => setOrderType('buy')}
            >
              Buy
            </Button>
            <Button
              variant={orderType === 'sell' ? 'error' : 'ghost'}
              size=\"sm\"
              onClick={() => setOrderType('sell')}
            >
              Sell
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className=\"space-y-4\">
          {/* Price input */}
          <Input
            label=\"Price (USD)\"
            type=\"number\"
            step=\"0.01\"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder=\"0.00\"
            required
          />

          {/* Amount input */}
          <Input
            label={`Amount (${token.symbol})`}
            type=\"number\"
            step=\"0.000001\"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder=\"0.000000\"
            helperText={`Available: ${tokenBalance.toFixed(6)} ${token.symbol}`}
            required
          />

          {/* Order summary */}
          <div className=\"bg-gray-50 rounded-lg p-3 space-y-2\">
            <div className=\"flex justify-between text-sm\">
              <Text variant=\"small\" color=\"muted\">Total:</Text>
              <Text variant=\"small\" weight=\"medium\">${total.toFixed(2)}</Text>
            </div>
            <div className=\"flex justify-between text-sm\">
              <Text variant=\"small\" color=\"muted\">Available:</Text>
              <Text variant=\"small\" weight=\"medium\">
                ${orderType === 'buy' ? usdBalance.toFixed(2) : (tokenBalance * token.price).toFixed(2)}
              </Text>
            </div>
          </div>

          {/* Action buttons */}
          <div className=\"flex gap-2\">
            <Button
              type=\"submit\"
              variant={orderType === 'buy' ? 'success' : 'error'}
              fullWidth
              loading={isLoading}
              disabled={!amount || !price || parseFloat(amount) <= 0}
            >
              {orderType === 'buy' ? 'Buy' : 'Sell'} {token.symbol}
            </Button>
          </div>

          {/* Quick amount buttons */}
          <div className=\"grid grid-cols-4 gap-2\">
            {['25%', '50%', '75%', 'Max'].map((percent) => (
              <Button
                key={percent}
                variant=\"outline\"
                size=\"sm\"
                onClick={() => {
                  const maxAmount = orderType === 'buy' 
                    ? usdBalance / parseFloat(price) 
                    : tokenBalance;
                  const percentage = percent === 'Max' ? 1 : parseInt(percent) / 100;
                  setAmount((maxAmount * percentage).toFixed(6));
                }}
              >
                {percent}
              </Button>
            ))}
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

// Recent transactions component
const RecentTransactions: React.FC<{ transactions: Transaction[] }> = ({ transactions }) => {
  return (
    <Card variant=\"glass\">
      <CardHeader>
        <CardTitle level={5}>Recent Transactions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className=\"space-y-3\">
          {transactions.map((tx) => (
            <div key={tx.id} className=\"flex items-center justify-between p-3 bg-white/30 rounded-lg\">
              <div className=\"flex items-center gap-3\">
                <div className={cn(
                  'h-8 w-8 rounded-full flex items-center justify-center text-xs font-medium',
                  tx.type === 'buy' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                )}>
                  {tx.type === 'buy' ? '+' : '-'}
                </div>
                <div>
                  <Text variant=\"small\" weight=\"medium\">
                    {tx.type.toUpperCase()} {tx.token}
                  </Text>
                  <Text variant=\"caption\" color=\"muted\">
                    {tx.amount} @ ${tx.price}
                  </Text>
                </div>
              </div>
              <div className=\"text-right\">
                <Text variant=\"small\" weight=\"medium\">
                  ${tx.total.toLocaleString()}
                </Text>
                <div className=\"flex items-center justify-end gap-1\">
                  <Badge
                    variant={
                      tx.status === 'completed' ? 'success' :
                      tx.status === 'pending' ? 'warning' : 'error'
                    }
                    size=\"sm\"
                  >
                    {tx.status}
                  </Badge>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

// Main token trading component
export const TokenTrading: React.FC<TokenTradingProps> = ({
  selectedToken = defaultTokens[0],
  tokens = defaultTokens,
  orderBook = defaultOrderBook,
  recentTransactions = [],
  walletConnected = false,
  userBalance = { USD: 10000, TECH: 50, GREEN: 30, FIN: 75 },
  onTrade,
  onTokenSelect,
}) => {
  const [activeToken, setActiveToken] = useState(selectedToken);

  const handleTokenSelect = (token: TokenInfo) => {
    setActiveToken(token);
    onTokenSelect?.(token);
  };

  return (
    <div className=\"space-y-6\">
      {/* Header with wallet connection */}
      <div className=\"flex items-center justify-between\">
        <div>
          <Text variant=\"h4\" weight=\"bold\">Token Trading</Text>
          <Text variant=\"small\" color=\"muted\">
            Trade regulatory-compliant tokenized assets
          </Text>
        </div>
        <WalletButton
          state={walletConnected ? 'connected' : 'disconnected'}
          network=\"ethereum\"
          address={walletConnected ? '0x1234...5678' : undefined}
          balance=\"127.45\"
          balanceSymbol=\"ETH\"
        />
      </div>

      {/* Token selector */}
      <Card variant=\"glass\">
        <CardContent className=\"p-4\">
          <div className=\"grid grid-cols-1 md:grid-cols-3 gap-4\">
            {tokens.map((token) => (
              <button
                key={token.symbol}
                onClick={() => handleTokenSelect(token)}
                className={cn(
                  'p-4 rounded-lg border text-left transition-all',
                  activeToken.symbol === token.symbol
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300 bg-white/50'
                )}
              >
                <div className=\"flex items-center justify-between mb-2\">
                  <div className=\"flex items-center gap-2\">
                    <NetworkBadge network={token.network} size=\"sm\" />
                    <Text variant=\"small\" weight=\"bold\">{token.symbol}</Text>
                  </div>
                  <div className=\"flex items-center gap-1\">
                    {token.change24h > 0 ? (
                      <TrendingUp className=\"h-3 w-3 text-green-600\" />
                    ) : (
                      <TrendingDown className=\"h-3 w-3 text-red-600\" />
                    )}
                    <Text 
                      variant=\"caption\" 
                      className={token.change24h > 0 ? 'text-green-600' : 'text-red-600'}
                    >
                      {Math.abs(token.change24h)}%
                    </Text>
                  </div>
                </div>
                <Text variant=\"caption\" color=\"muted\" className=\"block mb-1\">
                  {token.name}
                </Text>
                <Text variant=\"small\" weight=\"bold\">
                  ${token.price.toFixed(2)}
                </Text>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Trading interface */}
      <div className=\"grid grid-cols-1 lg:grid-cols-3 gap-6\">
        {/* Trading form */}
        <div>
          <TradingForm
            token={activeToken}
            userBalance={userBalance}
            onTrade={onTrade}
          />
        </div>

        {/* Order book */}
        <div>
          <OrderBookDisplay orderBook={orderBook} />
        </div>

        {/* Recent transactions */}
        <div>
          <RecentTransactions transactions={recentTransactions} />
        </div>
      </div>
    </div>
  );
};

export default TokenTrading;