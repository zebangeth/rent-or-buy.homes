import NetWorthChart from './NetWorthChart';
import { DebugPanel } from '../DebugPanel';

export default function ResultPanel() {
  return (
    <div className="w-full md:w-2/3 space-y-6">
      {/* Net Worth Projection Chart */}
      <NetWorthChart />
      
      {/* Debug Panel for Testing */}
      <DebugPanel />
    </div>
  );
}