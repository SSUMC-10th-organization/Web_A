const LPCardSkeleton = () => (
  <div
    className="aspect-square rounded-sm animate-[shimmer_1.5s_ease-in-out_infinite]"
    style={{
      background: "linear-gradient(90deg, #27272a 25%, #3f3f46 50%, #27272a 75%)",
      backgroundSize: "200% 100%",
    }}
  />
);

export default LPCardSkeleton;
