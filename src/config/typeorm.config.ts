import { Injectable } from '@nestjs/common';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { dataSourceOptions } from 'src/db/datasource';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  constructor() {}
  createTypeOrmOptions(): TypeOrmModuleOptions {
    return dataSourceOptions;
  }
}
