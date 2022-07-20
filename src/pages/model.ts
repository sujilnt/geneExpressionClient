import api from "@/service/api";
import {GeneExpression} from "@/api";

import type { Put } from 'redux-saga/effects';
export enum GeneAction {
  FETCH_EXPRESSION_DATA = 'FETCH_EXPRESSION_DATA',
  SET_EXPRESSION_DATA = 'SET_EXPRESSION_DATA',
  SET_FILTER_OPTIONS = 'SET_FILTER_OPTIONS',
  SET_SELECTED_FILTERS = 'SET_SELECTED_FILTERS ',
  SET_FILTERED_DATA = 'SET_FILTERED_DATA',
  SET_ZSCORE_PERCENTAGE = 'SET_ZSCORE_PERCENTAGE',
  RESET_STATE = 'RESET_STATE'
};

export enum Filters {
  GeneSymbols = 'geneSymbols',
  DiagnosisList= 'diagnosisList'
}

export type FilterOptions = {
  [Filters.GeneSymbols]?: string[],
  [Filters.DiagnosisList]?: string[]
}

export interface GeneState {
  geneExpressions?: GeneExpression[];
  filterOptions: FilterOptions;
  selectedFilters: FilterOptions;
  filteredGeneExpressions?: GeneExpression[];
  zScorePercentage: number
}

function applyFilters(geneExpressions:GeneExpression[], selectedFilters: FilterOptions){
  const geneSymbols = new Set(selectedFilters.geneSymbols);
  const diagnosisList = new Set(selectedFilters.diagnosisList);

  const geneSymbolFilterAreEmpty = geneSymbols.size === 0;
  const diagnosisListFilterAreEmpty = diagnosisList.size === 0;

  if(geneSymbolFilterAreEmpty && diagnosisListFilterAreEmpty){
    return geneExpressions;
  }

  if(geneSymbols.size > 0 && diagnosisList.size > 0 ){
    return geneExpressions.filter((ge)=> {
      return geneSymbols.has(ge.geneSymbol)
        && diagnosisList.has(ge.diagnosis);
    });
  }

  if(geneSymbols.size > 0 || diagnosisList.size >0){
    return geneSymbols.size > 0
      ? geneExpressions.filter((ge) => geneSymbols.has(ge.geneSymbol))
      : geneExpressions.filter((ge)=> diagnosisList.has(ge.diagnosis))
  }
}

/**
 *  Groupping the genes expression data based on modelId and genesymbol
 * @param expression
 */
function groupByModelIdAndGeneSymbol(expression:GeneExpression[]){
  return expression?.reduce((acc:any, expression)=>{
    const id = `${expression.modelId}-${expression.geneSymbol}`;
    if(!acc[id]) {
      acc[id] = [];
    }
    acc[id].push(expression);
    return acc;
  },{});
}


/**
 * Aggregating the average zscores of same model_id and gene_symbol
 * @param GeneExpression[]
 * return the aggregate and average z-score
 */
function aggregateAndAverageZscores(expressions:GeneExpression[]): GeneExpression {
  const lastItemIndex = expressions.length - 1;
  return expressions.reduce((acc: GeneExpression, expression, i)=>{
    const newScore = (+acc.zScore) + (+expression.zScore);
    acc.zScore = (lastItemIndex === i) ? newScore/(lastItemIndex+1) : newScore;

    return acc;
  });
}

function sortByDiagnosis(arr:GeneExpression[], diagnosisList:string[]){
  return arr.sort((a,b)=> {
    return diagnosisList.findIndex((value)=> value === a?.diagnosis) - diagnosisList.findIndex((value)=> value === b?.diagnosis);
  });
}

function filterByzScorePercentage(arr: GeneExpression[],zScorePercentage: number){
  const totalValue = zScorePercentage === 0
    ? 0
    : Math.round((zScorePercentage / 100 * arr.length) - 1);
  const sortedByDescendingOrder = arr.sort((a, b)=> b.zScore - a.zScore);
  return sortedByDescendingOrder.filter((_,i)=> i <= totalValue);
}

