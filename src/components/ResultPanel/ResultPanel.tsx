import NetWorthChart from './NetWorthChart';
import CashOutflowChart from './CashOutflowChart';
import { DebugPanel } from '../DebugPanel';

export default function ResultPanel() {
  return (
    <div className="w-full md:w-2/3 space-y-6">
      {/* Net Worth Projection Chart */}
      <NetWorthChart />
      
      {/* Cash Outflow Analysis */}
      <CashOutflowChart />
      
      {/* Debug Panel for Testing */}
      <DebugPanel />
    </div>
  );
}