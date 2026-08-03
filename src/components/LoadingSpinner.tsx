// LoadingSpinner: a small spinner shown while data is being fetched.
function LoadingSpinner() {
  return (
    <div className="min-h-[40vh] flex flex-col items-center justify-center gap-3 text-gray-500">
      <div className="w-10 h-10 border-4 border-sky-200 border-t-sky-600 rounded-full animate-spin"></div>
      <p className="text-sm">Loading...</p>
    </div>
  );
}

export default LoadingSpinner;
