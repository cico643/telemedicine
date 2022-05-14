import { Injectable, NestMiddleware } from '@nestjs/common';
import { PatientsService } from '../../modules/users/patients/patients.service';

@Injectable()
export class CurrentUserMiddleware implements NestMiddleware {
  constructor(private patientsService: PatientsService) {}
  async use(req, res, next) {
    const id = req.session?.context?.id;
    if (id) {
      const user = await this.patientsService.findById(id);
      req.currentUser = user;
    }

    next();
  }
}
