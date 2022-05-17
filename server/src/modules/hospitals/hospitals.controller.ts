import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@Controller('hospitals')
@ApiTags('hospitals')
export class HospitalsController {}
