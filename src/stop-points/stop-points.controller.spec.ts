import { Test, TestingModule } from '@nestjs/testing';
import { StopPointsController } from './stop-points.controller';
import { StopPointsService } from './stop-points.service';
import { GetStopPointsDataType } from '../types';
import { Response } from 'express';
import { ENTITY_NAMES, STOP_POINTS } from '../mock-constants';
import {
  generateExcel,
  getEntityNamesPayload,
  getMatrix,
  stylizeStopPointsTable,
} from './stop-points.utils';

let controller: StopPointsController;
let service: StopPointsService;

beforeEach(async () => {
  const module: TestingModule = await Test.createTestingModule({
    controllers: [StopPointsController],
    providers: [StopPointsService],
  }).compile();

  controller = module.get<StopPointsController>(StopPointsController);
  service = module.get<StopPointsService>(StopPointsService);
});

jest.mock('./stop-points.utils', () => ({
  getMatrix: jest.fn().mockImplementation(() => {
    return 'getMatrix result';
  }),
  stylizeStopPointsTable: jest.fn(),
  generateExcel: jest.fn(),
  getEntityNamesPayload: jest.fn().mockImplementation(() => {
    return 'getEntityNamesPayload result';
  }),
}));

jest.mock('./stop-points.constants', () => ({
  TABLE_HEADERS: { 1: 'header1', 2: 'header2' },
}));

describe('StopPointsController', () => {
  describe('getStopPoints', () => {
    it('should return the correct response and set headers', async () => {
      const data: GetStopPointsDataType = {
        order: {
          column: 'name',
          direction: 'asc',
        },
        filters: {
          withSource: null,
          withSources: null,
        },
        limit: 1,
      };

      const totalCount = STOP_POINTS.headers.meta.pagination.total;
      const filePath = './stop-points.xlsx';

      jest.spyOn(service, 'getStopPoints').mockResolvedValue(STOP_POINTS);
      jest.spyOn(service, 'getEntityNames').mockResolvedValue(ENTITY_NAMES);

      const res: jest.Mocked<Response> = {
        set: jest.fn(),
        sendFile: jest.fn(),
      } as Partial<Response> as jest.Mocked<Response>;

      await controller.getStopPoints(data, res);

      expect(service.getStopPoints).toBeCalledTimes(totalCount / data.limit);
      for (let i = 1; i < totalCount / data.limit; i++) {
        expect(service.getStopPoints).toHaveBeenNthCalledWith(i, {
          order: data.order,
          filters: data.filters,
          pagination: {
            page: i,
            limit: data.limit,
          },
        });
      }

      expect(service.getEntityNames).toBeCalledTimes(totalCount / data.limit);
      for (let i = 1; i < totalCount / data.limit; i++) {
        expect(service.getEntityNames).toHaveBeenNthCalledWith(
          i,
          'getEntityNamesPayload result',
        );
      }

      expect(getEntityNamesPayload).toBeCalledTimes(totalCount / data.limit);

      expect(getMatrix).toBeCalledTimes(totalCount / data.limit);
      expect(getMatrix).toHaveBeenCalledWith(STOP_POINTS, ENTITY_NAMES);

      expect(generateExcel).toBeCalledTimes(totalCount / data.limit);
      for (let i = 1; i < totalCount / data.limit; i++) {
        expect(generateExcel).toHaveBeenNthCalledWith(
          i,
          'getMatrix result',
          'stop points',
          filePath,
          ['1', '2'],
          i === 1,
        );
      }

      expect(stylizeStopPointsTable).toHaveBeenCalledWith(filePath);
      expect(res.set).toHaveBeenCalledWith(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      );
      expect(res.set).toHaveBeenCalledWith(
        'Content-Disposition',
        'attachment; filename=stop-points.xlsx',
      );
      expect(res.sendFile).toHaveBeenCalledWith('stop-points.xlsx', {
        root: './',
      });
    });
  });
});
