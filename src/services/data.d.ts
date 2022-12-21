// 开始破解
export interface StartCrack {
  file?: File;
  hash?: string;
  email: string;
}

// 生成破解码
export interface GenerateKey {
  times: number;
  timeout: number;
  count: number;
  type: number;
}

// 导出key
export interface ExportKey {
    times?: number;
    timeout?: number;
    status?: number;
    createdAt?: string;
  }
  