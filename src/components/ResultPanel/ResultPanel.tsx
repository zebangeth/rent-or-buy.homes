import NetWorthChart from './NetWorthChart';
import CashOutflowChart from './CashOutflowChart';
import { DebugPanel } from '../DebugPanel';
import { useDebugMode } from '../../hooks/useDebugMode';

export default function ResultPanel() {
  const isDebugMode = useDebugMode();

  return (
    <div className="w-full md:w-2/3 space-y-6">
      {/* Net Worth Projection Chart */}
      <NetWorthChart />
      
      {/* Cash Outflow Analysis */}
      <CashOutflowChart />
      
      {/* Debug Panel for Testing - Only show when ?debug=true */}
      {isDebugMode && <DebugPanel />}
    </div>
  );
}