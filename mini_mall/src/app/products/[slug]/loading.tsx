/** 商品详情页加载骨架屏 */
export default function ProductDetailLoading() {
  return (
    <main className="min-h-screen bg-gray-50 animate-pulse">
      {/* 面包屑骨架 */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex gap-2">
            <div className="h-4 w-10 bg-gray-200 rounded" />
            <div className="h-4 w-16 bg-gray-200 rounded" />
            <div className="h-4 w-24 bg-gray-200 rounded" />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm p-6 md:p-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* 图片骨架 */}
            <div className="space-y-4">
              <div className="aspect-square bg-gray-200 rounded-lg" />
              <div className="flex gap-3">
                {[1, 2].map((i) => (
                  <div key={i} className="w-20 h-20 bg-gray-200 rounded-lg" />
                ))}
              </div>
            </div>
            {/* 信息骨架 */}
            <div className="space-y-4">
              <div className="h-6 w-20 bg-gray-200 rounded-full" />
              <div className="h-8 w-3/4 bg-gray-200 rounded" />
              <div className="h-10 w-32 bg-gray-200 rounded" />
              <div className="h-4 w-24 bg-gray-200 rounded" />
              <div className="space-y-2 mt-6">
                <div className="h-4 w-16 bg-gray-200 rounded" />
                <div className="h-4 w-full bg-gray-200 rounded" />
                <div className="h-4 w-5/6 bg-gray-200 rounded" />
              </div>
              <div className="pt-8 flex gap-3">
                <div className="flex-1 h-12 bg-gray-200 rounded-lg" />
                <div className="h-12 w-28 bg-gray-200 rounded-lg" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
