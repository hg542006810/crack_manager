// 表格的列表字段
export interface TableListItem {
  id: string;
  hash: string;
  email: number;
  password: string;
  fileName: string;
  status: number;
  createdAt: number;
  progress?: {
    hash: string;
    message: string;
    progress: string;
    progressText: string;
    speed: number;
  };
}

// 表格的查询参数
export interface TableListParams {
  page: number;
  pageSize: number;
  sortBy: string | undefined;
  orderBy: string | undefined;
  hash: string;
  status: number;
  email: string;
  createdAt: string | string[];
}
