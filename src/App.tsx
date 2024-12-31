import { useAuth } from '@/contexts/AuthContext';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { Layout } from './components/Layout';
import { Dashboard } from './components/pages/Dashboard';
import { TradesList } from './components/pages/TradesList';
import { Calendar } from './components/pages/Calendar';
import { Accounts } from './components/pages/Accounts';
import { Settings } from './components/pages/Settings';
import { AddTrades } from './components/pages/AddTrades';
import { Analytics } from './components/pages/Analytics';
import { Playbook } from './components/pages/Playbook';
import { useState } from 'react';
import { TooltipProvider } from '@/components/ui/tooltip';

export type TabType = 'dashboard' | 'trades' | 'calendar' | 'accounts' | 'settings' | 'add-trade' | 'analytics' | 'playbook';

export function App() {
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <AuthLayout />;
  }

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-background">
        <Layout activeTab={activeTab} onTabChange={setActiveTab}>
          {activeTab === 'dashboard' && <Dashboard />}
          {activeTab === 'trades' && <TradesList />}
          {activeTab === 'calendar' && <Calendar />}
          {activeTab === 'accounts' && <Accounts />}
          {activeTab === 'settings' && <Settings />}
          {activeTab === 'add-trade' && <AddTrades />}
          {activeTab === 'analytics' && <Analytics />}
          {activeTab === 'playbook' && <Playbook />}
        </Layout>
      </div>
    </TooltipProvider>
  );
}

export default App;