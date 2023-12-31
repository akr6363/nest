import { Body, Controller, Post, Res } from '@nestjs/common';
import { StopPointsService } from './stop-points.service';
import {
  generateExcel,
  getEntityNamesPayload,
  getMatrix,
  stylizeStopPointsTable,
} from './stop-points.utils';
import { TABLE_HEADERS } from './stop-points.constants';
import { performance } from 'perf_hooks';
import { GetStopPointsDataType, GetStopPointsMetaType } from '../types';
import { Response } from 'express';

@Controller('stop-points')
export class StopPointsController {
  constructor(private readonly stopPointsService: StopPointsService) {}

  async processPage(
    order,
    filters,
    limit,
    filePath,
    page,
  ): Promise<number | void> {
    const meta: GetStopPointsMetaType = {
      filters,
      order,
      pagination: {
        page,
        limit,
      },
    };
    const stopPoints = await this.stopPointsService.getStopPoints(meta);
    const owners = await this.stopPointsService.getEntityNames(
      getEntityNamesPayload(stopPoints),
    );
    const matrix = getMatrix(stopPoints, owners);
    await generateExcel(
      matrix,
      'stop points',
      filePath,
      Object.keys(TABLE_HEADERS),
      page === 1,
    );
    if (page === 1) return stopPoints.headers.meta.pagination.total;
  }

  @Post()
  async getStopPoints(
    @Body() data: GetStopPointsDataType,
    @Res() res: Response,
  ): Promise<void> {
    const { order, filters, limit } = data;
    const filePath = './stop-points.xlsx';
    const start = performance.now(); // Засекаем начало выполнения запроса
    const totalCount = await this.processPage(
      order,
      filters,
      limit,
      filePath,
      1,
    );

    if (totalCount && totalCount > limit) {
      const totalPages = Math.ceil(totalCount / limit);
      for (let page = 2; page <= totalPages; page++) {
        await this.processPage(order, filters, limit, filePath, page);
      }
    }
    await stylizeStopPointsTable(filePath);

    const end = performance.now();
    const executionTime = end - start;

    res.set(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.set('Content-Disposition', 'attachment; filename=stop-points.xlsx');
    res.sendFile('stop-points.xlsx', { root: './' });

    console.log(`Время выполнения запроса: ${executionTime} мс`);
  }
}
