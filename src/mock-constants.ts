import {
  EntityNameType,
  GetStopPointsMetaType,
  ResponseType,
  StopPointType,
} from './types';

export const STOP_POINTS: ResponseType<StopPointType[]> = {
  success: true,
  headers: {
    meta: {
      pagination: {
        total: 2,
        per_page: 1,
        current_page: 1,
        total_pages: 2,
      },
    },
  },
  payload: {
    items: [
      {
        uuid: 'uuid',
        title: 'title',
        register_number: 'register_number',
        source: 'source',
        latitude: 1,
        longitude: 2,
      },
      {
        uuid: 'uuid',
        title: 'title',
        register_number: 'register_number',
        source: 'source',
        latitude: 1,
        longitude: 2,
      },
    ],
  },
};

export const ENTITY_NAMES: ResponseType<EntityNameType[]> = {
  success: true,
  headers: {
    meta: {
      pagination: {
        total: 1,
        per_page: 1,
        current_page: 1,
        total_pages: 11,
      },
    },
  },
  payload: {
    items: [
      {
        class: 'class',
        uuid: 'uuid',
        source: 'source',
        name: 'name',
        deleted: false,
      },
      {
        class: 'class',
        uuid: 'uuid',
        source: 'source',
        name: 'name',
        deleted: false,
      },
    ],
  },
};

export const MOCK_META: GetStopPointsMetaType = {
  order: {
    column: 'name',
    direction: 'asc',
  },
  filters: {
    withSource: null,
    withSources: null,
  },
  pagination: {
    page: 1,
    limit: 2,
  },
};

export const MOCK_ENTITY_NAME_PAYLOAD = {
  full: true,
  items: {
    class: 'class',
    uuid: ['uuid'],
    source: 'source',
  },
};
