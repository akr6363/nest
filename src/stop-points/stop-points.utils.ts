import { SOURCES, TABLE_HEADERS } from './stop-points.constants';
const Excel = require('exceljs');

export async function generateExcel(
  data,
  pageName,
  filePath,
  headers,
  isFirstPage,
) {
  try {
    const workbook = new Excel.Workbook();
    let worksheet;
    if (isFirstPage) {
      worksheet = workbook.addWorksheet(pageName);
      worksheet.addRow(
        headers.map((h) => (TABLE_HEADERS[h] ? TABLE_HEADERS[h] : h)),
      );
    } else {
      await workbook.xlsx.readFile(filePath);
      worksheet = workbook.getWorksheet(pageName);
    }

    data.forEach((row) => {
      const values = headers.map((header) => row[header]);
      worksheet.addRow(values);
    });

    await workbook.xlsx.writeFile(filePath);
  } catch (e) {
    throw e;
  }
}
export async function stylizeStopPointsTable(filePath) {
  try {
    const workbook = new Excel.Workbook();
    await workbook.xlsx.readFile(filePath);
    const table = workbook.getWorksheet('stop points');
    const columnWidth = [34, 33, 21, 35, 14];

    const headerStyle = {
      font: { bold: true, size: 10 },
      alignment: { horizontal: 'center' as const },
    };

    columnWidth.forEach((width, index) => {
      table.getColumn(index + 1).width = width;
    });

    const headerRow = table.getRow(1);

    headerRow.eachCell((cell) => {
      cell.style = headerStyle;
    });
    const rowCount = table.rowCount;
    // table.getRow(1).height =  19
    for (let i = 2; i <= rowCount; i++) {
      // table.getRow(i).height =  35
      table.getRow(i).eachCell({ includeEmpty: true }, (cell) => {
        cell.border = {
          top: { style: 'medium' },
          left: { style: 'medium' },
          bottom: { style: 'medium' },
          right: { style: 'medium' },
        };
        cell.font = {
          size: 10,
        };
        cell.alignment = {
          wrapText: true,
        };
      });
    }
    await workbook.xlsx.writeFile(filePath);
  } catch (e) {
    throw e;
  }
}

export const getEntityNamesPayload = (stopPoints) => {
  const units = stopPoints.payload.items
    .map(({ owner_department_uuid }) => owner_department_uuid)
    .filter((item, index, arr) => arr.indexOf(item) === index);

  return {
    full: false,
    items: units.map((uuid) => ({
      class: 'App\\Model\\Unit',
      uuid: uuid,
      source: 'organizational_units',
    })),
  };
};

export const getMatrix = (stopPoints, owners) => {
  return stopPoints.payload.items.map((item) => ({
    ...item,
    owner_department_uuid: item.owner_department_uuid
      ? owners.payload.items.find((i) => i.uuid === item.owner_department_uuid)
          .name
      : '-не задано-',
    source: SOURCES[item.source],
  }));
};
