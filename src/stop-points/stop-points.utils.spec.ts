import {
  generateExcel,
  getEntityNamesPayload,
  getMatrix,
  stylizeStopPointsTable,
} from './stop-points.utils';
const Excel = require('exceljs');

const addRowMock = jest.fn();
const writeFileMock = jest.fn();
const readFileMock = jest.fn();
const addWorksheetMock = jest.fn().mockReturnValue({
  addRow: addRowMock,
});
const eachCellMock = jest.fn((callback) => {
  if (typeof callback === 'function') {
    callback({});
  }
});
const getRowMock = jest.fn().mockReturnValue({
  eachCell: eachCellMock,
});
const getColumnMock = jest.fn().mockReturnValue({
  width: 0,
});
const getWorksheetMock = jest.fn().mockReturnValue({
  getColumn: getColumnMock,
  getRow: getRowMock,
  rowCount: 5,
});

jest.mock('exceljs', () => ({
  Workbook: jest.fn().mockImplementation(() => ({
    addWorksheet: addWorksheetMock,
    getWorksheet: getWorksheetMock,
    xlsx: {
      readFile: readFileMock,
      writeFile: writeFileMock,
    },
  })),
}));

describe('generateExcel', () => {
  const data = [
    { name: 'John', age: 30 },
    { name: 'Jane', age: 25 },
  ];
  const pageName = 'Sheet1';
  const filePath = 'test.xlsx';
  const headers = ['name', 'age'];
  const isFirstPage = true;

  beforeEach(() => {
    Excel.Workbook.mockClear();
  });

  test('should create a new workbook and worksheet if isFirstPage is true', async () => {
    await generateExcel(data, pageName, filePath, headers, isFirstPage);

    expect(Excel.Workbook).toBeCalled();

    expect(addWorksheetMock).toHaveBeenCalledWith(pageName);

    expect(addRowMock).toHaveBeenCalledTimes(1 + data.length);
    expect(addRowMock).toHaveBeenNthCalledWith(1, ['name', 'age']);
    expect(addRowMock).toHaveBeenNthCalledWith(2, ['John', 30]);
    expect(addRowMock).toHaveBeenNthCalledWith(3, ['Jane', 25]);

    expect(writeFileMock).toHaveBeenCalledWith(filePath);
  });

  test('should throw an error if an exception occurs', async () => {
    const errorMessage = 'An error occurred';
    Excel.Workbook.mockImplementationOnce(() => ({
      addWorksheet: jest.fn().mockReturnThis(),
      getWorksheet: jest.fn().mockReturnThis(),
      addRow: jest.fn(),
      xlsx: {
        readFile: jest.fn(),
        writeFile: jest.fn().mockRejectedValueOnce(new Error(errorMessage)),
      },
    }));

    await expect(
      generateExcel(data, pageName, filePath, headers, isFirstPage),
    ).rejects.toThrow(new Error(errorMessage));
  });
});

describe('stylizeStopPointsTable', () => {
  it('should stylize the stop points table and save the changes', async () => {
    const columnWidth = [34, 33, 21, 35, 14];
    const filePath = 'path/to/your/file.xlsx';
    await stylizeStopPointsTable(filePath);

    expect(Excel.Workbook).toHaveBeenCalled();
    expect(readFileMock).toHaveBeenCalledWith(filePath);

    expect(getWorksheetMock).toHaveBeenCalledWith('stop points');
    expect(getColumnMock).toHaveBeenCalledTimes(columnWidth.length);
    expect(getRowMock).toHaveBeenCalledTimes(5);

    expect(eachCellMock).toHaveBeenCalledWith(expect.any(Function));

    expect(writeFileMock).toHaveBeenCalledWith(filePath);
  });

  it('should throw an error when there is an error in processing the file', async () => {
    const filePath = 'path/to/your/file.xlsx';
    readFileMock.mockRejectedValueOnce(new Error('Error reading file'));

    await expect(stylizeStopPointsTable(filePath)).rejects.toThrow(
      'Error reading file',
    );
  });
});

describe('getEntityNamesPayload', () => {
  it('should return the expected payload', () => {
    const stopPoints = {
      payload: {
        items: [
          { owner_department_uuid: 'uuid1' },
          { owner_department_uuid: 'uuid2' },
          { owner_department_uuid: 'uuid1' },
        ],
      },
    };

    const result = getEntityNamesPayload(stopPoints);

    expect(result).toEqual({
      full: false,
      items: [
        {
          class: 'App\\Model\\Unit',
          uuid: 'uuid1',
          source: 'organizational_units',
        },
        {
          class: 'App\\Model\\Unit',
          uuid: 'uuid2',
          source: 'organizational_units',
        },
      ],
    });
  });
});

describe('getMatrix', () => {
  it('should return the expected matrix', () => {
    const stopPoints = {
      payload: {
        items: [
          {
            owner_department_uuid: 'uuid1',
            source: 'mta',
          },
          {
            owner_department_uuid: 'uuid2',
            source: 'inventarisation_active',
          },
        ],
      },
    };

    const owners = {
      payload: {
        items: [
          {
            uuid: 'uuid1',
            name: 'owner1',
          },
          {
            uuid: 'uuid2',
            name: 'owner2',
          },
        ],
      },
    };

    const result = getMatrix(stopPoints, owners);

    expect(result).toEqual([
      {
        owner_department_uuid: 'owner1',
        source: 'МТА',
      },
      {
        owner_department_uuid: 'owner2',
        source: 'Инвентаризация',
      },
    ]);
  });
});
