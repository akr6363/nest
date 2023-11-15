import { Injectable } from '@nestjs/common';
import fetch from 'cross-fetch';
const BASE_URL = 'https://tula-test.t1-group.ru/ajax/request?com.rnis.';

@Injectable()
export class StopPointsService {
  async getStopPoints(meta: any, payload: any) {
    try {
      const response = await fetch(`${BASE_URL}geo.action.stop_point.list`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          headers: { meta },
          payload,
        }),
      });

      return await response.json();
    } catch (error) {
      throw new Error(`Error fetching data: ${error.message}`);
    }
  }

  async getEntityNames(meta, payload) {
    try {
      const response = await fetch(`${BASE_URL}system.action.entity.names`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          headers: {
            meta: {},
          },
          payload,
        }),
      });
      return await response.json();
    } catch (e) {
      throw new Error(`Error fetching data: ${e.message}`);
    }
  }
}
