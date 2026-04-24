export default function VehiclesLoading() {
    return (
        <div className="min-h-screen bg-gray-50 px-4 py-8 animate-pulse">
            <div className="max-w-6xl mx-auto">

                <div className="flex items-center justify-between mb-8">
                    <div className="h-7 w-32 bg-gray-200 rounded-lg" />
                    <div className="h-9 w-36 bg-gray-200 rounded-xl" />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="bg-white border border-gray-200 rounded-2xl p-6">
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <div className="h-5 w-36 bg-gray-200 rounded mb-2" />
                                    <div className="h-3 w-28 bg-gray-100 rounded" />
                                </div>
                                <div className="h-6 w-16 bg-gray-100 rounded-lg" />
                            </div>
                            <div className="border-t border-gray-100 pt-4 mb-4">
                                <div className="h-4 w-32 bg-gray-200 rounded mb-1" />
                                <div className="h-3 w-24 bg-gray-100 rounded" />
                            </div>
                            <div className="flex justify-between mb-3">
                                <div className="h-3 w-28 bg-gray-100 rounded" />
                                <div className="h-3 w-28 bg-gray-100 rounded" />
                            </div>
                            <div className="h-1.5 w-full bg-gray-100 rounded-full" />
                        </div>
                    ))}
                </div>

            </div>
        </div>
    )
}