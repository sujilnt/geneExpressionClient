import React, {memo, useEffect} from "react";
import {Dispatch, useDispatch, useSelector} from 'umi';
import {Spin} from 'antd';
import ChartFilters from "@/components/Filters";
import HeatMapChart from "@/components/HeatMap";

import {Filters, GeneAction} from "@/pages/model";
import type {GlobalState} from "@/service/interface";

import styles from './style.less';

function getDispatchedMethods(dispatch: Dispatch){
  return{
    onMount(){
      dispatch({
        type: `genes/${GeneAction.FETCH_EXPRESSION_DATA}`
      });
    },
    onUnMount(){
      dispatch({
        type: `genes/${GeneAction.RESET_STATE}`
      });
    }
  }
}

function Index() {
  const {onMount, onUnMount} =  getDispatchedMethods(useDispatch());
  const state = useSelector((state: GlobalState)=> {
    return Object.assign({}, state.genes , {
      geneExpressions: !!state.genes?.filteredGeneExpressions?.length
        ? state.genes.filteredGeneExpressions
        : state.genes.geneExpressions,
      isFetchingGeneExpressions: state.loading.effects[`genes/${GeneAction.FETCH_EXPRESSION_DATA}`],
    });
  });

  const {
    isFetchingGeneExpressions,
    geneExpressions,
    filterOptions,
    selectedFilters,
    zScorePercentage,
  }  = state;

  useEffect(()=>{
    onMount();

    return onUnMount;
  },[]);

  const diagnosisList = filterOptions[Filters.DiagnosisList];

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>PDCM Gene Finder</h1>
      <ChartFilters
        filterOptions={filterOptions}
        selectedFilters={selectedFilters}
        isLoading={isFetchingGeneExpressions}
        zScorePercentage={zScorePercentage}
        isDataEmpty = {!geneExpressions || geneExpressions?.length === 0 }
      />
      <Spin spinning={isFetchingGeneExpressions }>
        <div className={styles.chartContainer}>
          { geneExpressions?.length
            ? <HeatMapChart data={geneExpressions} diagnosisList={diagnosisList}/>
            : null
          }
        </div>
      </Spin>
    </div>
  );
}

export default memo(Index);
