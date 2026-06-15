/**
 * 构建首页 URL（保留 search / category / page 参数）
 * 用于搜索框、分类标签、分页等组件的链接跳转
 */
export function buildHomeUrl(params: {
  search?: string;
  category?: string;
  page?: number;
}): string {
  const sp = new URLSearchParams();
  if (params.search) sp.set("search", params.search);
  if (params.category) sp.set("category", params.category);
  if (params.page && params.page > 1) sp.set("page", String(params.page));
  const qs = sp.toString();
  return qs ? `/?${qs}` : "/";
}
