import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Logger,
  Param,
  ParseIntPipe,
  Post,
  Session,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { genericErrorHandler } from '../../../lib/genericErrorHandler';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserRole } from '../entities/user.entity';
import { Session as SessionType } from 'express-session';
import { MedicationsService } from '../services/medications.service';
import { CreateMedicationDto } from '../dtos/create-medication.dto';

@ApiTags('medications')
@Controller('medications')
export class MedicationsController {
  constructor(
    private medicationsService: MedicationsService,
    private readonly logger: Logger,
  ) {}

  @Post()
  @Roles(UserRole.Admin)
  @HttpCode(201)
  async addMedication(
    @Body() body: CreateMedicationDto,
    @Session() session: SessionType,
  ) {
    try {
      const medication = await this.medicationsService.addMedication(body);

      this.logger.log(
        `Medication added by admin [userId: ${session.context.id}]`,
        MedicationsController.name,
      );
      return medication;
    } catch (err) {
      return genericErrorHandler(err);
    }
  }

  @Get()
  @HttpCode(200)
  async getMedications() {
    const medications = await this.medicationsService.getMedications();
    this.logger.log(`Fetched all medications`, MedicationsController.name);
    return medications;
  }

  @Get('/:id')
  @HttpCode(200)
  async getMedication(@Param('id', ParseIntPipe) id: number) {
    return this.medicationsService.getMedicationById(id);
  }

  @Delete('/:id')
  @Roles(UserRole.Admin)
  @HttpCode(204)
  async deleteMedication(
    @Param('id', ParseIntPipe) id: number,
    @Session() session: SessionType,
  ) {
    const deleteResult = await this.medicationsService.deleteMedication(id);
    this.logger.log(
      `Medication deleted by admin [userId: ${session.context.id}]`,
      MedicationsController.name,
    );
    return deleteResult;
  }
}
