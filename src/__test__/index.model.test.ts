import 'jest';
import api from '@/service/api';
import { setup } from './helper';
import model, { GeneAction, Filters } from '@/pages/model';
import type { GeneExpression } from '@/api';

jest.mock('@/service/api');

const data: GeneExpression[] = [
  {
    modelId: 'T2',
    geneSymbol: 'ACVR1B',
    zScore: -0.615815,
    diagnosis: 'squamous cell carcinoma',
    platformId: 'platform_1',
    chromosome: 12,
    seqStartPosition: 51951667,
    seqEndPosition: 51997078,
    geneIdEnsembl: 'ENSG00000135503',
  },
  {
    modelId: 'T2',
    geneSymbol: 'ACVR1B',
    zScore: 1.68729,
    diagnosis: 'squamous cell carcinoma',
    platformId: 'platform_1',
    chromosome: 12,
    seqStartPosition: 51951667,
    seqEndPosition: 51997078,
    geneIdEnsembl: 'ENSG00000135503',
  },
  ,
  {
    modelId: 'T4',
    geneSymbol: 'ACVR1B',
    zScore: 0.487709,
    diagnosis: 'squamous cell carcinoma',
    platformId: 'platform_1',
    chromosome: 12,
    seqStartPosition: 51951667,
    seqEndPosition: 51997078,
    geneIdEnsembl: 'ENSG00000135503',
  },
  {
    modelId: 'T10',
    geneSymbol: 'ACVR1B',
    zScore: 0.491594,
    diagnosis: 'adenocarcinoma',
    platformId: 'platform_2',
    chromosome: 12,
    seqStartPosition: 51951667,
    seqEndPosition: 51997078,
    geneIdEnsembl: 'ENSG00000135503',
  },
];

const result: GeneExpression[] = [
  {
    modelId: 'T2',
    geneSymbol: 'ACVR1B',
    zScore: 0.5357375,
    diagnosis: 'squamous cell carcinoma',
    platformId: 'platform_1',
    chromosome: 12,
    seqStartPosition: 51951667,
    seqEndPosition: 51997078,
    geneIdEnsembl: 'ENSG00000135503',
  },
  {
    modelId: 'T4',
    geneSymbol: 'ACVR1B',
    zScore: 0.487709,
    diagnosis: 'squamous cell carcinoma',
    platformId: 'platform_1',
    chromosome: 12,
    seqStartPosition: 51951667,
    seqEndPosition: 51997078,
    geneIdEnsembl: 'ENSG00000135503',
  },
  {
    modelId: 'T10',
    geneSymbol: 'ACVR1B',
    zScore: 0.491594,
    diagnosis: 'adenocarcinoma',
    platformId: 'platform_2',
    chromosome: 12,
    seqStartPosition: 51951667,
    seqEndPosition: 51997078,
    geneIdEnsembl: 'ENSG00000135503',
  },
];

const geneSymbolMap = new Set(result.map((r) => r.geneSymbol));
const diagnosis = new Set(result.map((r) => r.diagnosis));

describe('Genes Model', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Fetch Gene expression And input Filters', async () => {
    const { getState, dispatch } = setup([model]);
    api.genes.getExpressionData = jest.fn(() => Promise.resolve(data));

    await dispatch({
      type: `genes/${GeneAction.FETCH_EXPRESSION_DATA}`,
    });

    expect(api.genes.getExpressionData).toBeCalled();
    expect(getState().genes.geneExpressions).toStrictEqual(result);
    expect(getState().genes.filterOptions).toStrictEqual({
      [Filters.GeneSymbols]: [...geneSymbolMap],
      [Filters.DiagnosisList]: [...diagnosis],
    });
  });
});
