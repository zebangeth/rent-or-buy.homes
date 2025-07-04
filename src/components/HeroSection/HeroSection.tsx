import TimeHorizonSelector from "./TimeHorizonSelector";
import ConclusionBadge from "./ConclusionBadge";
import NetWorthExplanation from "./NetWorthExplanation";
import KeyAssumptions from "./KeyAssumptions";
import NetAssetValueCards from "./NetAssetValueCards";
import CTAButtons from "./CTAButtons";

export default function HeroSection() {

  return (
    <div className="mb-10">
      <div className="card bg-gradient-to-r from-primary-50 to-secondary-50 p-8 border border-gray-200 relative overflow-hidden">
        {/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Explanation Section */}
          <div className="flex-1">
            <ConclusionBadge />
            
            <TimeHorizonSelector />
            
            <NetWorthExplanation />
            
            <KeyAssumptions />
          </div>

          {/* Net Asset Value Breakdown */}
          <div className="lg:w-1/3 space-y-4">
            <NetAssetValueCards />
          </div>
        </div>

        {/* CTA Buttons */}
        <CTAButtons />
      </div>
    </div>
  );
}