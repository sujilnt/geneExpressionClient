import React, {memo, useCallback, useMemo} from "react";
import {Dispatch, useDispatch} from 'umi';
import {Select,Card,Button,Slider,Tooltip} from 'antd';
import {FilterOptions, Filters, GeneAction} from "@/pages/model";
import styles from "./style.less";

interface ChartProps{
  filterOptions: FilterOptions;
  selectedFilters: FilterOptions;
  isLoading: boolean;
  zScorePercentage: number;
  isDataEmpty: boolean;
}

function getDispatchMethods(dispatch: Dispatch){
  return{
    onChange(selectedFilter:Filters, value:string){
      dispatch({
        type: `genes/${GeneAction.SET_SELECTED_FILTERS}`,
        selectedFilter: selectedFilter,
        value
      })
    },
    setFilters(){
      dispatch({
        type: `genes/${GeneAction.SET_FILTERED_DATA}`
      });
    },
    setzScorePercentage(zScore:number){
      dispatch({
        type: `genes/${GeneAction.SET_ZSCORE_PERCENTAGE}`,
        zScorePercentage: zScore
      })
    }
  }
}

function ChartFilters(props:ChartProps){
  const { filterOptions, selectedFilters, isLoading, zScorePercentage, isDataEmpty }= props;
  const { onChange, setFilters,setzScorePercentage } = getDispatchMethods(useDispatch());
  const geneSymbols = filterOptions[Filters.GeneSymbols];
  const diagnosisList = filterOptions[Filters.DiagnosisList];

  const onGeneChange = useCallback((selectedGeneSymbols)=> onChange(Filters.GeneSymbols, selectedGeneSymbols) , []);
  const onDiagnosisChange = useCallback((selectedGeneSymbols) => onChange(Filters.DiagnosisList, selectedGeneSymbols) , []);
  const onzScorePercentageChange = useCallback((zScorePercentage) => setzScorePercentage(zScorePercentage) , []);

  const geneOptions = useMemo(()=> geneSymbols?.map((value:string, i)=> {
    return {label: value, value};
  }),[geneSymbols]);

  const diagnosisOptions = useMemo(()=> diagnosisList?.map((value:string, i )=>{
    return {label: value, value};
  }),[diagnosisList]);


  return(
    <div>
      <Card className={styles.container}>
        <div className={styles.flexColumn}>
          <div className={styles.formGroup}>
            <h3 className={styles.title}>Genes</h3>
            <Select
              mode="multiple"
              allowClear
              placeholder="Select a list of genes"
              onChange={onGeneChange}
              loading={isLoading}
              options={geneOptions}
              className={styles.genesSelectionField}
            />
          </div>
          <div className={styles.formGroup}>
            <h3 className={styles.title}>Diagnosis</h3>
            <Select
              mode="multiple"
              allowClear
              loading={isLoading}
              className={styles.diagnosisSelectionField}
              placeholder="Select a list of diagnosis"
              onChange={onDiagnosisChange}
              options={diagnosisOptions}
            />
          </div>
          <div className={styles.formGroup} style={{maxWidth: "200"}}>
            <Button type="primary" onClick={setFilters} disabled={isDataEmpty || !selectedFilters[Filters.DiagnosisList]}>
              Apply Filters
            </Button>
          </div>
        </div>
      </Card>
      <div className={styles.container}>
        <div className={styles.formGroup}>
          <Tooltip title={`Filters top ${zScorePercentage}% of genes based on highest gene expression (z-score)`}>
            <h3 className={styles.title}>z-score (%)</h3>
            <Slider
              tooltipVisible
              min={0}
              max={100}
              tooltipPlacement="bottom"
              onChange={onzScorePercentageChange}
              value={zScorePercentage}
              disabled={isDataEmpty}
            />
          </Tooltip>
        </div>
      </div>
    </div>
  );
}
export default memo(ChartFilters);
