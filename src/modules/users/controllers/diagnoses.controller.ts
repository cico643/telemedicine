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
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { genericErrorHandler } from '../../../lib/genericErrorHandler';
import { CreateUserDto } from '../dtos/create-user.dto';
import { DiagnosesService } from '../services/diagnoses.service';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserRole } from '../entities/user.entity';
import { CreateDiagnoseDto } from '../dtos/create-diagnose.dto';
import { Session as SessionType } from 'express-session';

@ApiTags('diagnoses')
@Controller('diagnoses')
export class DiagnosesController {
  constructor(
    private diagnosesService: DiagnosesService,
    private readonly logger: Logger,
  ) {}

  @Post()
  @Roles(UserRole.Admin)
  @HttpCode(201)
  async addDiagnose(
    @Body() body: CreateDiagnoseDto,
    @Session() session: SessionType,
  ) {
    try {
      const diagnose = await this.diagnosesService.addDiagnose(body);

      this.logger.log(
        `Diagnose added by admin [userId: ${session.context.id}]`,
        DiagnosesController.name,
      );
      return diagnose;
    } catch (err) {
      return genericErrorHandler(err);
    }
  }

  @Get()
  @HttpCode(200)
  async getDiagnoses() {
    const diagnoses = await this.diagnosesService.getDiagnoses();
    this.logger.log(`Fetched all diagnoses`, DiagnosesController.name);
    return diagnoses;
  }

  @Get('/:id')
  @HttpCode(200)
  async getDiagnose(@Param('id', ParseIntPipe) id: number) {
    return this.diagnosesService.getDiagnoseById(id);
  }

  @Delete('/:id')
  @HttpCode(204)
  async deleteDiagnose(
    @Param('id', ParseIntPipe) id: number,
    @Session() session: SessionType,
  ) {
    const deleteResult = await this.diagnosesService.deleteDiagnose(id);
    this.logger.log(
      `Diagnose deleted by admin [userId: ${session.context.id}]`,
      DiagnosesController.name,
    );
    return deleteResult;
  }
}
