import React from 'react';
import { ArrowUpRight, ArrowDownRight, Activity, Cpu, ShieldAlert, Sparkles } from 'lucide-react';
import { playSound } from '../utils/audio';

export default function MarketTicker({ onSelectService }) {
  const rails = [
    {
      id: 'upi',
      name: 'UPI Payments Today',
      ticker: 'NPCI Rail',
      stat: '48,920 /sec',
      delta: '+8.4%',
      isUp: true,
      sub: 'Instant UPI transactions',
      icon: '₹'
    },
    {
      id: 'recharge',
      name: 'Recharge Success Rate',
      ticker: 'Direct Operator Link',
      stat: '99.98%',
      delta: '+0.04%',
      isUp: true,
      sub: 'Simulated 5G fulfillment',
      icon: '5G'
    },
    {
      id: 'disputes',
      name: 'Average Dispute Resolution',
      ticker: 'Paytm Resolve',
      stat: '4.2 min',
      delta: '-34%',
      isUp: true,
      sub: 'Fast refund investigations',
      icon: 'TAT'
    },
    {
      id: 'cashback',
      name: 'Cashback Distributed',
      ticker: 'Paytm Rewards',
      stat: '₹24.8 Lakhs',
      delta: '+14.2%',
      isUp: true,
      sub: 'Credited directly to wallet',
      icon: 'CASH'
    }
  ];

  return (
    <section className="w-full bg-surface-soft border-b border-hairline py-8">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-primary" />
            <span className="text-[12px] font-semibold tracking-wider text-muted uppercase">
              Today's Network Status & Performance
            </span>
          </div>
          <span className="font-mono text-[11px] text-muted">All Payment Systems Normal (100%)</span>
        </div>

        {/* 4-Column Metric Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {rails.map((rail) => (
            <div
              key={rail.id}
              onClick={() => {
                playSound('click');
                onSelectService(rail.id);
              }}
              className="bg-white p-4 rounded-lg border border-hairline hover:border-muted-soft transition-all cursor-pointer group shadow-xs"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-surface-strong flex items-center justify-center text-sm font-semibold text-ink">
                    {rail.icon}
                  </div>
                  <div>
                    <div className="text-[13px] font-semibold text-ink group-hover:text-primary transition-colors">
                      {rail.name}
                    </div>
                    <div className="font-mono text-[11px] text-muted">{rail.ticker}</div>
                  </div>
                </div>
              </div>

              <div className="flex items-baseline justify-between pt-1">
                <div className="font-mono text-xl font-medium text-ink">
                  {rail.stat}
                </div>
                <div className="flex items-center font-mono text-[13px] font-medium text-semantic-up">
                  <ArrowUpRight className="w-3.5 h-3.5" />
                  <span>{rail.delta}</span>
                </div>
              </div>

              <div className="text-[11px] text-muted mt-1">{rail.sub}</div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
