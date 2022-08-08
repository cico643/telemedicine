import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import HospitalSearchBody from './types/hospitalSearchBody.interface';
import { Hospital } from './entities/hospital.entity';
import HospitalSearchResult from './types/hospitalSearchResult.interface';

@Injectable()
export default class HospitalsSearchService {
  private index = 'hospitals';

  constructor(private readonly elasticsearchService: ElasticsearchService) {}

  async indexHospital(hospital: Hospital) {
    return this.elasticsearchService.index<
      HospitalSearchResult,
      HospitalSearchBody
    >({
      index: this.index,
      body: {
        id: hospital.id,
        name: hospital.name,
        province: hospital.province,
        district: hospital.district,
      },
    });
  }

  async searchHospitalsForGivenCityDistrict(
    province: string,
    district: string,
  ) {
    const { body } =
      await this.elasticsearchService.search<HospitalSearchResult>({
        index: this.index,
        body: {
          query: {
            bool: {
              must: [
                {
                  match: {
                    province: province,
                  },
                },
                {
                  match: {
                    district: district,
                  },
                },
              ],
            },
          },
        },
      });
    const hits = body.hits.hits;
    return hits.map((item) => item._source);
  }
}
