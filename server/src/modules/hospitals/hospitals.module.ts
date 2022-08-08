import { Logger, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SearchModule } from '../../providers/elasticsearch/search.module';
import { UsersModule } from '../users/users.module';
import { Department } from './entities/department.entity';
import { Hospital } from './entities/hospital.entity';
import HospitalsSearchService from './hospitals-search.service';
import { HospitalsController } from './hospitals.controller';
import { HospitalsService } from './hospitals.service';

@Module({
  imports: [
    UsersModule,
    SearchModule,
    TypeOrmModule.forFeature([Hospital, Department]),
  ],
  controllers: [HospitalsController],
  providers: [HospitalsService, HospitalsSearchService, Logger],
})
export class HospitalsModule {}
