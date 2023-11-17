type DirectionType = 'asc' | 'desc';

type OrderType = {
  column: string;
  direction: DirectionType;
};

type FiltersrType = {
  withSource: string[] | null;
  withSources: string[] | null;
};

export type GetStopPointsDataType = {
  filters: FiltersrType;
  order: OrderType;
  limit: number;
};

export type GetStopPointsMetaType = {
  filters: FiltersrType;
  order: OrderType;
  pagination: {
    page: number;
    limit: number;
  };
};

export type StopPointType = {
  uuid: string;
  title: string;
  register_number: string;
  source: string;
  latitude: number;
  longitude: number;
};

export type ResponseType<T> = {
  success: boolean;
  headers: {
    meta: {
      pagination: {
        total: number;
        per_page: number;
        current_page: number;
        total_pages: number;
      };
    };
  };
  payload: { items: T };
};

export type EntityNamesPayloadType = {
  full: boolean;
  items: {
    class: string;
    uuid: string[];
    source: string;
  };
};

export type EntityNameType = {
  class: string;
  uuid?: string;
  source: string;
  name: string;
  deleted: boolean;
};
