import {useCallback, useEffect} from "react";
import { Dispatch, useDispatch, useSelector } from 'umi';
import Spinner from 'react-bootstrap/Spinner';


import {GeneAction} from "@/pages/model";

import 'bootstrap/dist/css/bootstrap.min.css';
import styles from './index.less';
import ChartFilters from "@/components/Filters";

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


export default function Index() {
  const {isFetchingGeneExpressions, geneExpressions, filterOptions, selectedFilters} = useSelector((state)=> ({
    ...state.genes,
    isFetchingGeneExpressions: state.loading.effects[`genes/${GeneAction.FETCH_EXPRESSION_DATA}`]
  }));

  const {onMount,onUnMount} = getDispatchedMethods(useDispatch());

  useEffect(()=>{
    onMount();

    return onUnMount;

  },[])

  if(isFetchingGeneExpressions){
    return (
      <Spinner animation="border" />
    );
  }

  console.log("render", geneExpressions, filterOptions,selectedFilters);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Pdcm gene Finder</h1>
      <ChartFilters
        filterOptions={filterOptions}
        selectedFilters={selectedFilters}
      />
    </div>
  );
}

