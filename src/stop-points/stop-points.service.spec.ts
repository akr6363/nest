import { StopPointsService } from './stop-points.service';
import { Test, TestingModule } from '@nestjs/testing';
import fetch from 'cross-fetch';
import { MOCK_ENTITY_NAME_PAYLOAD, MOCK_META } from '../mock-constants';

let service: StopPointsService;

beforeAll(async () => {
  const module: TestingModule = await Test.createTestingModule({
    providers: [StopPointsService],
  }).compile();

  service = module.get<StopPointsService>(StopPointsService);
});

jest.mock('node-fetch', () => jest.fn());

let fetchSpy: jest.SpyInstance;

beforeEach(() => {
  fetchSpy = jest.spyOn(fetch as any, 'default');
});

afterEach(() => {
  fetchSpy.mockRestore();
});

describe('StopPointsService', () => {
  describe('getStopPoints', () => {
    test('should fetch stop points data successfully', async () => {
      const mockResponse = {
        success: true,
        headers: {},
        payload: {
          items: [],
        },
      };

      fetchSpy.mockResolvedValue({
        ok: true,
        status: 200,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await service.getStopPoints(MOCK_META);

      expect(result).toEqual(mockResponse);
    });

    test('should throw an error if fetching stop points data fails', async () => {
      fetchSpy.mockResolvedValue({
        ok: false,
        status: 500,
        statusText: 'Bad Request',
      });

      await expect(service.getStopPoints(MOCK_META)).rejects.toThrow(
        'Error fetching data: Bad Request',
      );
    });
  });

  describe('getEntityNames', () => {
    test('should fetch entity names data successfully', async () => {
      const mockResponse = {
        success: true,
        headers: {},
        payload: {
          items: [],
        },
      };

      fetchSpy.mockResolvedValue({
        ok: true,
        status: 200,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await service.getEntityNames(MOCK_ENTITY_NAME_PAYLOAD);

      expect(result).toEqual(mockResponse);
    });

    test('should throw an error if fetching entity names data fails', async () => {
      fetchSpy.mockResolvedValue({
        ok: false,
        status: 500,
        statusText: 'Bad Request',
      });

      await expect(
        service.getEntityNames(MOCK_ENTITY_NAME_PAYLOAD),
      ).rejects.toThrow('Error fetching data: Bad Request');
    });
  });
});