const initialState: GeneState = {
  geneExpressions: undefined,
  filterOptions: {
    [Filters.GeneSymbols]: undefined,
    [Filters.DiagnosisList]: undefined
  },
  selectedFilters: {
    [Filters.GeneSymbols]: undefined,
    [Filters.DiagnosisList]: undefined
  },
  zScorePercentage:100
}

export default {
  namespace: 'genes',
  state: initialState,
  reducers:{
    [GeneAction.SET_EXPRESSION_DATA](state:GeneState, {geneExpressions}:{geneExpressions: GeneExpression[]}){
      state.geneExpressions = geneExpressions;
    },
    [GeneAction.SET_FILTER_OPTIONS](state:GeneState, {geneSymbols, diagnosisList}:{geneSymbols: string[], diagnosisList:string[]}){
      state.filterOptions[Filters.GeneSymbols] = geneSymbols;
      state.filterOptions[Filters.DiagnosisList] =diagnosisList;
    },
    [GeneAction.SET_SELECTED_FILTERS](state:GeneState, {selectedFilter ,value}: {selectedFilter: Filters, value: string[]}){
       state.selectedFilters[selectedFilter] = value;
    },
    [GeneAction.SET_ZSCORE_PERCENTAGE](state: GeneState, {zScorePercentage}:{zScorePercentage: number}){
      const {geneExpressions, filterOptions,selectedFilters} = state;
      const diagnosisList = filterOptions[Filters.DiagnosisList];

      if(!!geneExpressions){
        const updateGeneExpressions = sortByDiagnosis(filterByzScorePercentage(geneExpressions, zScorePercentage), diagnosisList as string[]);
        state.zScorePercentage = zScorePercentage;
        state.filteredGeneExpressions = applyFilters(updateGeneExpressions, selectedFilters);
      }
    },
    [GeneAction.SET_FILTERED_DATA](state:GeneState){
      if(state?.geneExpressions){
        state.filteredGeneExpressions = applyFilters(state.geneExpressions, state.selectedFilters);
      }
    },
    [GeneAction.RESET_STATE](){
      return initialState;
    }
  },
  effects:{
    *[GeneAction.FETCH_EXPRESSION_DATA](_payload: any, {put, call} : {put:Put, call:Function}){
      let geneExpressions:GeneExpression[] = [];
      try{
        // fetching the geneExpress data
        geneExpressions = yield call(()=>api.genes.getExpressionData());
        if(geneExpressions?.length){
          // grouping the geneExpression by modelId and gene_symbol
          let groupedExpressions : GeneExpression[][] = Object.values(groupByModelIdAndGeneSymbol(geneExpressions));
          // aggregating and taking average of all the values z-score value based on same model ids and gene symbols.
          geneExpressions = groupedExpressions.reduce((acc, geneExpressions)=>{
            if(geneExpressions.length === 1){
              acc.push(geneExpressions[0]);
            } else {
              acc.push(aggregateAndAverageZscores(geneExpressions))
            }
            return acc;
          }, []) as GeneExpression[];
        }

        // setting the multi select options
        const filterOptions = geneExpressions.reduce((acc, geneExpression)=>{
          acc.geneSymbol.add(geneExpression.geneSymbol);
          acc.diagnosis.add(geneExpression.diagnosis);
          return acc;
        }, { geneSymbol: new Set(), diagnosis: new Set()})

        const diagnosisList = Array.from(filterOptions.diagnosis);

        yield put({
          type: GeneAction.SET_FILTER_OPTIONS,
          geneSymbols: Array.from(filterOptions.geneSymbol),
          diagnosisList
        });


        yield put.resolve({
          type: GeneAction.SET_EXPRESSION_DATA,
          geneExpressions: sortByDiagnosis(filterByzScorePercentage(geneExpressions, 100), diagnosisList as string[])
        });

      } catch (e) {
        console.error("error", e);
      }
    }
  }
}

