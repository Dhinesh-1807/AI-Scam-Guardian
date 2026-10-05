import { AnalysisResult, AnalyticsSummary, ScanRecord, UrlAnalysisResult } from '../types/scam.js';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export async function analyzeMessageApi(message: string, userId?: string): Promise<AnalysisResult> {
  const res = await fetch(`${API_BASE}/analyze/message`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, userId }),
  });

  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.error || 'Failed to analyze message');
  }

  return data;
}

export async function analyzeUrlApi(url: string, userId?: string): Promise<UrlAnalysisResult> {
  const res = await fetch(`${API_BASE}/analyze/url`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url, userId }),
  });

  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.error || 'Failed to analyze URL');
  }

  return data;
}

export async function getScansApi(filter?: {
  riskLevel?: string;
  search?: string;
  scanType?: string;
}): Promise<ScanRecord[]> {
  const params = new URLSearchParams();
  if (filter?.riskLevel) params.append('riskLevel', filter.riskLevel);
  if (filter?.search) params.append('search', filter.search);
  if (filter?.scanType) params.append('scanType', filter.scanType);

  const res = await fetch(`${API_BASE}/scans?${params.toString()}`);
  const data = await res.json();

  if (!res.ok || !data.success) {
    throw new Error(data.error || 'Failed to retrieve scan history');
  }

  return data.data;
}

export async function getScanByIdApi(id: string): Promise<ScanRecord> {
  const res = await fetch(`${API_BASE}/scans/${id}`);
  const data = await res.json();

  if (!res.ok || !data.success) {
    throw new Error(data.error || 'Scan not found');
  }

  return data.data;
}

export async function deleteScanApi(id: string): Promise<boolean> {
  const res = await fetch(`${API_BASE}/scans/${id}`, {
    method: 'DELETE',
  });
  const data = await res.json();

  if (!res.ok || !data.success) {
    throw new Error(data.error || 'Failed to delete scan');
  }

  return true;
}

export async function getAnalyticsApi(): Promise<AnalyticsSummary> {
  const res = await fetch(`${API_BASE}/analytics`);
  const data = await res.json();

  if (!res.ok || !data.success) {
    throw new Error(data.error || 'Failed to retrieve analytics');
  }

  return data.data;
}

export async function checkBackendHealth(): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE}/health`, { signal: AbortSignal.timeout(3000) });
    return res.ok;
  } catch {
    return false;
  }
}
