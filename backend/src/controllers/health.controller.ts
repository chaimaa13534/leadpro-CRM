import type { Request, Response } from 'express';
import type { ApiSuccessResponse } from '../types/api-response.js';

interface HealthData {
  message: string;
  timestamp: string;
}

/**
 * Health check controller.
 *
 * Returns a JSON payload that proves the API is running. The timestamp is
 * generated dynamically on every request.
 */
export const getHealth = (_req: Request, res: Response): void => {
  const body: ApiSuccessResponse<HealthData> = {
    success: true,
    data: {
      message: 'LeadPro CRM API is running',
      timestamp: new Date().toISOString(),
    },
  };

  res.status(200).json(body);
};

