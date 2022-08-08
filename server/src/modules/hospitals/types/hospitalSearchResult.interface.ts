import HospitalSearchBody from './hospitalSearchBody.interface';

interface HospitalSearchResult {
  hits: {
    total: number;
    hits: Array<{
      _source: HospitalSearchBody;
    }>;
  };
}

export default HospitalSearchResult;
