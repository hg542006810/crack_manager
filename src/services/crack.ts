import request from '@/utils/request';
import type { TableListParams as FetchTaskParams } from '@/pages/task/data';
import type { StartCrack } from './data';

// 获得所有任务
export function getTask(params: FetchTaskParams): Promise<any> {
  return request('/api/crack/getTask', {
    params,
  });
}

// 获得进度
export function getProgress(params: { id: string }): Promise<any> {
  return request('/api/crack/getProgress', {
    params,
  });
}

// 根据文件破解
export function startCrackFile(params: FormData): Promise<any> {
  return request('/api/crack/startCrackFile', {
    method: 'POST',
    data: params,
  });
}

// 根据Hash破解
export function startCrackHash(params: StartCrack): Promise<any> {
  return request('/api/crack/startCrackHash', {
    method: 'POST',
    data: params,
  });
}

// 杀掉破解进程
export function killProcess(params: { id: string }): Promise<any> {
  return request('/api/crack/killProcess', {
    method: 'POST',
    data: params,
  });
}

// 发送电子邮箱
export function sendEmail(params: { id: string }): Promise<any> {
  return request('/api/crack/sendEmail', {
    method: 'POST',
    data: params,
  });
}

// 结束排队
export function queued(params: { id: string }): Promise<any> {
  return request('/api/crack/queued', {
    method: 'POST',
    data: params,
  });
}

