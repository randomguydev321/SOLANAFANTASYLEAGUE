'use client';

interface PremiumModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubscribe: (plan: string) => void;
}

export default function PremiumModal({ isOpen, onClose, onSubscribe }: PremiumModalProps) {
  if (!isOpen) return null;

  const plans = [
    {
      name: 'PRO',
      price: '0.05 BNB',
      period: '/month',
      features: [
        'Advanced Analytics Dashboard',
        'AI Roster Optimizer Pro',
        'Early Tournament Access',
        'Custom Player Alerts',
        'Historical Performance Data',
        'Priority Customer Support'
      ],
      popular: false
    },
    {
      name: 'ELITE',
      price: '0.1 BNB',
      period: '/month',
      features: [
        'Everything in Pro',
        'Exclusive Tournaments',
        'Custom Avatars & Themes',
        'Advanced Statistics',
        'Team Management Tools',
        'VIP Chat Channel',
        'Personal Portfolio Tracking'
      ],
      popular: true
    },
    {
      name: 'LEGEND',
      price: '0.2 BNB',
      period: '/month',
      features: [
        'Everything in Elite',
        'Private Leagues Creation',
        'Custom Tournament Hosting',
        'Direct Developer Access',
        'Beta Feature Access',
        'Merchandise Discounts',
        '1-on-1 Strategy Sessions'
      ],
      popular: false
    }
  ];

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <div className="card-artistic max-w-6xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="title-artistic text-4xl">PREMIUM SUBSCRIPTIONS</h2>
          <button
            onClick={onClose}
            className="text-4xl text-white hover:text-yellow-400"
          >
            ×
          </button>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {plans.map((plan, index) => (
            <div key={index} className={`card-artistic relative ${plan.popular ? 'border-yellow-400' : ''}`}>
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-yellow-400 text-black px-4 py-1 rounded-full text-sm font-bold">
                  MOST POPULAR
                </div>
              )}
              
              <div className="text-center mb-6">
                <h3 className="title-artistic text-2xl mb-2">{plan.name}</h3>
                <div className="flex items-baseline justify-center">
                  <span className="title-artistic text-4xl">{plan.price}</span>
                  <span className="text-artistic text-sm ml-1">{plan.period}</span>
                </div>
              </div>

              <ul className="space-y-3 mb-6">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center gap-2">
                    <span className="text-green-400">✓</span>
                    <span className="text-artistic text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => onSubscribe(plan.name)}
                className={`w-full btn-artistic ${plan.popular ? 'bg-yellow-400 text-black' : ''}`}
              >
                SUBSCRIBE TO {plan.name}
              </button>
            </div>
          ))}
        </div>

        <div className="card-artistic">
          <h3 className="subtitle-artistic text-xl mb-4">PREMIUM BENEFITS</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="subtitle-artistic text-lg mb-2">ANALYTICS & INSIGHTS</h4>
              <ul className="text-artistic text-sm space-y-1">
                <li>• Advanced player performance metrics</li>
                <li>• Historical data analysis</li>
                <li>• Trend identification and predictions</li>
                <li>• Custom statistical dashboards</li>
              </ul>
            </div>
            <div>
              <h4 className="subtitle-artistic text-lg mb-2">EXCLUSIVE FEATURES</h4>
              <ul className="text-artistic text-sm space-y-1">
                <li>• Early access to new tournaments</li>
                <li>• Premium-only competitions</li>
                <li>• Custom avatar and theme options</li>
                <li>• Priority customer support</li>
              </ul>
            </div>
            <div>
              <h4 className="subtitle-artistic text-lg mb-2">TOOLS & UTILITIES</h4>
              <ul className="text-artistic text-sm space-y-1">
                <li>• AI-powered roster optimization</li>
                <li>• Advanced lineup suggestions</li>
                <li>• Player comparison tools</li>
                <li>• Portfolio tracking and analysis</li>
              </ul>
            </div>
            <div>
              <h4 className="subtitle-artistic text-lg mb-2">COMMUNITY</h4>
              <ul className="text-artistic text-sm space-y-1">
                <li>• VIP chat channels</li>
                <li>• Private league creation</li>
                <li>• Custom tournament hosting</li>
                <li>• Direct developer communication</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="text-center mt-8">
          <p className="text-artistic text-sm">
            ALL PREMIUM SUBSCRIPTIONS ARE PAID IN BNB AND AUTOMATICALLY RENEW MONTHLY.
            <br />
            CANCEL ANYTIME WITH NO PENALTIES.
          </p>
        </div>
      </div>
    </div>
  );
}




