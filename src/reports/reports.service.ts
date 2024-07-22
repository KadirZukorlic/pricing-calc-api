import { Injectable } from '@nestjs/common';

@Injectable()
export class ReportsService {
  async create(body: any) {
    console.log('Creating a report...', body);
  }
}
