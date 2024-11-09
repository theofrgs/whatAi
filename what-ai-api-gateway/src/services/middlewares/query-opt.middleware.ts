import { Injectable, NestMiddleware } from '@nestjs/common';
import { Response, NextFunction } from 'express';

@Injectable()
export class QueryOptMiddleware implements NestMiddleware {
  use(req: any, _: Response, next: NextFunction) {
    const { page, perPage, sortBy, select, ...filterParams } = req.query;

    req.queryOpt = {
      page: page !== undefined ? +page : undefined,
      perPage: perPage !== undefined ? +perPage : undefined,
      searchBy:
        Object.keys(filterParams).length > 0
          ? parseUrlByKey(new URLSearchParams(filterParams).toString())
          : undefined,
      sortBy: sortBy !== undefined ? parseUrlByKey(sortBy) : undefined,
      select: select !== undefined ? select.split(',') : undefined,
    };
    next();
  }
}

function parseUrlByKey(searchByString: string): any {
  const searchByObject: any = {};

  searchByString.split('&').forEach((field) => {
    const [key, value] = field.split('=');
    const keys = key.split('.');
    let currentObj = searchByObject;

    keys.forEach((k, index) => {
      if (index === keys.length - 1) {
        currentObj[k] = value;
      } else {
        currentObj[k] = currentObj[k] || {};
        currentObj = currentObj[k];
      }
    });
  });

  return searchByObject;
}
