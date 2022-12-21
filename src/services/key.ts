import request from '@/utils/request';
import type { TableListParams as FetchKeyParams } from '@/pages/key/data';
import type { GenerateKey, ExportKey } from './data';

// 获得所有破解码
export function getKey(params: FetchKeyParams): Promise<any> {
  return request('/api/key/getKey', {
    params,
  });
}

// 生成破解码
export function generateKey(params: GenerateKey): Promise<any> {
  return request('/api/key/generateKey', {
    method: 'POST',
    data: params,
  });
}