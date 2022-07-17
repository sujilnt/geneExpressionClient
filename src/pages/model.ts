import api from "@/service/api";
import {GeneExpression} from "@/api";

import type { Put } from 'redux-saga/effects';

export enum GeneAction {
  FETCH_EXPRESSION_DATA = 'FETCH_EXPRESSION_DATA',
  SET_EXPRESSION_DATA = 'SET_EXPRESSION_DATA',
  SET_FILTER_OPTIONS = 'SET_FILTER_OPTIONS',
  SET_SELECTED_FILTERS = 'SET_SELECTED_FILTERS ',
  RESET_STATE = 'RESET_STATE'
};

export enum Filters {
  GeneSymbols = 'geneSymbols',
  DiagnosisList= 'diagnosisList'
}

type FilterOptions = {
  [Filters.GeneSymbols]?: string[],
  [Filters.DiagnosisList]?: string[]
}

export interface GeneState {
  geneExpressions?: GeneExpression[];
  filterOptions: FilterOptions;
  selectedFilters: FilterOptions;
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
  }
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
    [GeneAction.RESET_STATE](){
      return initialState;
    }
  },
  effects:{
    *[GeneAction.FETCH_EXPRESSION_DATA](_payload: any, {put, call} : {put:Put, call:Function}){
      try{
        const geneExpressions:GeneExpression[] = yield call(()=>api.genes.getExpressionData());
        yield put.resolve({
          type: GeneAction.SET_EXPRESSION_DATA,
          geneExpressions
        });

        if(!!geneExpressions.length){
          // setting the multi select options
          const filterOptions = geneExpressions.reduce((acc, geneExpression)=>{
            acc.geneSymbol.add(geneExpression.geneSymbol);
            acc.diagnosis.add(geneExpression.diagnosis);
            return acc;
          }, { geneSymbol: new Set(), diagnosis: new Set()})


          yield put({
            type: GeneAction.SET_FILTER_OPTIONS,
            geneSymbols: Array.from(filterOptions.geneSymbol),
            diagnosisList: Array.from(filterOptions.diagnosis)
          });
        }
      } catch (e) {
        console.error("error", e);
      }
    }
  }
}

