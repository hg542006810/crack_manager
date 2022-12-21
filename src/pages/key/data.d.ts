// 表格的列表字段
export interface TableListItem {
  key: string;
  times: number;
  status: number;
  type: number;
  timeout: number;
  createdAt: string;
  usedCount: string;
  backCount: string;
}

// 表格的查询参数
export interface TableListParams {
  page: number;
  pageSize: number;
  sortBy: string | undefined;
  orderBy: string | undefined;
  times: number;
  timeout: number;
  status: number;
  type: number;
  createdAt: string | string[];
}
