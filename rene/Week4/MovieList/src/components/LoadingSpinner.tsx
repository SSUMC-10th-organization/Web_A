const LoadingSpinner = () => {
	return (
		<div className="flex justify-center items-center py-20" role="status">
			<div
				className="w-12 h-12 rounded-full border-4 
      border-t-white animate-spin"
			/>
			<span className="sr-only">로딩 중...</span>
		</div>
	);
};

export default LoadingSpinner;
