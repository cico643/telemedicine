import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@Controller('appointments')
@ApiTags('appointments')
export class AppointmentsController {}
