import { getMetadataArgsStorage } from 'typeorm';

export function getModelFromTemplate(text: string) {
  const variableRegex = /\{\{([^{}]+)\}\}/g;
  const matches = text.match(variableRegex);

  return matches
    ? matches.map((match: string) => match.replace(/\{\{|\}\}/g, '').trim())
    : [];
}

export function convertSqlToSqlLite() {
  const metadataArgsStorage = getMetadataArgsStorage();
  metadataArgsStorage.columns.forEach((column) => {
    switch (column.options.type) {
      case 'datetime':
        column.options.default = () => 'CURRENT_TIMESTAMP';
        break;
      case 'date':
        column.options.default = () => 'CURRENT_TIMESTAMP';
        break;
      case 'timestamp':
        column.options.type = 'datetime';
        column.options.default = () => 'CURRENT_TIMESTAMP';
        break;
      case 'longtext':
        column.options.type = 'text';
        break;
      case 'bool':
        column.options.type = 'integer';
        break;
      default:
        break;
    }
  });
}
