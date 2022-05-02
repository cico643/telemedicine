import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@Controller('documents')
@ApiTags('documents')
export class DocumentsController {}
