import { HttpException, HttpStatus } from '@nestjs/common';
import {
  EntityManager,
  EntityPropertyNotFoundError,
  ILike,
  ObjectLiteral,
  QueryFailedError,
} from 'typeorm';
import { Repository } from 'typeorm/repository/Repository';
import { QueryOpt } from './interfaces/query-opt.interface';

interface IBaseService<T extends ObjectLiteral> {
  create(...args: any[]): Promise<T>;
  findBy(
    findOptions?: any,
    relations?: string[],
    opt?: any,
    entityManager?: EntityManager,
    queryOpt?: QueryOpt,
  ): Promise<T[]>;
  findOneBy(
    findOneOptions?: any,
    relations?: string[],
    opt?: any,
    entityManager?: EntityManager,
  ): Promise<T | null>;
  findOneByOrFail(
    findOneOptions?: any,
    relations?: string[],
    opt?: any,
    entityManager?: EntityManager,
  ): Promise<T>;
  remove(id: string, entityManager?: EntityManager): Promise<any>;
}

export abstract class BaseService<T extends ObjectLiteral>
  implements IBaseService<T>
{
  constructor(private repository: Repository<T>) {}

  // TODO refacto avoid unkdow and any ?
  async create(dto: Partial<T>, entityManager?: EntityManager): Promise<T> {
    const manager = entityManager || this.repository.manager;

    return manager.save(
      this.repository.target,
      manager.create(this.repository.target, dto as T),
    ) as unknown as T;
  }

  // TODO refacto findOption and queryOpt.searchBy should be combined, or do another way
  // [
  //   { totFollower: MoreThan(100000) },
  //   { totFollower: MoreThan(50) },
  // ]
  // { tags: 'CAMERA' },
  // { totFollower: MoreThan(50) },
  async findBy(
    findOptions?: any,
    relations?: string[],
    opt?: any,
    entityManager?: EntityManager,
    queryOpt?: QueryOpt,
  ): Promise<T[]> {
    const { page, perPage, searchBy, sortBy, select } = queryOpt || {};
    const skip = page && perPage ? page * perPage : 0;
    const take = perPage || undefined;

    const applyILike = (obj: any): any => {
      if (Array.isArray(obj)) {
        return obj.map((item) => applyILike(item));
      } else if (typeof obj === 'object' && obj !== null) {
        const result: any = {};
        for (const [key, value] of Object.entries(obj)) {
          result[key] = applyILike(value);
        }
        return result;
      } else {
        return ILike(`%${obj}%`);
      }
    };
    const combineConditions = (findOpts: any, search: any): any => {
      if (Array.isArray(findOpts)) {
        // OR condition
        return [...findOpts, applyILike(search || {})];
      } else {
        // AND condition
        return { ...findOpts, ...applyILike(search || {}) };
      }
    };

    const where = combineConditions(findOptions, searchBy);
    const order = sortBy || {};

    try {
      return await (entityManager || this.repository.manager).find(
        this.repository.target,
        {
          where,
          select,
          cache: 60000,
          relations: relations || [],
          order,
          skip,
          take,
          ...opt,
        },
      );
    } catch (error) {
      if (error instanceof EntityPropertyNotFoundError) {
        throw new HttpException(
          { message: `Invalid query params` },
          HttpStatus.NOT_FOUND,
        );
      }
      if (
        error instanceof QueryFailedError &&
        error.message.includes("Unknown column 'distinctAlias")
      ) {
        throw new HttpException(
          { message: `Invalid select` },
          HttpStatus.NOT_FOUND,
        );
      } else {
        throw error;
      }
    }
  }

  async findOneBy(
    findOneOptions?: any,
    relations?: string[],
    opt?: any,
    entityManager?: EntityManager,
  ): Promise<T | null> {
    return (entityManager || this.repository.manager).findOne(
      this.repository.target,
      {
        where: findOneOptions,
        relations: relations || [],
        ...opt,
      },
    );
  }

  async findOneByOrFail(
    findOneOptions?: any,
    relations?: string[],
    opt?: any,
    entityManager?: EntityManager,
  ): Promise<T> {
    const entity = await this.findOneBy(
      findOneOptions,
      relations,
      opt,
      entityManager,
    );
    if (!entity)
      throw new HttpException({ message: `Not found` }, HttpStatus.NOT_FOUND);
    return entity;
  }

  async remove(id: string, entityManager?: EntityManager): Promise<any> {
    await (entityManager || this.repository.manager).remove(
      this.repository.target,
      await this.findOneByOrFail({ id }, [], {}, entityManager),
    );
    return `${id} has been removed`;
  }
}
