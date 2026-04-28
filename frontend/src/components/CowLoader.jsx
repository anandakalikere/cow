export default function CowLoader() {
  return (
    <div className="flex items-center justify-center p-6 rounded-xl bg-blue-50 border border-blue-100 shadow-sm">
      <div className="animate-wiggle text-3xl mr-3">🐄</div>
      <div>
        <p className="text-blue-700 font-semibold">Finding nearby cows...</p>
        <p className="text-sm text-blue-500">Allow location access and please wait a moment.</p>
      </div>
    </div>
  );
}
