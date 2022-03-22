import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { PatientsService } from '../patients/patients.service';

@Injectable()
export class CurrentUserMiddleware implements NestMiddleware {
  constructor(private patientsService: PatientsService) {}
  async use(req, res, next) {
    const userId = req.session?.context?.userId;
    if (userId) {
      const user = await this.patientsService.findById(userId);
      req.currentUser = user;
    }

    next();
  }
}
