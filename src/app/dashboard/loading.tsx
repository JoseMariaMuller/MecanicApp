export default function DashboardLoading() {
    return (
        <div className="min-h-screen bg-gray-50 px-4 py-8 animate-pulse">
            <div className="max-w-6xl mx-auto">

                <div className="flex items-center justify-between mb-8">
                    <div>
                        <div className="h-7 w-48 bg-gray-200 rounded-lg mb-2" />
                        <div className="h-4 w-32 bg-gray-100 rounded-lg" />
                    </div>
                    <div className="h-9 w-32 bg-gray-200 rounded-xl" />
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="bg-white border border-gray-200 rounded-2xl p-5">
                            <div className="h-3 w-24 bg-gray-100 rounded mb-3" />
                            <div className="h-8 w-12 bg-gray-200 rounded-lg" />
                        </div>
                    ))}
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    {[...Array(2)].map((_, i) => (
                        <div key={i} className="bg-white border border-gray-200 rounded-2xl p-6">
                            <div className="h-4 w-40 bg-gray-100 rounded mb-6" />
                            <div className="space-y-4">
                                {[...Array(3)].map((_, j) => (
                                    <div key={j} className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-full bg-gray-100 shrink-0" />
                                        <div className="flex-1">
                                            <div className="h-4 w-40 bg-gray-200 rounded mb-2" />
                                            <div className="h-3 w-24 bg-gray-100 rounded mb-2" />
                                            <div className="h-1.5 w-full bg-gray-100 rounded-full" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </div>
    )
}