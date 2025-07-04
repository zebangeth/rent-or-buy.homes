export default function CTAButtons() {
  const scrollToInputs = () => {
    // Scroll to the input panel smoothly
    const inputPanel = document.querySelector('[data-testid="input-panel"]') || 
                      document.querySelector('.w-full.md\\:w-1\\/3'); // Fallback selector
    if (inputPanel) {
      inputPanel.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  const shareResult = async () => {
    const url = window.location.href;
    
    try {
      await navigator.clipboard.writeText(url);
      // Show success notification (could be implemented with toast/notification system)
      console.log("Result link copied to clipboard!");
    } catch {
      // Fallback for browsers that don't support clipboard API
      const textarea = document.createElement("textarea");
      textarea.value = url;
      textarea.style.position = "fixed";
      textarea.style.left = "-999999px";
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();
      
      try {
        document.execCommand("copy");
        console.log("Result link copied to clipboard!");
      } catch {
        console.log("Failed to copy link");
      }
      
      document.body.removeChild(textarea);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row gap-3 mt-6 pt-6 border-t border-gray-200">
      <button
        onClick={scrollToInputs}
        className="flex-1 py-3 px-4 bg-dark-800 hover:bg-dark-700 text-white font-medium rounded-xl transition flex items-center justify-center"
      >
        <i className="fas fa-sliders-h mr-2"></i> Edit My Inputs
      </button>
      <button
        onClick={shareResult}
        className="flex-1 py-3 px-4 bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700 text-white font-medium rounded-xl transition flex items-center justify-center"
      >
        <i className="fas fa-share-alt mr-2"></i> Share This Result
      </button>
    </div>
  );
}