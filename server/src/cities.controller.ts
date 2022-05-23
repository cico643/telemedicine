import {
  CacheInterceptor,
  Controller,
  Get,
  HttpCode,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from './common/guards/auth.guard';
import fs from 'fs';
import path from 'path';

@UseGuards(AuthGuard)
@ApiTags('cities')
@Controller('cities')
export class CitiesController {
  constructor() {}

  @UseInterceptors(CacheInterceptor)
  @Get()
  @HttpCode(200)
  getAllCities() {
    const data = fs.readFileSync(
      path.join(
        __dirname,
        'providers',
        'database',
        'turkey_city_district_list.json',
      ),
      'utf-8',
    );
    const citiesJson = JSON.parse(data);
    return citiesJson;
  }
}
